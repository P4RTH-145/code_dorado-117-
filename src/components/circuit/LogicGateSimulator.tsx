import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Info, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  HelpCircle,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

interface GateConfig {
  name: GateType;
  fullName: string;
  expression: string;
  description: string;
  inputsCount: 1 | 2;
  truthTable: { a: number; b?: number; y: number }[];
  logicReason: (a: number, b: number) => string;
}

const GATES_CONFIG: Record<GateType, GateConfig> = {
  AND: {
    name: 'AND',
    fullName: 'Logical Conjunction (AND)',
    expression: 'Y = A · B',
    description: 'Output is 1 (HIGH) ONLY when both inputs A and B are 1.',
    inputsCount: 2,
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 1 }
    ],
    logicReason: (a, b) =>
      a === 1 && b === 1
        ? 'Both inputs A (1) and B (1) are HIGH, satisfying the AND condition. Output Y = 1.'
        : `Input ${a === 0 && b === 0 ? 'A and B are both 0' : a === 0 ? 'A is 0' : 'B is 0'}, which collapses the series conduction path. Output Y = 0.`
  },
  OR: {
    name: 'OR',
    fullName: 'Logical Disjunction (OR)',
    expression: 'Y = A + B',
    description: 'Output is 1 (HIGH) if AT LEAST ONE input is 1.',
    inputsCount: 2,
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 1 }
    ],
    logicReason: (a, b) =>
      a === 1 || b === 1
        ? `At least one input is HIGH (A=${a}, B=${b}). Parallel path conducts. Output Y = 1.`
        : 'Both inputs A (0) and B (0) are LOW. No parallel path conducts. Output Y = 0.'
  },
  NOT: {
    name: 'NOT',
    fullName: 'Logical Inverter (NOT)',
    expression: 'Y = Ā',
    description: 'Inverts the single input. Output is the opposite of input A.',
    inputsCount: 1,
    truthTable: [
      { a: 0, y: 1 },
      { a: 1, y: 0 }
    ],
    logicReason: (a) =>
      a === 1
        ? 'Input A is HIGH (1). The inverter pulls the output down to Ground (0V). Output Y = 0.'
        : 'Input A is LOW (0). The pull-up network pulls output to supply rail (+5V). Output Y = 1.'
  },
  NAND: {
    name: 'NAND',
    fullName: 'Universal Negated AND (NAND)',
    expression: 'Y = (A · B)̄',
    description: 'Output is 0 (LOW) ONLY when both inputs A and B are 1.',
    inputsCount: 2,
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 }
    ],
    logicReason: (a, b) =>
      a === 1 && b === 1
        ? 'Both inputs A and B are 1. The AND condition is true, so the inverted output is forced LOW (0).'
        : `Since ${a === 0 ? 'A=0' : 'B=0'}, the AND condition is false (0), so inverted output is HIGH (1).`
  },
  NOR: {
    name: 'NOR',
    fullName: 'Universal Negated OR (NOR)',
    expression: 'Y = (A + B)̄',
    description: 'Output is 1 (HIGH) ONLY when both inputs A and B are 0.',
    inputsCount: 2,
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 0 }
    ],
    logicReason: (a, b) =>
      a === 0 && b === 0
        ? 'Both inputs are 0. The OR condition is false (0), so inverted output is HIGH (1).'
        : `At least one input is 1 (A=${a}, B=${b}). The OR condition is true, so inverted output is LOW (0).`
  },
  XOR: {
    name: 'XOR',
    fullName: 'Exclusive OR (XOR)',
    expression: 'Y = A ⊕ B',
    description: 'Output is 1 (HIGH) when inputs are DIFFERENT (odd parity).',
    inputsCount: 2,
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 }
    ],
    logicReason: (a, b) =>
      a !== b
        ? `Inputs differ (A=${a}, B=${b}). Odd parity satisfied. Output Y = 1.`
        : `Inputs are identical (A=${a}, B=${b}). Even parity. Output Y = 0.`
  },
  XNOR: {
    name: 'XNOR',
    fullName: 'Exclusive NOR (XNOR / Equivalence)',
    expression: 'Y = (A ⊕ B)̄',
    description: 'Output is 1 (HIGH) when inputs are IDENTICAL (even parity / equivalence).',
    inputsCount: 2,
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 1 }
    ],
    logicReason: (a, b) =>
      a === b
        ? `Inputs are identical (A=${a}, B=${b}). Equivalence comparator matches. Output Y = 1.`
        : `Inputs differ (A=${a}, B=${b}). Equivalence fails. Output Y = 0.`
  }
};

export const LogicGateSimulator: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<number>(0);
  const [inputB, setInputB] = useState<number>(0);
  const [verifiedRows, setVerifiedRows] = useState<Record<string, boolean>>({});

  const { completeExperiment } = useApp();

  const currentGate = GATES_CONFIG[selectedGate];

  // Calculate Output
  let output = 0;
  switch (selectedGate) {
    case 'AND': output = inputA === 1 && inputB === 1 ? 1 : 0; break;
    case 'OR': output = inputA === 1 || inputB === 1 ? 1 : 0; break;
    case 'NOT': output = inputA === 1 ? 0 : 1; break;
    case 'NAND': output = !(inputA === 1 && inputB === 1) ? 1 : 0; break;
    case 'NOR': output = !(inputA === 1 || inputB === 1) ? 1 : 0; break;
    case 'XOR': output = inputA !== inputB ? 1 : 0; break;
    case 'XNOR': output = inputA === inputB ? 1 : 0; break;
  }

  const handleReset = () => {
    setInputA(0);
    setInputB(0);
  };

  const handleGateSelect = (gate: GateType) => {
    setSelectedGate(gate);
    setInputA(0);
    setInputB(0);
    completeExperiment(`gate-${gate.toLowerCase()}`, `${gate} Logic Gate Simulator`, 20);
  };

  // Helper colors for binary states
  const getColor = (val: number) => (val === 1 ? '#06b6d4' : '#475569');
  const getGlow = (val: number) => (val === 1 ? 'drop-shadow(0 0 8px #06b6d4)' : 'none');

  return (
    <div className="space-y-6">
      {/* Gate Selector Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800">
        {(Object.keys(GATES_CONFIG) as GateType[]).map((gate) => (
          <button
            key={gate}
            onClick={() => handleGateSelect(gate)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedGate === gate
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {gate}
          </button>
        ))}
      </div>

      {/* Main Interactive Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Circuit Canvas & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[360px] shadow-xl overflow-hidden">
            {/* Background Circuit Grid Accent */}
            <div className="absolute inset-0 bg-circuit-dots opacity-40 pointer-events-none" />

            {/* Gate Header Tag */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                {currentGate.expression}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentGate.fullName}
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors z-10"
              title="Reset inputs to 0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>

            {/* Interactive SVG Diagram */}
            <div className="w-full max-w-md py-8 flex items-center justify-center">
              <svg viewBox="0 0 460 220" className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="gateGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </linearGradient>
                  <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Input A Line */}
                <path
                  d={currentGate.inputsCount === 1 ? "M 60 110 L 170 110" : "M 60 70 L 170 70"}
                  stroke={getColor(inputA)}
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ filter: getGlow(inputA) }}
                  className="transition-all duration-300"
                />

                {/* Input B Line (if 2-input gate) */}
                {currentGate.inputsCount === 2 && (
                  <path
                    d="M 60 150 L 170 150"
                    stroke={getColor(inputB)}
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{ filter: getGlow(inputB) }}
                    className="transition-all duration-300"
                  />
                )}

                {/* Output Y Line */}
                <path
                  d={
                    selectedGate === 'NOT' || selectedGate === 'NAND' || selectedGate === 'NOR' || selectedGate === 'XNOR'
                      ? "M 305 110 L 400 110"
                      : "M 290 110 L 400 110"
                  }
                  stroke={getColor(output)}
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ filter: getGlow(output) }}
                  className="transition-all duration-300"
                />

                {/* Gate Shape Rendering */}
                {selectedGate === 'AND' && (
                  <path
                    d="M 170 40 L 220 40 A 70 70 0 0 1 220 180 L 170 180 Z"
                    fill="url(#gateGrad)"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                )}

                {selectedGate === 'NAND' && (
                  <g>
                    <path
                      d="M 170 40 L 220 40 A 70 70 0 0 1 220 180 L 170 180 Z"
                      fill="url(#gateGrad)"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    {/* Inverting Bubble */}
                    <circle cx="298" cy="110" r="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                  </g>
                )}

                {selectedGate === 'OR' && (
                  <path
                    d="M 160 40 Q 200 110 160 180 Q 240 180 290 110 Q 240 40 160 40 Z"
                    fill="url(#gateGrad)"
                    stroke="#818cf8"
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                )}

                {selectedGate === 'NOR' && (
                  <g>
                    <path
                      d="M 160 40 Q 200 110 160 180 Q 240 180 290 110 Q 240 40 160 40 Z"
                      fill="url(#gateGrad)"
                      stroke="#818cf8"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    <circle cx="298" cy="110" r="7" fill="#0f172a" stroke="#818cf8" strokeWidth="3" />
                  </g>
                )}

                {selectedGate === 'XOR' && (
                  <g>
                    {/* Additional input curvature line */}
                    <path
                      d="M 148 40 Q 188 110 148 180"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M 162 40 Q 202 110 162 180 Q 242 180 290 110 Q 242 40 162 40 Z"
                      fill="url(#gateGrad)"
                      stroke="#c084fc"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                  </g>
                )}

                {selectedGate === 'XNOR' && (
                  <g>
                    <path
                      d="M 148 40 Q 188 110 148 180"
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M 162 40 Q 202 110 162 180 Q 242 180 290 110 Q 242 40 162 40 Z"
                      fill="url(#gateGrad)"
                      stroke="#c084fc"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    <circle cx="298" cy="110" r="7" fill="#0f172a" stroke="#c084fc" strokeWidth="3" />
                  </g>
                )}

                {selectedGate === 'NOT' && (
                  <g>
                    <polygon
                      points="170,50 170,170 280,110"
                      fill="url(#gateGrad)"
                      stroke="#34d399"
                      strokeWidth="3.5"
                    />
                    <circle cx="288" cy="110" r="7" fill="#0f172a" stroke="#34d399" strokeWidth="3" />
                  </g>
                )}

                {/* Gate Label in center */}
                <text
                  x="215"
                  y="116"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="15"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {selectedGate}
                </text>
              </svg>
            </div>

            {/* Clickable Binary Toggle Switches */}
            <div className="w-full flex items-center justify-between px-6 pt-4 border-t border-slate-800/80">
              {/* Input Switches */}
              <div className="flex items-center gap-6">
                {/* Input A Switch */}
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-300">Input A</span>
                  <button
                    onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                    className={`h-11 w-14 rounded-xl font-mono text-base font-bold transition-all flex items-center justify-center border-2 ${
                      inputA === 1
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/30 scale-105'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {inputA}
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {inputA === 1 ? '+5V (HIGH)' : '0V (LOW)'}
                  </span>
                </div>

                {/* Input B Switch (if 2-input gate) */}
                {currentGate.inputsCount === 2 && (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-300">Input B</span>
                    <button
                      onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                      className={`h-11 w-14 rounded-xl font-mono text-base font-bold transition-all flex items-center justify-center border-2 ${
                        inputB === 1
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/30 scale-105'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {inputB}
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {inputB === 1 ? '+5V (HIGH)' : '0V (LOW)'}
                    </span>
                  </div>
                )}
              </div>

              {/* Output Indicator Display */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-300">Output Y</span>
                <div
                  className={`h-11 w-14 rounded-xl font-mono text-base font-bold flex items-center justify-center border-2 transition-all ${
                    output === 1
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/30 scale-105'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {output}
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-medium">
                  {output === 1 ? '+5V (LOGIC 1)' : '0V (LOGIC 0)'}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Logic Explanation */}
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Real-Time Circuit State Logic</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentGate.logicReason(inputA, inputB)}
            </p>
          </div>
        </div>

        {/* Right Column: Dynamic Truth Table & Verification */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  Truth Table Verification
                </h4>
                <p className="text-[11px] text-slate-400">
                  Active state highlighted in real time
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-400">
                {currentGate.name}
              </span>
            </div>

            {/* Truth Table */}
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-800">
                    <th className="py-2.5 px-3">Input A</th>
                    {currentGate.inputsCount === 2 && <th className="py-2.5 px-3">Input B</th>}
                    <th className="py-2.5 px-3">Output Y</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {currentGate.truthTable.map((row, idx) => {
                    const isCurrent =
                      currentGate.inputsCount === 1
                        ? row.a === inputA
                        : row.a === inputA && row.b === inputB;

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isCurrent
                            ? 'bg-cyan-500/15 text-cyan-200 font-bold border-l-4 border-cyan-400'
                            : 'text-slate-400 hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 px-3">{row.a}</td>
                        {currentGate.inputsCount === 2 && <td className="py-2.5 px-3">{row.b}</td>}
                        <td className={`py-2.5 px-3 ${row.y === 1 ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {row.y}
                        </td>
                        <td className="py-2.5 px-3">
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                              Active State
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Idle</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Beginner Instructions Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Info className="h-4 w-4 text-cyan-400" />
                <span>Experiment Guide:</span>
              </div>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px] leading-relaxed">
                <li>Toggle switches <strong>Input A</strong> and <strong>Input B</strong> between 0 and 1.</li>
                <li>Notice how the wires glow cyan when energized (+5V).</li>
                <li>Observe the highlighted row in the Truth Table update synchronously.</li>
                <li>Select universal gates like <strong>NAND</strong> and <strong>NOR</strong> to understand gate inversion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
