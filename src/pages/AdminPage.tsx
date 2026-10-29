import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Zap, 
  BookOpen, 
  Award,
  ExternalLink,
  Sparkles,
  Gamepad2,
  Thermometer,
  Layers,
  Code2,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/authService';
import { CustomSensor, QuizQuestion, ArduinoProject, SubjectCategory, DifficultyLevel } from '../types';

export const AdminPage: React.FC = () => {
  const { 
    currentUser, 
    accounts, 
    addStudent, 
    deleteStudent, 
    switchAccount,
    customSensors,
    addCustomSensor,
    deleteCustomSensor,
    customQuizzes,
    addCustomQuiz,
    arduinoProjects,
    addArduinoProject,
    deleteArduinoProject
  } = useApp();

  const [activeTab, setActiveTab] = useState<'students' | 'games' | 'sensors' | 'arduino'>('students');

  // Student Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('student123');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('Electronics & Telecommunication');
  const [semester, setSemester] = useState('6th Semester (Junior Year)');
  const [studentMsg, setStudentMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Custom Sensor Form State
  const [sensorName, setSensorName] = useState('');
  const [sensorType, setSensorType] = useState<'analog' | 'digital'>('analog');
  const [sensorUnit, setSensorUnit] = useState('PPM');
  const [sensorMin, setSensorMin] = useState(0);
  const [sensorMax, setSensorMax] = useState(1000);
  const [sensorDefault, setSensorDefault] = useState(250);
  const [sensorThreshold, setSensorThreshold] = useState(600);
  const [sensorPin, setSensorPin] = useState('A3');
  const [sensorFormula, setSensorFormula] = useState('V_out = (Sensor_Val / Max_Val) * 5.0V');
  const [sensorDesc, setSensorDesc] = useState('');
  const [sensorIcon, setSensorIcon] = useState('Flame');
  const [sensorMsg, setSensorMsg] = useState<string | null>(null);

  // Game / Quiz Form State
  const [quizSubject, setQuizSubject] = useState<SubjectCategory>('digital-electronics');
  const [quizDiff, setQuizDiff] = useState<DifficultyLevel>('Beginner');
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOpt0, setQuizOpt0] = useState('');
  const [quizOpt1, setQuizOpt1] = useState('');
  const [quizOpt2, setQuizOpt2] = useState('');
  const [quizOpt3, setQuizOpt3] = useState('');
  const [quizCorrect, setQuizCorrect] = useState<number>(0);
  const [quizExplanation, setQuizExplanation] = useState('');
  const [quizXp, setQuizXp] = useState<number>(25);
  const [quizMsg, setQuizMsg] = useState<string | null>(null);

  // Arduino Project Form State
  const [ardTitle, setArdTitle] = useState('');
  const [ardDesc, setArdDesc] = useState('');
  const [ardCategory, setArdCategory] = useState('Sensors & Actuators');
  const [ardPin, setArdPin] = useState<number>(9);
  const [ardActuator, setArdActuator] = useState<'motor' | 'relay' | 'buzzer' | 'led'>('led');
  const [ardInput, setArdInput] = useState<'potentiometer' | 'button' | 'analog-temp'>('analog-temp');
  const [ardSketch, setArdSketch] = useState<string>(`// Arduino UNO Project: Custom Sketch
const int INPUT_PIN = A0;
const int ACTUATOR_PIN = 9;
const int THRESHOLD = 500;

void setup() {
  Serial.begin(115200);
  pinMode(ACTUATOR_PIN, OUTPUT);
  Serial.println("Custom Arduino System Initialized!");
}

void loop() {
  int sensorValue = analogRead(INPUT_PIN);
  Serial.print("Raw Sensor Value: ");
  Serial.println(sensorValue);

  if (sensorValue >= THRESHOLD) {
    digitalWrite(ACTUATOR_PIN, HIGH);
    Serial.println("STATUS: ALARM TRIGGERED (Pin HIGH)");
  } else {
    digitalWrite(ACTUATOR_PIN, LOW);
    Serial.println("STATUS: NORMAL (Pin LOW)");
  }

  delay(600);
}`);
  const [ardMsg, setArdMsg] = useState<string | null>(null);

  // Access check
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-slate-400 max-w-md">
          Only authorized Department Administrators can access the Control Deck, provision student accounts, add sensors, and create Arduino projects.
        </p>
      </div>
    );
  }

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentMsg(null);

    const res = addStudent({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      rollNumber: rollNumber.trim() || `ENTC-2026-${Math.floor(100 + Math.random() * 900)}`,
      branch,
      semester,
    });

    if (res.success) {
      setStudentMsg({ type: 'success', text: `Student ${name} successfully enrolled and provisioned!` });
      setName('');
      setEmail('');
      setRollNumber('');
      setPassword('student123');
    } else {
      setStudentMsg({ type: 'error', text: res.error || 'Failed to add student.' });
    }
  };

  const handleCreateSensor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sensorName.trim()) return;

    const newSensor: CustomSensor = {
      id: 'sensor-' + Date.now(),
      name: sensorName.trim(),
      type: sensorType,
      unit: sensorUnit.trim() || 'Units',
      minVal: Number(sensorMin),
      maxVal: Number(sensorMax),
      defaultVal: Number(sensorDefault),
      alertThreshold: Number(sensorThreshold),
      formula: sensorFormula.trim(),
      description: sensorDesc.trim() || 'Admin-configured electronics sensor module.',
      pinNumber: sensorPin.trim(),
      iconName: sensorIcon,
      createdBy: currentUser.profile.name || 'Lab Admin'
    };

    addCustomSensor(newSensor);
    setSensorMsg(`Sensor "${sensorName}" added successfully to Virtual Lab & Sensor Section!`);
    setSensorName('');
    setSensorDesc('');
    setTimeout(() => setSensorMsg(null), 3000);
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestion.trim() || !quizOpt0 || !quizOpt1) return;

    const subjectLabels: Record<SubjectCategory, string> = {
      'digital-electronics': 'Digital Electronics',
      'analog-electronics': 'Analog Electronics',
      'communication-systems': 'Communication Systems',
      'microcontrollers': 'Microcontrollers & Embedded',
      'sensors-instrumentation': 'Sensors & Instrumentation',
      'signal-processing': 'Digital Signal Processing',
      'iot': 'Internet of Things (IoT)',
      'ai-ml': 'Edge AI & Machine Learning'
    };

    const newQuiz: QuizQuestion = {
      id: 'quiz-custom-' + Date.now(),
      subject: quizSubject,
      subjectLabel: subjectLabels[quizSubject] || 'Electronics',
      difficulty: quizDiff,
      question: quizQuestion.trim(),
      options: [quizOpt0.trim(), quizOpt1.trim(), quizOpt2.trim(), quizOpt3.trim()],
      correctIndex: quizCorrect,
      explanation: quizExplanation.trim() || 'Verified by Department Administrator.',
      xpReward: Number(quizXp) || 25
    };

    addCustomQuiz(newQuiz);
    setQuizMsg(`Question added to Game Zone! Students will now encounter it in Quizzes.`);
    setQuizQuestion('');
    setQuizOpt0('');
    setQuizOpt1('');
    setQuizOpt2('');
    setQuizOpt3('');
    setQuizExplanation('');
    setTimeout(() => setQuizMsg(null), 3000);
  };

  const handleCreateArduinoProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ardTitle.trim() || !ardSketch.trim()) return;

    const newProject: ArduinoProject = {
      id: 'ard-custom-' + Date.now(),
      title: ardTitle.trim(),
      description: ardDesc.trim() || 'Admin-created Arduino workbench simulation.',
      category: ardCategory,
      connectedPin: Number(ardPin),
      actuatorType: ardActuator,
      sensorInputType: ardInput,
      sketchCode: ardSketch.trim()
    };

    addArduinoProject(newProject);
    setArdMsg(`Arduino Project "${ardTitle}" published! Students can now run and inspect it in the Arduino Workbench.`);
    setArdTitle('');
    setArdDesc('');
    setTimeout(() => setArdMsg(null), 3500);
  };

  const studentAccounts = accounts.filter(a => a.role === 'student');

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950 border border-purple-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <ShieldCheck className="h-3.5 w-3.5" />
              Administrative Control Deck
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Lab Management & Curriculum Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enroll students, create interactive Game Zone quizzes, provision custom sensors with live telemetry, and build Arduino projects with C++ sketches and virtual pin actuators.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
              <div className="text-[11px] text-slate-400">Total Students</div>
              <div className="text-xl font-bold font-mono text-purple-300">{studentAccounts.length} Enrolled</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-right">
              <div className="text-[11px] text-slate-400">Custom Items</div>
              <div className="text-xl font-bold font-mono text-cyan-300">
                {customSensors.length + customQuizzes.length + arduinoProjects.length} Created
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'students'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>1. Student Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'games'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Gamepad2 className="h-4 w-4" />
          <span>2. Game Zone Quizzes</span>
        </button>

        <button
          onClick={() => setActiveTab('sensors')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sensors'
              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Thermometer className="h-4 w-4" />
          <span>3. Sensor Section</span>
        </button>

        <button
          onClick={() => setActiveTab('arduino')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'arduino'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>4. Arduino Projects</span>
        </button>
      </div>

      {/* TAB 1: STUDENT DIRECTORY & PROVISIONING */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <UserPlus className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Enroll New Student</h3>
              </div>

              {studentMsg && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  studentMsg.type === 'success'
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                }`}>
                  {studentMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <span>{studentMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Student Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Academic Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@entc.edu"
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Roll Number:
                    </label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="ENTC-2026-115"
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Password:
                    </label>
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Branch:
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Enroll Student Account</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Enrolled Students ({studentAccounts.length})</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      deleteStudent('student-1');
                      deleteStudent('student-2');
                      setStudentMsg({ type: 'success', text: 'Demo accounts removed.' });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Demo Students</span>
                  </button>
                </div>
              </div>

              {studentAccounts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl space-y-2">
                  <p>No students enrolled yet. Use the form on the left to add students.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentAccounts.map((student) => {
                    const sProgress = authService.getUserProgress(student.id);
                    return (
                      <div
                        key={student.id}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-sm">
                            {student.profile.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>{student.profile.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                                {student.profile.rollNumber}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">{student.email}</div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-mono">
                              <span className="text-cyan-400 font-bold">{sProgress.totalXp} XP</span>
                              <span>{sProgress.completedLessons.length} Lessons</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => switchAccount(student.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
                            <span>Switch</span>
                          </button>
                          <button
                            onClick={() => deleteStudent(student.id)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GAME ZONE / QUIZ QUESTIONS */}
      {activeTab === 'games' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Gamepad2 className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Add Question to Game Zone</h3>
              </div>

              {quizMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{quizMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateQuiz} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Subject:</label>
                    <select
                      value={quizSubject}
                      onChange={(e) => setQuizSubject(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="digital-electronics">Digital Electronics</option>
                      <option value="analog-electronics">Analog Electronics</option>
                      <option value="communication-systems">Communication Systems</option>
                      <option value="microcontrollers">Microcontrollers</option>
                      <option value="sensors-instrumentation">Sensors & Instrumentation</option>
                      <option value="signal-processing">Signal Processing</option>
                      <option value="iot">IoT</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Difficulty:</label>
                    <select
                      value={quizDiff}
                      onChange={(e) => setQuizDiff(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Question Statement:</label>
                  <textarea
                    required
                    rows={2}
                    value={quizQuestion}
                    onChange={(e) => setQuizQuestion(e.target.value)}
                    placeholder="e.g. Which logic gate is considered functionally universal alone?"
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block">4 Options (Select radio for correct answer):</label>
                  {[
                    { opt: quizOpt0, setOpt: setQuizOpt0, idx: 0, label: 'A' },
                    { opt: quizOpt1, setOpt: setQuizOpt1, idx: 1, label: 'B' },
                    { opt: quizOpt2, setOpt: setQuizOpt2, idx: 2, label: 'C' },
                    { opt: quizOpt3, setOpt: setQuizOpt3, idx: 3, label: 'D' },
                  ].map((o) => (
                    <div key={o.idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={quizCorrect === o.idx}
                        onChange={() => setQuizCorrect(o.idx)}
                        className="accent-cyan-400 h-4 w-4"
                      />
                      <span className="text-xs font-bold text-slate-400 w-4">{o.label}.</span>
                      <input
                        type="text"
                        required
                        value={o.opt}
                        onChange={(e) => o.setOpt(e.target.value)}
                        placeholder={`Option ${o.label}`}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Explanation / Derivation:</label>
                  <input
                    type="text"
                    value={quizExplanation}
                    onChange={(e) => setQuizExplanation(e.target.value)}
                    placeholder="e.g. NAND and NOR gates can implement any Boolean function."
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Publish Question to Game Zone</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl flex-1">
              <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800 mb-4 flex items-center justify-between">
                <span>Custom Questions ({customQuizzes.length})</span>
                <span className="text-xs text-slate-400 font-normal">Active in Quiz Zone</span>
              </h3>

              {customQuizzes.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                  No custom questions created yet. Use the form to add one.
                </div>
              ) : (
                <div className="space-y-3">
                  {customQuizzes.map((q) => (
                    <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-xs font-bold text-white">{q.question}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {q.difficulty}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
                        {q.options.map((opt, i) => (
                          <div key={i} className={i === q.correctIndex ? 'text-emerald-400 font-bold' : ''}>
                            {String.fromCharCode(65 + i)}. {opt} {i === q.correctIndex ? '✓' : ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SENSOR SECTION CREATOR */}
      {activeTab === 'sensors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Thermometer className="h-5 w-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Add New Sensor to Lab</h3>
              </div>

              {sensorMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{sensorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateSensor} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Sensor Name:</label>
                    <input
                      type="text"
                      required
                      value={sensorName}
                      onChange={(e) => setSensorName(e.target.value)}
                      placeholder="e.g. MQ-135 Gas Sensor"
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Pin Connection:</label>
                    <input
                      type="text"
                      required
                      value={sensorPin}
                      onChange={(e) => setSensorPin(e.target.value)}
                      placeholder="A1, A2, D4"
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Signal Type:</label>
                    <select
                      value={sensorType}
                      onChange={(e) => setSensorType(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="analog">Analog</option>
                      <option value="digital">Digital</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Unit:</label>
                    <input
                      type="text"
                      required
                      value={sensorUnit}
                      onChange={(e) => setSensorUnit(e.target.value)}
                      placeholder="PPM, dB, Lux"
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Alert Threshold:</label>
                    <input
                      type="number"
                      required
                      value={sensorThreshold}
                      onChange={(e) => setSensorThreshold(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Min Value:</label>
                    <input
                      type="number"
                      value={sensorMin}
                      onChange={(e) => setSensorMin(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Max Value:</label>
                    <input
                      type="number"
                      value={sensorMax}
                      onChange={(e) => setSensorMax(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Default Value:</label>
                    <input
                      type="number"
                      value={sensorDefault}
                      onChange={(e) => setSensorDefault(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Transfer Formula:</label>
                  <input
                    type="text"
                    value={sensorFormula}
                    onChange={(e) => setSensorFormula(e.target.value)}
                    placeholder="e.g. V_out = (Val / Max) * 5.0"
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Technical Description:</label>
                  <textarea
                    rows={2}
                    value={sensorDesc}
                    onChange={(e) => setSensorDesc(e.target.value)}
                    placeholder="Explains physical sensing mechanism, op-amp interface, and calibration..."
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Publish Sensor to Virtual Lab</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl flex-1">
              <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800 mb-4 flex items-center justify-between">
                <span>Active Custom Sensors ({customSensors.length})</span>
                <span className="text-xs text-slate-400 font-normal">Available in Virtual Lab</span>
              </h3>

              <div className="space-y-3">
                {customSensors.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{s.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                          Pin {s.pinNumber}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteCustomSensor(s.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Sensor"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-400">{s.description}</div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-400 pt-1">
                      <span>Range: {s.minVal} - {s.maxVal} {s.unit}</span>
                      <span>Alert: &ge; {s.alertThreshold} {s.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ARDUINO PROJECT CREATOR ("drdino project") */}
      {activeTab === 'arduino' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Layers className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create Arduino Project ("drdino project")</h3>
              </div>

              {ardMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{ardMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateArduinoProject} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Project Title:</label>
                  <input
                    type="text"
                    required
                    value={ardTitle}
                    onChange={(e) => setArdTitle(e.target.value)}
                    placeholder="e.g. Arduino Smart Plant Watering Pump Controller"
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Actuator Type:</label>
                    <select
                      value={ardActuator}
                      onChange={(e) => setArdActuator(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="led">LED Indicator</option>
                      <option value="relay">Relay Module</option>
                      <option value="motor">DC Fan / Motor</option>
                      <option value="buzzer">Piezo Buzzer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Connected Pin:</label>
                    <input
                      type="number"
                      value={ardPin}
                      onChange={(e) => setArdPin(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Sensor Input:</label>
                    <select
                      value={ardInput}
                      onChange={(e) => setArdInput(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                    >
                      <option value="analog-temp">Analog Temperature</option>
                      <option value="potentiometer">Potentiometer / LDR</option>
                      <option value="button">Digital Push Button</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Description:</label>
                  <input
                    type="text"
                    value={ardDesc}
                    onChange={(e) => setArdDesc(e.target.value)}
                    placeholder="Reads analog soil moisture and activates 5V pump relay..."
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Arduino C++ Sketch (.ino):
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={ardSketch}
                    onChange={(e) => setArdSketch(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Publish Arduino Project to Workbench</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl flex-1">
              <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800 mb-4 flex items-center justify-between">
                <span>Arduino Projects ({arduinoProjects.length})</span>
                <span className="text-xs text-slate-400 font-normal">Active in Virtual Lab</span>
              </h3>

              <div className="space-y-3">
                {arduinoProjects.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{p.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          Pin {p.connectedPin} ({p.actuatorType})
                        </span>
                      </div>
                      <button
                        onClick={() => deleteArduinoProject(p.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-400">{p.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
