import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Gauge, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  Info, 
  Sliders, 
  Activity, 
  Power,
  Flame,
  Sun,
  Radio,
  Sparkles
} from 'lucide-react';
import { GateType, TruthTableRow } from '../types';
import { storageService, triggerConfetti } from '../services/storageService';

export const VirtualLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gates' | 'circuit' | 'sensors'>('gates');

  // --- Logic Gate Simulator State ---
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(1);

  // Compute logic gate output
  const computeGateOutput = (gate: GateType, a: number, b: number): number => {
    switch (gate) {
      case 'AND': return (a && b) ? 1 : 0;
      case 'OR': return (a || b) ? 1 : 0;
      case 'NOT': return a ? 0 : 1;
      case 'NAND': return !(a && b) ? 1 : 0;
      case 'NOR': return !(a || b) ? 1 : 0;
      case 'XOR': return (a !== b) ? 1 : 0;
      case 'XNOR': return (a === b) ? 1 : 0;
      default: return 0;
    }
  };

  const gateOutput = computeGateOutput(selectedGate, inputA, inputB);

  const getGateExplanation = (gate: GateType, a: number, b: number, out: number): string => {
    switch (gate) {
      case 'AND':
        return out === 1
          ? 'Both inputs A (1) and B (1) are HIGH, fulfilling the AND condition.'
          : `At least one input is LOW (A=${a}, B=${b}), so conduction to output is interrupted.`;
      case 'OR':
        return out === 1
          ? `Input ${a === 1 ? 'A' : 'B'} is HIGH, which satisfies the OR condition.`
          : 'Both inputs are 0, so no electrical signal triggers the output.';
      case 'NOT':
        return out === 1
          ? 'Input A is LOW (0), so inverter inverts it to HIGH (1).'
          : 'Input A is HIGH (1), so inverter inverts it to LOW (0).';
      case 'NAND':
        return out === 1
          ? `Because NOT both inputs are 1 (A=${a}, B=${b}), the inverted AND produces HIGH (1).`
          : 'Both inputs are 1, so the AND condition is met and inverted to LOW (0).';
      case 'NOR':
        return out === 1
          ? 'Neither input is HIGH (both 0), so the inverted OR output is HIGH (1).'
          : `At least one input is HIGH (A=${a}, B=${b}), driving the NOR output to LOW (0).`;
      case 'XOR':
        return out === 1
          ? `Inputs are strictly different (A=${a}, B=${b}), resulting in HIGH (1).`
          : `Inputs are identical (both ${a}), yielding LOW (0).`;
      case 'XNOR':
        return out === 1
          ? `Inputs are identical (both ${a}), resulting in HIGH (1).`
          : `Inputs differ (A=${a}, B=${b}), driving output LOW (0).`;
      default:
        return '';
    }
  };

  // Generate truth table for selected gate
  const getTruthTable = (gate: GateType): TruthTableRow[] => {
    if (gate === 'NOT') {
      return [
        { inputs: [0], output: 1, active: inputA === 0 },
        { inputs: [1], output: 0, active: inputA === 1 },
      ];
    }
    const tableInputs = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];
    return tableInputs.map(([a, b]) => ({
      inputs: [a, b],
      output: computeGateOutput(gate, a, b),
      active: inputA === a && inputB === b
    }));
  };

  // --- LED Circuit Demonstration State ---
  const [supplyVoltage, setSupplyVoltage] = useState<number>(5.0);
  const [resistorValue, setResistorValue] = useState<number>(330);
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);

  // LED physical parameters: Forward voltage drop ~ 2.0V (Standard Red/Green LED)
  const LED_FORWARD_VOLTAGE = 2.0;
  const circuitCurrentMA = isSwitchClosed && supplyVoltage > LED_FORWARD_VOLTAGE
    ? Number((((supplyVoltage - LED_FORWARD_VOLTAGE) / resistorValue) * 1000).toFixed(1))
    : 0;
  const isLedLit = isSwitchClosed && circuitCurrentMA > 1.0;
  const ledBrightness = Math.min(1, circuitCurrentMA / 25); // 25mA is standard full brightness

  // --- Sensor Simulator State ---
  // Temperature
  const [simTemp, setSimTemp] = useState<number>(36);
  const [tempThreshold, setTempThreshold] = useState<number>(45);
  const isTempAlert = simTemp >= tempThreshold;

  // Light (LDR)
  const [simLux, setSimLux] = useState<number>(320);
  const [luxThreshold, setLuxThreshold] = useState<number>(200);
  const isNightLampOn = simLux < luxThreshold;

  // Ultrasonic Distance
  const [simDistance, setSimDistance] = useState<number>(85);
  const [distanceThreshold, setDistanceThreshold] = useState<number>(30);
  const isDistanceWarning = simDistance <= distanceThreshold;

  const handleGateReset = () => {
    setInputA(0);
    setInputB(0);
  };

  const handleRecordExperiment = (name: string) => {
    storageService.recordExperimentCompleted(name);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Navigation Tabs */}
      <div className="p-2 rounded-2xl bg-[#0B101E] border border-slate-800 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('gates')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'gates'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>A. Logic Gate Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('circuit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'circuit'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>B. Active LED & Ohm's Circuit</span>
        </button>

        <button
          onClick={() => setActiveTab('sensors')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'sensors'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>C. Multi-Sensor Transducer</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTION A: LOGIC GATE SIMULATOR                           */}
      {/* ========================================================= */}
      {activeTab === 'gates' && (
        <div className="space-y-6">
          {/* Gate Selector Bar */}
          <div className="p-4 rounded-xl bg-[#0B101E] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'] as GateType[]).map((gate) => (
                <button
                  key={gate}
                  onClick={() => setSelectedGate(gate)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedGate === gate
                      ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {gate}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGateReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Inputs</span>
              </button>

              <button
                onClick={() => handleRecordExperiment(`Logic Gate: ${selectedGate}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-bold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Log Experiment (+75 XP)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive SVG Schematic Viewer (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-xl bg-[#0B101E] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Interactive {selectedGate} Gate Circuit Diagram</span>
                  </h3>
                  <span className="text-xs font-mono text-cyan-400">Click Binary Switches to Toggle</span>
                </div>

                {/* SVG Visualizer */}
                <div className="relative py-8 px-4 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center justify-center">
                  <svg width="340" height="180" viewBox="0 0 340 180" className="overflow-visible select-none">
                    {/* Wire A */}
                    <line 
                      x1="40" y1="55" x2="130" y2="55" 
                      stroke={inputA === 1 ? '#00F0FF' : '#334155'} 
                      strokeWidth="4" 
                      className="transition-colors duration-200"
                    />

                    {/* Wire B (if not NOT gate) */}
                    {selectedGate !== 'NOT' && (
                      <line 
                        x1="40" y1="125" x2="130" y2="125" 
                        stroke={inputB === 1 ? '#00F0FF' : '#334155'} 
                        strokeWidth="4" 
                        className="transition-colors duration-200"
                      />
                    )}

                    {/* Output Wire */}
                    <line 
                      x1={selectedGate.startsWith('N') || selectedGate === 'XNOR' ? '230' : '210'} 
                      y1="90" 
                      x2="290" 
                      y2="90" 
                      stroke={gateOutput === 1 ? '#10B981' : '#334155'} 
                      strokeWidth="4" 
                      className="transition-colors duration-200"
                    />

                    {/* Output LED indicator node */}
                    <circle 
                      cx="290" 
                      cy="90" 
                      r={gateOutput === 1 ? '10' : '7'} 
                      fill={gateOutput === 1 ? '#10B981' : '#1E293B'} 
                      stroke={gateOutput === 1 ? '#34D399' : '#475569'} 
                      strokeWidth="2" 
                      className="transition-all duration-300"
                    />
                    {gateOutput === 1 && (
                      <circle cx="290" cy="90" r="18" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.5" className="animate-ping" />
                    )}

                    {/* Gate Body rendering based on Type */}
                    {selectedGate === 'AND' && (
                      <path 
                        d="M 130 35 L 175 35 A 55 55 0 0 1 175 145 L 130 145 Z" 
                        fill="#0A1428" 
                        stroke="#00F0FF" 
                        strokeWidth="3.5" 
                      />
                    )}

                    {selectedGate === 'NAND' && (
                      <>
                        <path 
                          d="M 130 35 L 175 35 A 55 55 0 0 1 175 145 L 130 145 Z" 
                          fill="#0A1428" 
                          stroke="#00F0FF" 
                          strokeWidth="3.5" 
                        />
                        <circle cx="225" cy="90" r="5" fill="#0A1428" stroke="#00F0FF" strokeWidth="2.5" />
                      </>
                    )}

                    {selectedGate === 'OR' && (
                      <path 
                        d="M 125 35 Q 155 90 125 145 Q 185 145 215 90 Q 185 35 125 35 Z" 
                        fill="#0A1428" 
                        stroke="#00F0FF" 
                        strokeWidth="3.5" 
                      />
                    )}

                    {selectedGate === 'NOR' && (
                      <>
                        <path 
                          d="M 125 35 Q 155 90 125 145 Q 185 145 215 90 Q 185 35 125 35 Z" 
                          fill="#0A1428" 
                          stroke="#00F0FF" 
                          strokeWidth="3.5" 
                        />
                        <circle cx="225" cy="90" r="5" fill="#0A1428" stroke="#00F0FF" strokeWidth="2.5" />
                      </>
                    )}

                    {selectedGate === 'XOR' && (
                      <>
                        <path d="M 115 35 Q 145 90 115 145" fill="none" stroke="#00F0FF" strokeWidth="3.5" />
                        <path 
                          d="M 128 35 Q 158 90 128 145 Q 185 145 215 90 Q 185 35 128 35 Z" 
                          fill="#0A1428" 
                          stroke="#00F0FF" 
                          strokeWidth="3.5" 
                        />
                      </>
                    )}

                    {selectedGate === 'XNOR' && (
                      <>
                        <path d="M 115 35 Q 145 90 115 145" fill="none" stroke="#00F0FF" strokeWidth="3.5" />
                        <path 
                          d="M 128 35 Q 158 90 128 145 Q 185 145 215 90 Q 185 35 128 35 Z" 
                          fill="#0A1428" 
                          stroke="#00F0FF" 
                          strokeWidth="3.5" 
                        />
                        <circle cx="225" cy="90" r="5" fill="#0A1428" stroke="#00F0FF" strokeWidth="2.5" />
                      </>
                    )}

                    {selectedGate === 'NOT' && (
                      <>
                        <polygon points="130,45 130,135 210,90" fill="#0A1428" stroke="#00F0FF" strokeWidth="3.5" />
                        <circle cx="218" cy="90" r="6" fill="#0A1428" stroke="#00F0FF" strokeWidth="2.5" />
                      </>
                    )}

                    {/* Labels */}
                    <text x="10" y="60" fill="#94A3B8" fontSize="13" fontFamily="monospace">IN A</text>
                    {selectedGate !== 'NOT' && (
                      <text x="10" y="130" fill="#94A3B8" fontSize="13" fontFamily="monospace">IN B</text>
                    )}
                    <text x="280" y="60" fill="#94A3B8" fontSize="13" fontFamily="monospace">OUT Y</text>
                  </svg>
                </div>

                {/* Input Toggle Switch Controls */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">INPUT A</span>
                      <div className="text-xl font-bold font-mono text-cyan-400">{inputA}</div>
                    </div>
                    <button
                      onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                      className={`px-4 py-2 rounded-lg font-mono font-bold text-xs transition-all ${
                        inputA === 1 
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {inputA === 1 ? 'HIGH (1)' : 'LOW (0)'}
                    </button>
                  </div>

                  {selectedGate !== 'NOT' ? (
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-mono">INPUT B</span>
                        <div className="text-xl font-bold font-mono text-cyan-400">{inputB}</div>
                      </div>
                      <button
                        onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                        className={`px-4 py-2 rounded-lg font-mono font-bold text-xs transition-all ${
                          inputB === 1 
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {inputB === 1 ? 'HIGH (1)' : 'LOW (0)'}
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/40 flex items-center justify-center text-xs text-slate-500 italic">
                      Single Input Gate (Inverter)
                    </div>
                  )}
                </div>
              </div>

              {/* Output State Status & Explanation */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Calculated Output State:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                    gateOutput === 1 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${gateOutput === 1 ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {gateOutput === 1 ? 'LOGIC HIGH (1)' : 'LOGIC LOW (0)'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
                  <span className="text-cyan-400 font-semibold">Circuit Behavior: </span>
                  {getGateExplanation(selectedGate, inputA, inputB, gateOutput)}
                </p>
              </div>
            </div>

            {/* Truth Table & Instructions (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Dynamic Truth Table */}
              <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {selectedGate} Truth Table
                  </h3>
                  <span className="text-[11px] text-cyan-400 font-mono">Active Row Highlighted</span>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#080D1A] text-slate-400 font-mono uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Input A</th>
                        {selectedGate !== 'NOT' && <th className="py-2.5 px-3">Input B</th>}
                        <th className="py-2.5 px-3 text-right">Output Y</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {getTruthTable(selectedGate).map((row, idx) => (
                        <tr 
                          key={idx}
                          className={`transition-colors ${
                            row.active 
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold' 
                              : 'text-slate-300 hover:bg-slate-900/40'
                          }`}
                        >
                          <td className="py-2 px-3">{row.inputs[0]}</td>
                          {selectedGate !== 'NOT' && <td className="py-2 px-3">{row.inputs[1]}</td>}
                          <td className="py-2 px-3 text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                              row.output === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {row.output}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Beginner Experiment Instructions */}
              <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Experiment Verification Guide</span>
                </h4>
                <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                  <li>Toggle Input A and observe the instant voltage trace propagation on the diagram.</li>
                  <li>Notice how the corresponding row in the truth table dynamically illuminates in cyan.</li>
                  <li>Compare the behavior of universal gates (NAND and NOR) against their standard counterparts.</li>
                  <li>Click <strong>"Log Experiment"</strong> to earn +75 XP and update your dashboard stats.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION B: LED CIRCUIT DEMONSTRATION                      */}
      {/* ========================================================= */}
      {activeTab === 'circuit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Circuit Simulation (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-xl bg-[#0B101E] border border-slate-800 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Interactive DC Resistor & LED Circuit</h3>
                    <p className="text-xs text-slate-400">Live current flow and Ohm's law calculation</p>
                  </div>
                  <button
                    onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      isSwitchClosed 
                        ? 'bg-rose-500/20 border border-rose-500 text-rose-300' 
                        : 'bg-emerald-500/20 border border-emerald-500 text-emerald-300'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isSwitchClosed ? 'Open Switch (OFF)' : 'Close Switch (ON)'}</span>
                  </button>
                </div>

                {/* SVG Circuit Canvas */}
                <div className="py-6 px-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-center">
                  <svg width="340" height="200" viewBox="0 0 340 200" className="overflow-visible select-none">
                    {/* Top Wire */}
                    <line 
                      x1="50" y1="40" x2="140" y2="40" 
                      stroke={isSwitchClosed ? '#00F0FF' : '#334155'} 
                      strokeWidth="3.5" 
                    />

                    {/* Switch Symbol */}
                    <circle cx="140" cy="40" r="4" fill="#00F0FF" />
                    <line 
                      x1="140" y1="40" 
                      x2={isSwitchClosed ? '180' : '170'} 
                      y2={isSwitchClosed ? '40' : '20'} 
                      stroke={isSwitchClosed ? '#00F0FF' : '#F59E0B'} 
                      strokeWidth="3.5" 
                      className="transition-all duration-300"
                    />
                    <circle cx="180" cy="40" r="4" fill="#00F0FF" />

                    {/* Resistor Wire Continuation */}
                    <line 
                      x1="180" y1="40" x2="220" y2="40" 
                      stroke={isSwitchClosed ? '#00F0FF' : '#334155'} 
                      strokeWidth="3.5" 
                    />

                    {/* Resistor Zig-Zag Symbol */}
                    <path 
                      d="M 220 40 L 225 32 L 235 48 L 245 32 L 255 48 L 265 32 L 275 48 L 280 40" 
                      fill="none" 
                      stroke="#38BDF8" 
                      strokeWidth="3" 
                    />
                    <text x="235" y="22" fill="#94A3B8" fontSize="11" fontFamily="monospace">{resistorValue}Ω</text>

                    {/* Top Right Corner to Right Wire */}
                    <line x1="280" y1="40" x2="310" y2="40" stroke={isSwitchClosed ? '#00F0FF' : '#334155'} strokeWidth="3.5" />
                    <line x1="310" y1="40" x2="310" y2="90" stroke={isSwitchClosed ? '#00F0FF' : '#334155'} strokeWidth="3.5" />

                    {/* LED Diode Symbol */}
                    <polygon 
                      points="295,90 325,90 310,115" 
                      fill={isLedLit ? '#10B981' : '#1E293B'} 
                      stroke={isLedLit ? '#34D399' : '#475569'} 
                      strokeWidth="2.5" 
                      className="transition-colors duration-300"
                    />
                    <line x1="295" y1="115" x2="325" y2="115" stroke="#475569" strokeWidth="2.5" />

                    {/* LED Light Rays when lit */}
                    {isLedLit && (
                      <>
                        <line x1="325" y1="95" x2="338" y2="85" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
                        <line x1="328" y1="105" x2="342" y2="100" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
                      </>
                    )}

                    {/* Bottom Wire */}
                    <line x1="310" y1="115" x2="310" y2="160" stroke="#334155" strokeWidth="3.5" />
                    <line x1="310" y1="160" x2="50" y2="160" stroke="#334155" strokeWidth="3.5" />

                    {/* DC Power Supply on Left */}
                    <line x1="50" y1="40" x2="50" y2="85" stroke="#00F0FF" strokeWidth="3.5" />
                    <line x1="35" y1="85" x2="65" y2="85" stroke="#00F0FF" strokeWidth="3.5" />
                    <line x1="42" y1="95" x2="58" y2="95" stroke="#475569" strokeWidth="3.5" />
                    <line x1="35" y1="105" x2="65" y2="105" stroke="#00F0FF" strokeWidth="3.5" />
                    <line x1="42" y1="115" x2="58" y2="115" stroke="#475569" strokeWidth="3.5" />
                    <line x1="50" y1="115" x2="50" y2="160" stroke="#334155" strokeWidth="3.5" />

                    <text x="10" y="103" fill="#00F0FF" fontSize="12" fontWeight="bold" fontFamily="monospace">
                      {supplyVoltage.toFixed(1)}V
                    </text>
                  </svg>
                </div>
              </div>

              {/* Physical Circuit Telemetry Values */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Current (I)</span>
                  <div className="text-lg font-bold font-mono text-cyan-300">
                    {circuitCurrentMA} mA
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase">Resistor Drop</span>
                  <div className="text-lg font-bold font-mono text-blue-300">
                    {isSwitchClosed ? (supplyVoltage - LED_FORWARD_VOLTAGE).toFixed(2) : '0.00'} V
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase">LED State</span>
                  <div className={`text-lg font-bold font-mono ${isLedLit ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isLedLit ? 'EMITTING' : 'OFF'}
                  </div>
                </div>
              </div>
            </div>

            {/* Circuit Adjustments & Calculations (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800 shadow-lg space-y-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Circuit Controls</span>
                  <span className="text-xs text-cyan-400 font-mono">Real-time Parameters</span>
                </h3>

                {/* Voltage Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">DC Supply Voltage:</span>
                    <span className="font-mono text-cyan-400 font-bold">{supplyVoltage.toFixed(1)} Volts</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.0" 
                    max="12.0" 
                    step="0.5"
                    value={supplyVoltage}
                    onChange={(e) => setSupplyVoltage(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1.0V (Below Vf)</span>
                    <span>5.0V (Standard)</span>
                    <span>12.0V</span>
                  </div>
                </div>

                {/* Resistor Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Current-Limiting Resistor:</span>
                    <span className="font-mono text-cyan-400 font-bold">{resistorValue} Ohms (Ω)</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="2200" 
                    step="50"
                    value={resistorValue}
                    onChange={(e) => setResistorValue(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>100Ω (High Current)</span>
                    <span>330Ω</span>
                    <span>2.2kΩ (Low Current)</span>
                  </div>
                </div>

                {/* Formula derivation box */}
                <div className="p-4 rounded-lg bg-[#080D1A] border border-slate-800/80 text-xs space-y-1.5 font-mono text-slate-300">
                  <div className="text-cyan-400 font-bold font-sans">Ohm's Law Calculation:</div>
                  <div>V_resistor = V_in - V_led = {supplyVoltage.toFixed(1)}V - 2.0V = {(supplyVoltage - 2.0).toFixed(1)}V</div>
                  <div>I = V_resistor / R = {(supplyVoltage - 2.0).toFixed(1)} / {resistorValue}Ω</div>
                  <div className="text-emerald-400 font-bold">Current = {circuitCurrentMA} mA</div>
                </div>

                <button
                  onClick={() => handleRecordExperiment('Ohm’s Law & LED Demonstration')}
                  className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Log Circuit Experiment (+75 XP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION C: MULTI-SENSOR SIMULATOR                         */}
      {/* ========================================================= */}
      {activeTab === 'sensors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Temperature Sensor (LM35 / Thermistor) */}
            <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                      <Flame className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Temperature Transducer</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">LM35 IC</span>
                </div>

                <div className="text-center py-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-3xl font-extrabold font-mono text-white">
                    {simTemp}°C
                  </div>
                  <span className="text-xs text-slate-400 font-mono mt-1 block">
                    V_out: {(simTemp * 10).toFixed(0)} mV (10mV/°C)
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Simulate Ambient Temp:</span>
                      <span className="font-mono text-cyan-400">{simTemp}°C</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" value={simTemp}
                      onChange={(e) => setSimTemp(parseInt(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Alarm Threshold:</span>
                      <span className="font-mono text-amber-400">{tempThreshold}°C</span>
                    </div>
                    <input 
                      type="range" min="20" max="80" value={tempThreshold}
                      onChange={(e) => setTempThreshold(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  isTempAlert 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}>
                  {isTempAlert ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  <span>{isTempAlert ? 'CRITICAL: Cooling Fan Activated!' : 'Normal Thermal State'}</span>
                </div>
              </div>
            </div>

            {/* 2. Light Sensor (LDR Photoresistor) */}
            <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <Sun className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">LDR Light Sensor</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">Photocell</span>
                </div>

                <div className="text-center py-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-3xl font-extrabold font-mono text-white">
                    {simLux} Lux
                  </div>
                  <span className="text-xs text-slate-400 font-mono mt-1 block">
                    R_ldr: {(1000000 / (simLux + 1)).toFixed(0)} Ω (Inversely proportional)
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Ambient Illumination:</span>
                      <span className="font-mono text-amber-400">{simLux} Lux</span>
                    </div>
                    <input 
                      type="range" min="10" max="1000" value={simLux}
                      onChange={(e) => setSimLux(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Darkness Trigger:</span>
                      <span className="font-mono text-cyan-400">{luxThreshold} Lux</span>
                    </div>
                    <input 
                      type="range" min="50" max="600" value={luxThreshold}
                      onChange={(e) => setLuxThreshold(parseInt(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  isNightLampOn 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <Sun className="w-4 h-4" />
                  <span>{isNightLampOn ? 'Night Lamp: Switched ON' : 'Daylight Detected (Lamp OFF)'}</span>
                </div>
              </div>
            </div>

            {/* 3. Ultrasonic Distance Sensor (HC-SR04) */}
            <div className="p-5 rounded-xl bg-[#0B101E] border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Radio className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Ultrasonic Rangefinder</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">HC-SR04</span>
                </div>

                <div className="text-center py-4 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-3xl font-extrabold font-mono text-white">
                    {simDistance} cm
                  </div>
                  <span className="text-xs text-slate-400 font-mono mt-1 block">
                    Echo Flight Time: {(simDistance * 58.2).toFixed(0)} µs
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Obstacle Distance:</span>
                      <span className="font-mono text-cyan-400">{simDistance} cm</span>
                    </div>
                    <input 
                      type="range" min="5" max="300" value={simDistance}
                      onChange={(e) => setSimDistance(parseInt(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Proximity Alarm:</span>
                      <span className="font-mono text-rose-400">{distanceThreshold} cm</span>
                    </div>
                    <input 
                      type="range" min="10" max="100" value={distanceThreshold}
                      onChange={(e) => setDistanceThreshold(parseInt(e.target.value))}
                      className="w-full accent-rose-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  isDistanceWarning 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                    : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}>
                  <Radio className="w-4 h-4" />
                  <span>{isDistanceWarning ? 'PROXIMITY WARNING: Collision Risk!' : 'Safe Clear Corridor'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
