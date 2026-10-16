# StudySync Data Synchronization & Backend Setup Guide

This guide explains how StudySync's real-time cloud data synchronization, institute-level access control, and audit logging are configured and deployed using **Supabase** while preserving 100% of the existing frontend design.

---

## 1. Architecture Overview

```
               ┌────────────────────────────────────────────────────────┐
               │         StudySync Client Application (index.html)      │
               │   • Exact original HTML/CSS design (100% preserved)    │
               │   • Supabase JavaScript SDK v2                         │
               │   • Dual-Mode: Cloud Realtime + Local IDB Cache        │
               │   • Role-Based Access Enforcer & Audit Logger          │
               └───────────────────▲────────────────┬───────────────────┘
                                   │                │
            Supabase Realtime WSS  │                │ REST / Postgres API
            (Live Changes Stream)  │                │ (RLS Enforced)
                                   │                │
               ┌───────────────────┴────────────────▼───────────────────┐
               │             Supabase Cloud PostgreSQL Database         │
               │                                                        │
               │  • institutes (Multi-tenant Partitioning)              │
               │  • courses (Lectures & Practicals with files)          │
               │  • syllabus_files (Syllabus PDFs)                      │
               │  • notes (Theory notes & units)                        │
               │  • practicals (Lab manuals & practicals)               │
               │  • question_papers (Exam papers by year/type)          │
               │  • storage_files (Persistent cloud file storage)       │
               │  • user_profiles (Admins, Teachers, Students)          │
               │  • audit_logs (Who added/edited/deleted & when)        │
               │                                                        │
               │  • Row-Level Security (RLS) Policies                   │
               │  • Realtime Replication Publication                    │
               └────────────────────────────────────────────────────────┘
```

---

## 2. Key Capabilities Implemented

1. **Institute-Level Data Isolation**:
   - Every resource and student profile is partitioned by `institute_id` (default: `'default-institute'`).
   - All students belonging to the same institute see the same shared study materials and official data.

2. **Real-time Automatic Cross-Device & Cross-Browser Synchronization**:
   - Subscribes to Supabase Realtime channel (`studysync-realtime-[institute_id]`).
   - When an administrator/teacher adds, edits, or deletes a resource on one computer/browser, the update broadcasts immediately to all connected students without needing a manual page reload.
   - Includes `BroadcastChannel` fallback for instantaneous zero-latency sync between multiple tabs on the same computer.

3. **Strict Role-Based Authorization & Security (RLS)**:
   - **Admins / Teachers**: Authorized to add, edit, or delete courses, syllabus, notes, practicals, and question papers.
   - **Students**: Authorized to view and download shared study materials and update their own personal profile (`profileForm`). Students **cannot** modify or delete official institute resources.
   - Unauthorized modifications are rejected at both client and database levels.

4. **Confidentiality & Privacy**:
   - Student passwords and private account details are protected. Students can only edit their own profile. Other students' private details are kept confidential.

5. **Comprehensive Audit Trail**:
   - Every `CREATE`, `UPDATE`, and `DELETE` action on courses, syllabus, notes, practicals, questions, and student records is saved to `public.audit_logs` with `user_email`, `user_role`, `action`, `resource_type`, `resource_id`, `resource_title`, and `timestamp`.

6. **Persistent File Storage**:
   - Files uploaded by admins (PDFs, images, documents) are stored in the `storage_files` table / Supabase Storage and cached locally.
   - Any student on any device can preview or download attached files seamlessly.

7. **Dual-Mode Resilient Fallback**:
   - When configured with Supabase credentials, full cloud multi-device sync is active.
   - If running offline or before entering credentials, the built-in local engine (IndexedDB + BroadcastChannel) operates cleanly without errors.

---

## 3. Quick Setup Steps (Supabase Cloud Backend)

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **New project**, choose an organization, name your project (e.g. `studysync-db`), set a database password, and select your preferred region.
3. Wait ~1 minute for the database to provision.

### Step 2: Run the Database Migrations (`schema.sql`)
1. In your Supabase dashboard, click **SQL Editor** from the left navigation bar.
2. Click **New query**.
3. Open [`schema.sql`](file:///f:/exisfile/psd/schema.sql) in this directory, copy its entire contents, paste it into the Supabase SQL editor, and click **Run**.
4. This will create:
   - All 9 tables with foreign keys and indexes.
   - Row-Level Security (RLS) policies.
   - Supabase Realtime publication configuration.
   - Seed data for default admin accounts and initial courses.

### Step 3: Configure Credentials in StudySync
1. In your Supabase dashboard, navigate to **Project Settings** (gear icon) -> **API**.
2. Copy:
   - **Project URL** (e.g. `https://yourprojectid.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key (e.g. `eyJhbGciOi...`)
3. Open [`supabase-config.js`](file:///f:/exisfile/psd/supabase-config.js) in your project directory and paste your values:
   ```javascript
   window.STUDYSYNC_CONFIG = {
     supabaseUrl: 'https://yourprojectid.supabase.co',
     supabaseAnonKey: 'your-actual-anon-key-here',
     instituteId: 'default-institute',
     department: 'Computer Science and Engineering',
     realtimeEnabled: true
   };
   ```
   *(Alternatively, you can open your browser console in StudySync and run: `window.setStudySyncSupabase('https://yourprojectid.supabase.co', 'your-anon-key')`)*

---

## 4. Verification & Testing

### Test 1: Shared Resource Management (Admin Role)
1. Open `index.html` in Browser A.
2. Click **Student login**, then click **Admin login** (or navigate to admin login).
3. Log in using an authorized admin account:
   - **Email / Username**: `adityaguraval10@gmail.com`
   - **Password**: `12345`
4. Go to **Manage courses** or **Upload notes**:
   - Add a new course or upload a note with a file.
   - Edit an existing course.
   - Verify success banner and check `audit_logs` in Supabase dashboard.

### Test 2: Real-time Multi-Device / Multi-Browser Synchronization (Student Role)
1. Open `index.html` in Browser B (or another device/incognito window).
2. Log in as a student (or view the student dashboard):
   - **Email**: student email created by admin (or default student)
3. Notice that the new course and note added in Browser A appear **immediately** on Browser B.
4. From Browser A, delete a resource.
5. Notice that the resource **instantly disappears** on Browser B in real time.

### Test 3: Authorization & Unauthorized Access Prevention
1. As a logged-in student, try to access `/admin` or invoke admin management actions.
2. The system enforces role checking and bounces the user to the student dashboard.
3. Attempted unauthorized edits or deletes are blocked.

### Test 4: Persistence
1. Refresh the browser page.
2. Log out and log back in.
3. All data, attached files, courses, notes, and practicals remain saved and intact.

---

## 5. File Inventory
- [`index.html`](file:///f:/exisfile/psd/index.html): Complete application with exact original frontend appearance + cloud sync engine.
- [`supabase-config.js`](file:///f:/exisfile/psd/supabase-config.js): Supabase credentials and multi-tenant institute configuration.
- [`schema.sql`](file:///f:/exisfile/psd/schema.sql): PostgreSQL tables, RLS policies, audit triggers, and seed data.
- [`BACKEND_SETUP.md`](file:///f:/exisfile/psd/BACKEND_SETUP.md): Deployment, configuration, and verification guide.
