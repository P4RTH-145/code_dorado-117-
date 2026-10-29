import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  HelpCircle, 
  Flame, 
  Zap,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

interface GateMeta {
  type: GateType;
  name: string;
  expression: string;
  description: string;
  truthTable: { a: number; b?: number; out: number }[];
  explanationFn: (a: number, b?: number, out?: number) => string;
}

export const GATE_DEFINITIONS: Record<GateType, GateMeta> = {
  AND: {
    type: 'AND',
    name: 'AND Gate (Conjunction)',
    expression: 'Y = A · B',
    description: 'Output is HIGH (1) only if all inputs are HIGH (1).',
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 }
    ],
    explanationFn: (a, b) =>
      a === 1 && b === 1
        ? 'Since both Input A and Input B are 1 (HIGH), current can conduct through the series NMOS network, yielding Output = 1.'
        : `Because at least one input is 0 (A=${a}, B=${b}), the series conductive path to Vcc is broken, so Output = 0.`
  },
  OR: {
    type: 'OR',
    name: 'OR Gate (Disjunction)',
    expression: 'Y = A + B',
    description: 'Output is HIGH (1) if at least one input is HIGH (1).',
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 1 }
    ],
    explanationFn: (a, b) =>
      a === 1 || b === 1
        ? `Since at least one input is 1 (A=${a}, B=${b}), parallel conductive path is formed, pulling Output = 1.`
        : 'Both Input A and Input B are 0 (LOW); no conductive path exists to Vcc, resulting in Output = 0.'
  },
  NOT: {
    type: 'NOT',
    name: 'NOT Gate (Inverter)',
    expression: 'Y = Ā',
    description: 'Output is the inverted complement of the single input.',
    truthTable: [
      { a: 0, out: 1 },
      { a: 1, out: 0 }
    ],
    explanationFn: (a) =>
      a === 1
        ? 'Input A is 1 (HIGH); the pull-down NMOS conducts to ground, inverting Output to 0 (LOW).'
        : 'Input A is 0 (LOW); the pull-up PMOS conducts to Vcc, inverting Output to 1 (HIGH).'
  },
  NAND: {
    type: 'NAND',
    name: 'NAND Gate (Universal Gate)',
    expression: 'Y = (A · B)̄',
    description: 'Output is LOW (0) only when all inputs are HIGH (1). Inverse of AND.',
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 }
    ],
    explanationFn: (a, b) =>
      a === 1 && b === 1
        ? 'Both inputs are 1 (HIGH), so the internal AND stage is 1, which the inverter stage flips to Output = 0.'
        : `Because inputs are not simultaneously HIGH (A=${a}, B=${b}), internal AND is 0, inverting Output to 1.`
  },
  NOR: {
    type: 'NOR',
    name: 'NOR Gate (Universal Gate)',
    expression: 'Y = (A + B)̄',
    description: 'Output is HIGH (1) only when all inputs are LOW (0). Inverse of OR.',
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 0 }
    ],
    explanationFn: (a, b) =>
      a === 0 && b === 0
        ? 'Both inputs are 0 (LOW); the internal OR stage is 0, which the inverter stage flips to Output = 1.'
        : `Since at least one input is 1 (A=${a}, B=${b}), internal OR evaluates to 1, causing Output = 0.`
  },
  XOR: {
    type: 'XOR',
    name: 'XOR Gate (Exclusive OR)',
    expression: 'Y = A ⊕ B',
    description: 'Output is HIGH (1) if inputs are different. Odd-parity detector.',
    truthTable: [
      { a: 0, b: 0, out: 0 },
      { a: 0, b: 1, out: 1 },
      { a: 1, b: 0, out: 1 },
      { a: 1, b: 1, out: 0 }
    ],
    explanationFn: (a, b) =>
      a !== b
        ? `Inputs are strictly different (A=${a}, B=${b}), satisfying the exclusive condition, resulting in Output = 1.`
        : `Inputs are identical (A=${a}, B=${b}), so exclusive condition is not met, resulting in Output = 0.`
  },
  XNOR: {
    type: 'XNOR',
    name: 'XNOR Gate (Equivalence Gate)',
    expression: 'Y = (A ⊕ B)̄',
    description: 'Output is HIGH (1) if inputs are identical. Even-parity / Comparator.',
    truthTable: [
      { a: 0, b: 0, out: 1 },
      { a: 0, b: 1, out: 0 },
      { a: 1, b: 0, out: 0 },
      { a: 1, b: 1, out: 1 }
    ],
    explanationFn: (a, b) =>
      a === b
        ? `Inputs are identical (A=${a}, B=${b}), fulfilling the logic equivalence condition, yielding Output = 1.`
        : `Inputs differ (A=${a}, B=${b}), so equivalence check fails, yielding Output = 0.`
  }
};

export const LogicGateSimulator: React.FC = () => {
  const { recordExperiment } = useApp();
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(0);
  const [verifiedRows, setVerifiedRows] = useState<Record<string, boolean>>({});

  const meta = GATE_DEFINITIONS[selectedGate];

  // Calculate output
  const calculateOutput = (gate: GateType, a: number, b: number): number => {
    switch (gate) {
      case 'AND': return a === 1 && b === 1 ? 1 : 0;
      case 'OR': return a === 1 || b === 1 ? 1 : 0;
      case 'NOT': return a === 1 ? 0 : 1;
      case 'NAND': return !(a === 1 && b === 1) ? 1 : 0;
      case 'NOR': return !(a === 1 || b === 1) ? 1 : 0;
      case 'XOR': return a !== b ? 1 : 0;
      case 'XNOR': return a === b ? 1 : 0;
    }
  };

  const currentOutput = calculateOutput(selectedGate, inputA, inputB);

  const handleGateChange = (gate: GateType) => {
    setSelectedGate(gate);
    recordExperiment(
      `gate-${gate.toLowerCase()}`,
      `${gate} Logic Gate Tested`,
      `Simulated ${gate} gate with input transitions and verified truth table.`,
      15
    );
  };

  const handleReset = () => {
    setInputA(0);
    setInputB(0);
  };

  const isRowActive = (rowA: number, rowB?: number) => {
    if (selectedGate === 'NOT') {
      return rowA === inputA;
    }
    return rowA === inputA && rowB === inputB;
  };

  const markRowVerified = () => {
    const key = selectedGate === 'NOT' ? `${selectedGate}-${inputA}` : `${selectedGate}-${inputA}-${inputB}`;
    setVerifiedRows(prev => ({ ...prev, [key]: true }));
    recordExperiment(
      `gate-verify-${selectedGate.toLowerCase()}`,
      `Verified ${selectedGate} Vector`,
      `Logged verified truth vector: A=${inputA}${selectedGate !== 'NOT' ? `, B=${inputB}` : ''} -> Y=${currentOutput}`,
      10
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Gate Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl">
        {(Object.keys(GATE_DEFINITIONS) as GateType[]).map((gate) => {
          const isSelected = selectedGate === gate;
          return (
            <button
              key={gate}
              onClick={() => handleGateChange(gate)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {gate}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive SVG Circuit Canvas */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-circuit-dots opacity-30 pointer-events-none" />

          {/* Canvas Header */}
          <div className="flex items-center justify-between mb-4 z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">{meta.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                  {meta.expression}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{meta.description}</p>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Reset inputs to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Interactive SVG Gate Diagram */}
          <div className="w-full h-64 sm:h-72 flex items-center justify-center my-2 relative z-10">
            <svg
              viewBox="0 0 540 240"
              className="w-full h-full max-h-72 drop-shadow-2xl select-none"
            >
              {/* Definitions for Glow Filters */}
              <defs>
                <filter id="glow-high" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Wire Input A */}
              <path
                d={selectedGate === 'NOT' ? "M 70 120 L 210 120" : "M 70 80 L 210 80"}
                stroke={inputA === 1 ? '#06b6d4' : '#334155'}
                strokeWidth="4"
                fill="none"
                filter={inputA === 1 ? 'url(#glow-high)' : undefined}
                className="transition-colors duration-200"
              />

              {/* Wire Input B (if not NOT gate) */}
              {selectedGate !== 'NOT' && (
                <path
                  d="M 70 160 L 210 160"
                  stroke={inputB === 1 ? '#06b6d4' : '#334155'}
                  strokeWidth="4"
                  fill="none"
                  filter={inputB === 1 ? 'url(#glow-high)' : undefined}
                  className="transition-colors duration-200"
                />
              )}

              {/* Output Wire */}
              <path
                d="M 350 120 L 460 120"
                stroke={currentOutput === 1 ? '#10b981' : '#334155'}
                strokeWidth="4"
                fill="none"
                filter={currentOutput === 1 ? 'url(#glow-high)' : undefined}
                className="transition-colors duration-200"
              />

              {/* Logic Gate Body SVG */}
              {selectedGate === 'AND' && (
                <path
                  d="M 210 50 L 260 50 A 70 70 0 0 1 260 190 L 210 190 Z"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                />
              )}

              {selectedGate === 'NAND' && (
                <g>
                  <path
                    d="M 210 50 L 260 50 A 70 70 0 0 1 260 190 L 210 190 Z"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                  />
                  {/* Bubble */}
                  <circle cx="338" cy="120" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                </g>
              )}

              {selectedGate === 'OR' && (
                <path
                  d="M 200 50 Q 240 120 200 190 Q 275 190 340 120 Q 275 50 200 50 Z"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                />
              )}

              {selectedGate === 'NOR' && (
                <g>
                  <path
                    d="M 200 50 Q 240 120 200 190 Q 275 190 340 120 Q 275 50 200 50 Z"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                  />
                  <circle cx="348" cy="120" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                </g>
              )}

              {selectedGate === 'XOR' && (
                <g>
                  {/* Extra curved back arc */}
                  <path
                    d="M 190 50 Q 230 120 190 190"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M 205 50 Q 245 120 205 190 Q 280 190 345 120 Q 280 50 205 50 Z"
                    fill="#0f172a"
                    stroke="#818cf8"
                    strokeWidth="3.5"
                  />
                </g>
              )}

              {selectedGate === 'XNOR' && (
                <g>
                  <path
                    d="M 190 50 Q 230 120 190 190"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M 205 50 Q 245 120 205 190 Q 280 190 345 120 Q 280 50 205 50 Z"
                    fill="#0f172a"
                    stroke="#818cf8"
                    strokeWidth="3.5"
                  />
                  <circle cx="353" cy="120" r="8" fill="#0f172a" stroke="#818cf8" strokeWidth="3" />
                </g>
              )}

              {selectedGate === 'NOT' && (
                <g>
                  {/* Triangle */}
                  <polygon
                    points="210,60 210,180 320,120"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                  />
                  {/* Inverter Bubble */}
                  <circle cx="330" cy="120" r="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
                </g>
              )}

              {/* Wire voltage labels */}
              <text
                x="140"
                y={selectedGate === 'NOT' ? "110" : "70"}
                fill={inputA === 1 ? '#06b6d4' : '#64748b'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {inputA === 1 ? '+5V HIGH' : '0V LOW'}
              </text>

              {selectedGate !== 'NOT' && (
                <text
                  x="140"
                  y="185"
                  fill={inputB === 1 ? '#06b6d4' : '#64748b'}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {inputB === 1 ? '+5V HIGH' : '0V LOW'}
                </text>
              )}

              {/* Output voltage label */}
              <text
                x="375"
                y="110"
                fill={currentOutput === 1 ? '#10b981' : '#64748b'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {currentOutput === 1 ? '+5V HIGH' : '0V LOW'}
              </text>
            </svg>
          </div>

          {/* Interactive Controls Bar: Input buttons and Output Probe */}
          <div className="z-10 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Input A Switch */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
                  Input A
                </span>
                <button
                  onClick={() => setInputA(prev => (prev === 1 ? 0 : 1))}
                  className={`px-4 py-2 rounded-xl text-sm font-mono font-bold transition-all flex items-center gap-2 ${
                    inputA === 1
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${inputA === 1 ? 'bg-slate-950' : 'bg-slate-500'}`} />
                  <span>Bit {inputA}</span>
                </button>
              </div>

              {/* Input B Switch (if not NOT) */}
              {selectedGate !== 'NOT' && (
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
                    Input B
                  </span>
                  <button
                    onClick={() => setInputB(prev => (prev === 1 ? 0 : 1))}
                    className={`px-4 py-2 rounded-xl text-sm font-mono font-bold transition-all flex items-center gap-2 ${
                      inputB === 1
                        ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${inputB === 1 ? 'bg-slate-950' : 'bg-slate-500'}`} />
                    <span>Bit {inputB}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Output State Indicator */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
                  Output State
                </div>
                <div className={`text-base font-mono font-bold ${currentOutput === 1 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {currentOutput === 1 ? 'LOGIC 1 (HIGH)' : 'LOGIC 0 (LOW)'}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-xl transition-all ${
                  currentOutput === 1
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {currentOutput}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Truth Table & Engineering Explanation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Truth Table Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Truth Table Verification</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Live Highlight</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-300 font-mono font-semibold uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Input A</th>
                    {selectedGate !== 'NOT' && <th className="py-2.5 px-3">Input B</th>}
                    <th className="py-2.5 px-3">Output (Y)</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {meta.truthTable.map((row, idx) => {
                    const active = isRowActive(row.a, row.b);
                    const rowKey = selectedGate === 'NOT' ? `${selectedGate}-${row.a}` : `${selectedGate}-${row.a}-${row.b}`;
                    const verified = verifiedRows[rowKey];

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          active
                            ? 'bg-cyan-500/15 text-cyan-200 font-bold border-l-4 border-l-cyan-400'
                            : 'text-slate-400 hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2 px-3">{row.a}</td>
                        {selectedGate !== 'NOT' && <td className="py-2 px-3">{row.b}</td>}
                        <td className="py-2 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              row.out === 1
                                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {row.out}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          {active ? (
                            <span className="text-[10px] text-cyan-400 font-sans font-semibold">
                              ACTIVE NOW
                            </span>
                          ) : verified ? (
                            <span className="text-[10px] text-emerald-400 font-sans">
                              Verified ✓
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-sans">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Click input switches to step through each truth vector.
              </span>
              <button
                onClick={markRowVerified}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verify State</span>
              </button>
            </div>
          </div>

          {/* Electronic Logic Explanation Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Why is Output = {currentOutput}?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              {meta.explanationFn(inputA, inputB, currentOutput)}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <p>
                <strong>Laboratory Note:</strong> In actual TTL (Transistor-Transistor Logic) IC 74LS08, propagation delay is roughly ~15ns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
