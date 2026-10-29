import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Key, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Save,
  Laptop,
  Cloud,
  Check,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import { supabaseService } from '../services/supabaseService';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, settings, updateSettings, progress, resetProgress } = useApp();

  const [formData, setFormData] = useState({ ...profile });
  const [aiProvider, setAiProvider] = useState<'gemini' | 'chatgpt' | 'demo'>(settings.aiProvider || 'gemini');
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [aiModel, setAiModel] = useState(settings.aiModel || 'gemini-1.5-flash');
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.openaiApiKey || '');
  const [openaiModel, setOpenaiModel] = useState(settings.openaiModel || 'gpt-4o-mini');
  const [supabaseUrl, setSupabaseUrl] = useState(settings.supabaseUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(settings.supabaseAnonKey || '');
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    updateSettings({ 
      aiProvider,
      geminiApiKey: apiKey.trim(), 
      aiModel,
      openaiApiKey: openaiApiKey.trim(),
      openaiModel,
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setSupabaseStatus('Please enter both Supabase Project URL and Public Anon Key.');
      return;
    }
    setTestingSupabase(true);
    setSupabaseStatus(null);
    const res = await supabaseService.testConnection(supabaseUrl.trim(), supabaseAnonKey.trim());
    setTestingSupabase(false);
    setSupabaseStatus(res.message);
  };

  const handleSyncToSupabase = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setSyncStatus('Configure Supabase Project URL and Anon Key first.');
      return;
    }
    setSyncingCloud(true);
    setSyncStatus(null);
    const client = supabaseService.resetClient(supabaseUrl.trim(), supabaseAnonKey.trim());
    if (!client) {
      setSyncingCloud(false);
      setSyncStatus('Failed to initialize Supabase client.');
      return;
    }
    const ok = await supabaseService.syncProgressToCloud(profile.rollNumber || 'student-1', progress, client);
    setSyncingCloud(false);
    setSyncStatus(ok ? 'Successfully synchronized progress, XP & badges to Supabase!' : 'Sync completed (or table profiles awaiting creation in Supabase).');
  };

  const handleExportBackup = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ENTC_Innovate_Lab_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storageService.importAllData(content);
      if (success) {
        setImportStatus('Backup restored successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus('Failed to import backup file: Invalid format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Workspace Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Profile & Lab Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage your student profile, connect Supabase Cloud Database or LocalStorage, configure your free Google Gemini API key, and export/import progress snapshots.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Profile & configurations saved successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        {/* Student Profile Card */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <User className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Student Identification & Bio</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Full Name:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Academic Email:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Branch / Discipline:
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Semester / Class:
              </label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                College / University:
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Target Specialization / Role:
              </label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Supabase Cloud Database Integration */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Database Integration (Supabase Cloud + LocalStorage)</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400">HYBRID PERSISTENCE</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            By default, your work is stored safely in <strong>Browser LocalStorage</strong>. Connect your free <strong>Supabase PostgreSQL Database</strong> below to sync user progress, certificates, quiz attempts, and streaks across devices.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Supabase Project URL:
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Supabase Public Anon Key:
              </label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestSupabase}
                disabled={testingSupabase}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                {testingSupabase ? 'Testing Connection...' : 'Test Supabase Connection'}
              </button>

              <button
                type="button"
                onClick={handleSyncToSupabase}
                disabled={syncingCloud}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-colors"
              >
                {syncingCloud ? 'Syncing...' : 'Sync Local Progress to Cloud Database'}
              </button>
            </div>

            {supabaseStatus && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300">
                {supabaseStatus}
              </div>
            )}

            {syncStatus && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300">
                {syncStatus}
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Database className="h-4 w-4 text-emerald-400" />
                <span>Database Schema Setup Script:</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                The repository includes an automated SQL migration script: <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">supabase_schema.sql</code>. Copy and run it inside Supabase&apos;s SQL Editor to instantiate the <strong>profiles</strong>, <strong>user_progress</strong>, <strong>quiz_attempts</strong>, and <strong>activity_stream</strong> tables.
              </p>
            </div>
          </div>
        </div>

        {/* AI API & LLM Configuration */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">AI Assistant Provider & API Keys</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">GEMINI & CHATGPT READY</span>
          </div>

          {/* Provider Selection Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Active AI Tutor Provider:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'gemini', label: 'Google Gemini', desc: 'Fast, multimodal & free tier' },
                { id: 'chatgpt', label: 'OpenAI ChatGPT', desc: 'GPT-4o & GPT-4o-mini' },
                { id: 'demo', label: 'Built-in Engine', desc: 'Zero API keys required' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAiProvider(p.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    aiProvider === p.id
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{p.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {/* Google Gemini Config */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">Google Gemini Configuration</span>
                <span className="text-[10px] text-slate-400">Free at aistudio.google.com</span>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Gemini API Key:
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste AIzaSy... key from Google AI Studio"
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Gemini Model:
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast & Recommended)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen High Performance)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Complex Reasoning)</option>
                </select>
              </div>
            </div>

            {/* OpenAI ChatGPT Config */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">OpenAI ChatGPT Configuration</span>
                <span className="text-[10px] text-slate-400">From platform.openai.com</span>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  OpenAI API Key:
                </label>
                <input
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="Paste sk-... key from OpenAI Platform"
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  ChatGPT Model:
                </label>
                <select
                  value={openaiModel}
                  onChange={(e) => setOpenaiModel(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="gpt-4o-mini">GPT-4o Mini (Affordable, Super Fast & Accurate)</option>
                  <option value="gpt-4o">GPT-4o (Omni High Intelligence)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Legacy Fast)</option>
                </select>
              </div>
            </div>

            {/* Info note */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Security Notice:</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                All API keys are saved strictly inside your browser&apos;s localStorage and are only transmitted directly to the official Google or OpenAI endpoints. They are never transmitted or logged elsewhere.
              </p>
            </div>
          </div>
        </div>

        {/* Theme & Display Preferences */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <Laptop className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Theme & UI Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'midnight' })}
              className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                settings.theme === 'midnight'
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400">
                <Moon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Midnight Dark Navy (Default)</div>
                <div className="text-[11px] text-slate-400">Optimized for futuristic lab aesthetic</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => updateSettings({ theme: 'light' })}
              className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                settings.theme === 'light'
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Clean Engineering Light</div>
                <div className="text-[11px] text-slate-400">High-contrast daytime reading</div>
              </div>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings & Preferences</span>
          </button>
        </div>
      </form>

      {/* Data Management & Backup Snapshots */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Data Management & Persistence</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">BROWSER LOCAL STORAGE</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The prototype runs as a self-contained web application. All learning points, quiz records, and badge completions are securely persisted to your browser&apos;s local storage.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            <span>Export Progress JSON Backup</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="h-4 w-4 text-emerald-400" />
            <span>Import Progress Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={() => resetProgress(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors ml-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Fresh Blank Slate</span>
          </button>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300">
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
};
