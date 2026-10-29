import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Thermometer, 
  Sparkles, 
  Activity, 
  Info,
  Sliders,
  Layers
} from 'lucide-react';
import { LogicGateSimulator } from '../components/circuit/LogicGateSimulator';
import { LedCircuitSimulator } from '../components/circuit/LedCircuitSimulator';
import { SensorSimulator } from '../components/circuit/SensorSimulator';
import { ArduinoSimulator } from '../components/circuit/ArduinoSimulator';

export const VirtualLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gates' | 'led' | 'sensors' | 'arduino'>('gates');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/70 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            Virtual Electronics Workbench
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive Circuit & Sensor Simulation Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Experiment with digital logic gates, DC LED circuits with Ohm&apos;s Law electrical calculations, and sensor telemetry without requiring physical hardware.
          </p>
        </div>
      </div>

      {/* Lab Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <button
          onClick={() => setActiveTab('gates')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gates'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>A. Logic Gate Simulator (AND, OR, NOT, NAND, NOR, XOR, XNOR)</span>
        </button>

        <button
          onClick={() => setActiveTab('led')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'led'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>B. Ohm&apos;s Law LED Circuit Experiment</span>
        </button>

        <button
          onClick={() => setActiveTab('sensors')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sensors'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Thermometer className="h-4 w-4" />
          <span>C. Sensor Simulator (LM35, LDR, HC-SR04 & Custom)</span>
        </button>

        <button
          onClick={() => setActiveTab('arduino')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'arduino'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>D. Arduino Project Workbench</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'gates' && <LogicGateSimulator />}
      {activeTab === 'led' && <LedCircuitSimulator />}
      {activeTab === 'sensors' && <SensorSimulator />}
      {activeTab === 'arduino' && <ArduinoSimulator />}
    </div>
  );
};

