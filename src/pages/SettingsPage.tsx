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
  Laptop
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, settings, updateSettings, resetProgress } = useApp();

  const [formData, setFormData] = useState({ ...profile });
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [aiModel, setAiModel] = useState(settings.aiModel || 'gemini-1.5-flash');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    updateSettings({ geminiApiKey: apiKey.trim(), aiModel });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
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
            Manage your student profile, configure your free Google Gemini API key, customize workspace theme, and export/import progress snapshots.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Profile & AI configurations saved successfully!</span>
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

        {/* AI API & LLM Configuration */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Google Gemini AI Engine Integration</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">SECURE LOCAL KEY</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Gemini API Key:
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste AIzaSy... key from Google AI Studio"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 focus:border-cyan-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Leave blank to automatically use the high-quality built-in ENTC Educational Knowledge Engine.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Selected Model:
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended: Ultra-fast & Free)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen High Performance)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Complex Reasoning)</option>
              </select>
            </div>

            {/* Step-by-step setup guide */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>How to obtain a free Gemini API Key:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                <li>Go to <strong className="text-cyan-400 font-mono">aistudio.google.com</strong> and sign in with your Google account.</li>
                <li>Click the blue &quot;Get API key&quot; button in the top left corner.</li>
                <li>Create a key in a new or existing Google Cloud project (free tier gives 15 RPM).</li>
                <li>Copy the key and paste it above, then click <strong>Save Settings</strong>.</li>
              </ol>
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
