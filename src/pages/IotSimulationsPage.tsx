import React from 'react';
import { IotScenarios } from '../components/iot/IotScenarios';

export const IotSimulationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/70 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Connected Embedded Nodes
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            IoT & Real-World System Simulations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Experience real-world smart scenarios: Smart Home Automation with PIR motion lighting, Industrial Chamber Temperature Safety with emergency blower cooling, and Smart Agriculture Irrigation.
          </p>
        </div>
      </div>

      <IotScenarios />
    </div>
  );
};
