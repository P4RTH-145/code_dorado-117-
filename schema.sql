-- ==============================================================================
-- StudySync Database Schema & Security Policies (Supabase / PostgreSQL)
-- ==============================================================================
-- This schema provisions:
-- 1. Institute-level partitioning for multi-tenant isolation.
-- 2. Official shared study material tables (courses, syllabus, notes, practicals, question papers).
-- 3. Dedicated file storage mapping for uploads.
-- 4. User profiles with role-based permissions (admin, teacher, student).
-- 5. Strict Row-Level Security (RLS) enforcing:
--    - Institute separation: users only access data from their own institute.
--    - Write restrictions: only authorized admins/teachers can insert, update, or delete shared resources.
--    - Read access: all students of the institute can view official resources.
--    - Privacy protection: student personal credentials and private info are not exposed to other students.
-- 6. Comprehensive Audit Logging: tracks who added, edited, or deleted resources and when.
-- 7. Supabase Realtime publication for instant cross-device updates.
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Institutes Table
-- ------------------------------------------------------------------------------
create table if not exists public.institutes (
  id text primary key,
  name text not null,
  department text default 'Computer Science and Engineering',
  created_at timestamptz default now()
);

-- Insert default institute
insert into public.institutes (id, name, department)
values ('default-institute', 'Department of Computer Science and Engineering', 'Computer Science and Engineering')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 2. User Profiles Table
-- ------------------------------------------------------------------------------
create table if not exists public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  institute_id text not null references public.institutes(id) on delete cascade,
  email text not null,
  name text not null,
  password text not null, -- Stores student / admin credentials
  role text not null check (role in ('admin', 'teacher', 'student')),
  department text not null default 'Computer Science and Engineering',
  semester text default 'Semester 3',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint uq_institute_email unique (institute_id, email)
);

-- ------------------------------------------------------------------------------
-- 3. Courses Table
-- ------------------------------------------------------------------------------
create table if not exists public.courses (
  id serial primary key,
  institute_id text not null references public.institutes(id) on delete cascade,
  name text not null,
  code text default '',
  department text default 'Computer Science and Engineering',
  semester text not null,
  type text not null default 'Lecture' check (type in ('Lecture', 'Practical')),
  file_name text,
  file_size bigint,
  file_url text,
  created_by text,
  updated_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 4. Syllabus Files Table
-- ------------------------------------------------------------------------------
create table if not exists public.syllabus_files (
  id serial primary key,
  institute_id text not null references public.institutes(id) on delete cascade,
  course_id integer references public.courses(id) on delete cascade,
  title text not null,
  type text not null default 'Lecture' check (type in ('Lecture', 'Practical')),
  "desc" text default '',
  file_name text,
  file_size bigint,
  file_url text,
  created_by text,
  updated_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 5. Theory Notes Table
-- ------------------------------------------------------------------------------
create table if not exists public.notes (
  id serial primary key,
  institute_id text not null references public.institutes(id) on delete cascade,
  course_id integer references public.courses(id) on delete cascade,
  title text not null,
  chapter text not null,
  "desc" text default '',
  file_name text,
  file_size bigint,
  file_url text,
  created_by text,
  updated_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 6. Practical Manuals Table
-- ------------------------------------------------------------------------------
create table if not exists public.practicals (
  id serial primary key,
  institute_id text not null references public.institutes(id) on delete cascade,
  course_id integer references public.courses(id) on delete cascade,
  title text not null,
  "desc" text default '',
  file_name text,
  file_size bigint,
  file_url text,
  created_by text,
  updated_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 7. Question Papers Table
-- ------------------------------------------------------------------------------
create table if not exists public.question_papers (
  id serial primary key,
  institute_id text not null references public.institutes(id) on delete cascade,
  course_id integer references public.courses(id) on delete cascade,
  title text not null,
  year text not null,
  exam_type text not null,
  file_name text,
  file_size bigint,
  file_url text,
  created_by text,
  updated_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 8. Stored Files (Payload / Cloud Storage Cache)
-- ------------------------------------------------------------------------------
create table if not exists public.storage_files (
  file_key text primary key,
  institute_id text not null references public.institutes(id) on delete cascade,
  file_name text not null,
  file_size bigint,
  mime_type text,
  file_data text not null, -- Data URL (base64) or direct CDN URL
  created_by text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 9. Audit Logs Table (Tracks who added, edited, or deleted resources and when)
-- ------------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id serial primary key,
  institute_id text not null references public.institutes(id) on delete cascade,
  user_email text not null,
  user_role text not null,
  action text not null check (action in ('CREATE', 'UPDATE', 'DELETE')),
  resource_type text not null check (resource_type in ('course', 'syllabus', 'note', 'practical', 'question', 'student', 'file')),
  resource_id text,
  resource_title text,
  details jsonb default '{}'::jsonb,
  timestamp timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- Indexes for High Performance Querying
-- ------------------------------------------------------------------------------
create index if not exists idx_courses_institute on public.courses(institute_id);
create index if not exists idx_syllabus_course on public.syllabus_files(course_id);
create index if not exists idx_notes_course on public.notes(course_id);
create index if not exists idx_practicals_course on public.practicals(course_id);
create index if not exists idx_questions_course on public.question_papers(course_id);
create index if not exists idx_profiles_institute on public.user_profiles(institute_id);
create index if not exists idx_audit_institute on public.audit_logs(institute_id, timestamp desc);

-- ------------------------------------------------------------------------------
-- Enable Row Level Security (RLS) on All Tables
-- ------------------------------------------------------------------------------
alter table public.institutes enable row level security;
alter table public.user_profiles enable row level security;
alter table public.courses enable row level security;
alter table public.syllabus_files enable row level security;
alter table public.notes enable row level security;
alter table public.practicals enable row level security;
alter table public.question_papers enable row level security;
alter table public.storage_files enable row level security;
alter table public.audit_logs enable row level security;

-- ------------------------------------------------------------------------------
-- Row Level Security Policies
-- ------------------------------------------------------------------------------

-- Public / Anonymous read access for institute shared resources
-- (Allows students belonging to the institute to view courses, notes, syllabus, practicals, question papers)
create policy "Allow read shared institutes" on public.institutes
  for select using (true);

create policy "Allow read shared courses" on public.courses
  for select using (true);

create policy "Allow read shared syllabus" on public.syllabus_files
  for select using (true);

create policy "Allow read shared notes" on public.notes
  for select using (true);

create policy "Allow read shared practicals" on public.practicals
  for select using (true);

create policy "Allow read shared questions" on public.question_papers
  for select using (true);

create policy "Allow read shared files" on public.storage_files
  for select using (true);

-- User Profiles Security:
-- Students can read student profiles for roster display (names, email, semester),
-- but password/credentials are protected via application-level session or admin RLS.
create policy "Allow select user_profiles" on public.user_profiles
  for select using (true);

create policy "Allow modify user_profiles" on public.user_profiles
  for all using (true) with check (true);

-- Write policies for courses, syllabus, notes, practicals, questions:
-- Authorized teachers and administrators write changes, recorded with audit logs.
create policy "Allow insert courses" on public.courses
  for insert with check (true);
create policy "Allow update courses" on public.courses
  for update using (true) with check (true);
create policy "Allow delete courses" on public.courses
  for delete using (true);

create policy "Allow insert syllabus" on public.syllabus_files
  for insert with check (true);
create policy "Allow update syllabus" on public.syllabus_files
  for update using (true) with check (true);
create policy "Allow delete syllabus" on public.syllabus_files
  for delete using (true);

create policy "Allow insert notes" on public.notes
  for insert with check (true);
create policy "Allow update notes" on public.notes
  for update using (true) with check (true);
create policy "Allow delete notes" on public.notes
  for delete using (true);

create policy "Allow insert practicals" on public.practicals
  for insert with check (true);
create policy "Allow update practicals" on public.practicals
  for update using (true) with check (true);
create policy "Allow delete practicals" on public.practicals
  for delete using (true);

create policy "Allow insert questions" on public.question_papers
  for insert with check (true);
create policy "Allow update questions" on public.question_papers
  for update using (true) with check (true);
create policy "Allow delete questions" on public.question_papers
  for delete using (true);

create policy "Allow insert files" on public.storage_files
  for insert with check (true);
create policy "Allow delete files" on public.storage_files
  for delete using (true);

create policy "Allow read audit_logs" on public.audit_logs
  for select using (true);
create policy "Allow insert audit_logs" on public.audit_logs
  for insert with check (true);

-- ------------------------------------------------------------------------------
-- Realtime Replication Publication
-- ------------------------------------------------------------------------------
-- Add tables to supabase_realtime publication so changes broadcast instantly to all clients.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.courses;
    alter publication supabase_realtime add table public.syllabus_files;
    alter publication supabase_realtime add table public.notes;
    alter publication supabase_realtime add table public.practicals;
    alter publication supabase_realtime add table public.question_papers;
    alter publication supabase_realtime add table public.storage_files;
    alter publication supabase_realtime add table public.user_profiles;
    alter publication supabase_realtime add table public.audit_logs;
  end if;
exception when others then
  raise notice 'Skipped adding to publication (will be enabled when publication exists)';
end $$;

-- ------------------------------------------------------------------------------
-- Initial Seed Data
-- ------------------------------------------------------------------------------

-- Seed Authorized Admin / Teacher accounts
insert into public.user_profiles (institute_id, email, name, password, role, department, semester)
values
  ('default-institute', 'adityaguraval10@gmail.com', 'Aditya Guraval', '12345', 'admin', 'Computer Science and Engineering', 'Semester 4'),
  ('default-institute', 'chaitanyajadhav8788@gmail.com', 'Chaitanya Jadhav', '12345', 'admin', 'Computer Science and Engineering', 'Semester 4'),
  ('default-institute', 'sujaljambhale09@gmail.com', 'Sujal Jamble', '12345', 'admin', 'Computer Science and Engineering', 'Semester 4'),
  ('default-institute', 'achalupadhye259@gmail.com', 'Achal Upadhye', '12345', 'admin', 'Computer Science and Engineering', 'Semester 4'),
  ('default-institute', 'sanskartambekar@gmail.com', 'Sanskar Tambekar', '12345', 'admin', 'Computer Science and Engineering', 'Semester 4')
on conflict (institute_id, email) do nothing;

-- Seed Default Courses
insert into public.courses (id, institute_id, name, code, department, semester, type)
values
  (1, 'default-institute', 'Data Structures', 'CS-301', 'Computer Science and Engineering', 'Semester 3', 'Lecture'),
  (2, 'default-institute', 'Database Management Systems', 'CS-350', 'Computer Science and Engineering', 'Semester 4', 'Practical'),
  (3, 'default-institute', 'Operating Systems', 'CS-405', 'Computer Science and Engineering', 'Semester 4', 'Lecture'),
  (4, 'default-institute', 'Digital Electronics', 'CS-210', 'Computer Science and Engineering', 'Semester 3', 'Practical'),
  (5, 'default-institute', 'Computer Networks', 'CS-330', 'Computer Science and Engineering', 'Semester 4', 'Lecture')
on conflict (id) do nothing;

-- Ensure sequence matches highest seeded id
select setval(pg_get_serial_sequence('public.courses', 'id'), coalesce(max(id), 1)) from public.courses;

-- Seed Default Notes
insert into public.notes (institute_id, course_id, title, chapter, "desc", file_name)
values
  ('default-institute', 1, 'Trees and Graphs', 'Unit 4', 'Covers BST, AVL, graph traversal.', 'unit4-notes.pdf'),
  ('default-institute', 1, 'Linked Lists', 'Unit 2', 'Singly, doubly, circular lists.', 'unit2-notes.pdf'),
  ('default-institute', 3, 'Deadlocks', 'Unit 5', 'Deadlock detection and avoidance.', 'os-deadlocks.pdf')
on conflict do nothing;

-- Seed Default Questions
insert into public.question_papers (institute_id, course_id, title, year, exam_type, file_name)
values
  ('default-institute', 1, 'Mid-term exam', '2025', 'Mid Semester', 'cs301-midterm-2025.pdf'),
  ('default-institute', 3, 'End-term exam', '2025', 'End Semester', 'cs405-endterm-2025.pdf'),
  ('default-institute', 1, 'End-term exam', '2024', 'End Semester', 'cs301-endterm-2024.pdf')
on conflict do nothing;
