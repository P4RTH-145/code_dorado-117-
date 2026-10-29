import React, { useState } from 'react';
import { 
  Zap, 
  Power, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LedCircuitSimulator: React.FC = () => {
  const [supplyVoltage, setSupplyVoltage] = useState<number>(5.0); // 0 to 12V
  const [switchClosed, setSwitchClosed] = useState<boolean>(true);
  const [resistance, setResistance] = useState<number>(330); // Ohms
  const [ledColor, setLedColor] = useState<'red' | 'green' | 'blue'>('red');

  const { completeExperiment } = useApp();

  // Forward voltages for LED types
  const forwardVoltages = {
    red: 2.0,
    green: 2.2,
    blue: 3.1
  };

  const vf = forwardVoltages[ledColor];

  // Circuit electrical modeling:
  // If switch is open, no current flows (I = 0).
  // If supplyVoltage <= vf, diode is in cut-off (I = 0).
  // When forward biased: I = (V_supply - V_f) / R
  let currentMa = 0;
  let actualVled = 0;
  let isBurnedOut = false;
  let isDim = false;
  let isOptimal = false;

  if (switchClosed) {
    if (supplyVoltage > vf) {
      currentMa = ((supplyVoltage - vf) / resistance) * 1000;
      actualVled = vf;
      if (currentMa > 35) {
        isBurnedOut = true;
      } else if (currentMa >= 5) {
        isOptimal = true;
      } else {
        isDim = true;
      }
    } else {
      actualVled = supplyVoltage;
      currentMa = 0;
    }
  }

  const handleToggleSwitch = () => {
    setSwitchClosed(!switchClosed);
    completeExperiment('circuit-led', 'Interactive LED Circuit Experiment', 25);
  };

  const handleReset = () => {
    setSupplyVoltage(5.0);
    setSwitchClosed(true);
    setResistance(330);
    setLedColor('red');
  };

  // Color mappings
  const ledGlowColors = {
    red: isBurnedOut ? '#451a1a' : currentMa > 0 ? '#ef4444' : '#7f1d1d',
    green: isBurnedOut ? '#143823' : currentMa > 0 ? '#22c55e' : '#14532d',
    blue: isBurnedOut ? '#172554' : currentMa > 0 ? '#3b82f6' : '#1e3a8a'
  };

  const brightnessPct = isBurnedOut
    ? 0
    : currentMa === 0
    ? 0
    : Math.min(100, Math.max(15, Math.round((currentMa / 25) * 100)));

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Ohm's Law LED Circuit Experiment</h3>
            <p className="text-xs text-slate-400">
              Model: I = (V_in - V_f) / R, Forward Voltage V_f = {vf} V
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Circuit Schematic Visualizer */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-circuit-dots opacity-40 pointer-events-none" />

            {/* Circuit Status Badge */}
            <div className="absolute top-4 left-4 z-10">
              {isBurnedOut ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold animate-pulse">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>BURN-OUT HAZARD (I &gt; 35mA)</span>
                </div>
              ) : isOptimal ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Optimal Operating State</span>
                </div>
              ) : isDim ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                  <span>Weak / Under-driven (I &lt; 5mA)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold">
                  <span>Circuit De-energized / OFF</span>
                </div>
              )}
            </div>

            {/* Circuit SVG Diagram */}
            <div className="w-full max-w-lg py-4">
              <svg viewBox="0 0 520 280" className="w-full h-auto overflow-visible">
                {/* Loop Wires */}
                {/* Top Wire: Power Supply to Switch */}
                <line
                  x1="80"
                  y1="60"
                  x2="170"
                  y2="60"
                  stroke={switchClosed && supplyVoltage > 0 ? '#06b6d4' : '#334155'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Switch to Resistor */}
                <line
                  x1="230"
                  y1="60"
                  x2="310"
                  y2="60"
                  stroke={switchClosed && supplyVoltage > 0 ? '#06b6d4' : '#334155'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Resistor to Right Corner */}
                <line
                  x1="390"
                  y1="60"
                  x2="460"
                  y2="60"
                  stroke={switchClosed && supplyVoltage > 0 ? '#06b6d4' : '#334155'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Right Wire Down to LED */}
                <line
                  x1="460"
                  y1="60"
                  x2="460"
                  y2="110"
                  stroke={switchClosed && supplyVoltage > 0 ? '#06b6d4' : '#334155'}
                  strokeWidth="4"
                />

                {/* LED cathode down to bottom wire */}
                <line
                  x1="460"
                  y1="170"
                  x2="460"
                  y2="230"
                  stroke={switchClosed && currentMa > 0 ? '#06b6d4' : '#334155'}
                  strokeWidth="4"
                />

                {/* Bottom Return Wire: LED cathode back to DC Ground */}
                <line
                  x1="460"
                  y1="230"
                  x2="80"
                  y2="230"
                  stroke={switchClosed && currentMa > 0 ? '#06b6d4' : '#334155'}
                  strokeWidth="4"
                />

                {/* Left Wire: Ground back to Power Supply bottom */}
                <line
                  x1="80"
                  y1="230"
                  x2="80"
                  y2="170"
                  stroke={switchClosed && currentMa > 0 ? '#06b6d4' : '#334155'}
                  strokeWidth="4"
                />

                {/* Power Supply top terminal */}
                <line
                  x1="80"
                  y1="60"
                  x2="80"
                  y2="90"
                  stroke={switchClosed && supplyVoltage > 0 ? '#06b6d4' : '#334155'}
                  strokeWidth="4"
                />

                {/* DC POWER SUPPLY SYMBOL */}
                <g transform="translate(80, 130)">
                  <rect x="-30" y="-40" width="60" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x="0" y="-12" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">DC</text>
                  <text x="0" y="8" textAnchor="middle" fill="#f8fafc" fontSize="12" fontFamily="monospace">
                    {supplyVoltage.toFixed(1)}V
                  </text>
                  <text x="0" y="24" textAnchor="middle" fill="#94a3b8" fontSize="10">+ / -</text>
                </g>

                {/* SPST TOGGLE SWITCH */}
                <g transform="translate(170, 60)">
                  <circle cx="0" cy="0" r="5" fill="#38bdf8" />
                  <circle cx="60" cy="0" r="5" fill="#38bdf8" />
                  {/* Switch Arm */}
                  {switchClosed ? (
                    <line x1="0" y1="0" x2="60" y2="0" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                  ) : (
                    <line x1="0" y1="0" x2="50" y2="-25" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
                  )}
                  <text x="30" y="25" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    {switchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
                  </text>
                </g>

                {/* RESISTOR SYMBOL */}
                <g transform="translate(310, 60)">
                  {/* Zig-zag resistor path */}
                  <path
                    d="M 0 0 L 10 -15 L 25 15 L 40 -15 L 55 15 L 70 -15 L 80 0"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text x="40" y="-22" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold" fontFamily="monospace">
                    R = {resistance} Ω
                  </text>
                </g>

                {/* LED SYMBOL */}
                <g transform="translate(460, 140)">
                  {/* Triangle Anode -> Cathode */}
                  <polygon
                    points="-18,-18 18,-18 0,10"
                    fill={ledGlowColors[ledColor]}
                    stroke={currentMa > 0 && !isBurnedOut ? '#ffffff' : '#475569'}
                    strokeWidth="2.5"
                    className="transition-colors duration-300"
                    style={{
                      filter: currentMa > 0 && !isBurnedOut ? `drop-shadow(0 0 ${brightnessPct / 6}px ${ledGlowColors[ledColor]})` : 'none'
                    }}
                  />
                  {/* Cathode Bar */}
                  <line x1="-18" y1="10" x2="18" y2="10" stroke="#cbd5e1" strokeWidth="3" />
                  {/* Light Emitting Arrows */}
                  {currentMa > 0 && !isBurnedOut && (
                    <g stroke={ledGlowColors[ledColor]} strokeWidth="2" strokeLinecap="round">
                      <line x1="15" y1="-8" x2="28" y2="-18" />
                      <line x1="18" y1="2" x2="31" y2="-8" />
                      <polygon points="28,-18 23,-16 26,-13" fill={ledGlowColors[ledColor]} />
                      <polygon points="31,-8 26,-6 29,-3" fill={ledGlowColors[ledColor]} />
                    </g>
                  )}
                  {/* Burned Out Symbol */}
                  {isBurnedOut && (
                    <g>
                      <line x1="-14" y1="-14" x2="14" y2="14" stroke="#f43f5e" strokeWidth="3" />
                      <line x1="14" y1="-14" x2="-14" y2="14" stroke="#f43f5e" strokeWidth="3" />
                      <text x="0" y="32" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold">DESTROYED</text>
                    </g>
                  )}
                  <text x="-35" y="0" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    LED
                  </text>
                </g>
              </svg>
            </div>

            {/* Quick Toggle Button directly under canvas */}
            <div className="w-full flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={handleToggleSwitch}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  switchClosed
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                }`}
              >
                <Power className="h-4 w-4" />
                <span>Switch: {switchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">LED Color:</span>
                {(['red', 'green', 'blue'] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => setLedColor(color)}
                    className={`h-7 w-7 rounded-full border-2 transition-transform ${
                      color === 'red' ? 'bg-red-500' : color === 'green' ? 'bg-emerald-500' : 'bg-blue-500'
                    } ${ledColor === color ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-60'}`}
                    title={`${color.toUpperCase()} LED (Vf = ${forwardVoltages[color]}V)`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Virtual Multimeter */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Virtual Multimeter Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Virtual Bench Multimeter</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[10px]">
                RMS SENSING
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Loop Current Reading */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 mb-1">Loop Current (I)</div>
                <div className={`text-2xl font-mono font-bold ${isBurnedOut ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {currentMa.toFixed(2)} <span className="text-xs font-normal text-slate-400">mA</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Safe Max: 25.0 mA</div>
              </div>

              {/* LED Voltage Drop */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 mb-1">LED Voltage Drop (V_LED)</div>
                <div className="text-2xl font-mono font-bold text-emerald-400">
                  {actualVled.toFixed(2)} <span className="text-xs font-normal text-slate-400">V</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Nominal Vf: {vf.toFixed(1)} V</div>
              </div>
            </div>

            {/* Circuit Equation Breakdown */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 font-mono">
              <div className="text-cyan-400 font-semibold mb-1">KIRCHHOFF VOLTAGE LAW:</div>
              <div className="text-[11px] leading-relaxed">
                V_supply - V_resistor - V_LED = 0 <br />
                {supplyVoltage.toFixed(1)}V - {((currentMa / 1000) * resistance).toFixed(2)}V - {actualVled.toFixed(2)}V = 0.00V
              </div>
            </div>
          </div>

          {/* Sliders Control Panel */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
            {/* Supply Voltage Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">DC Supply Voltage (V_in)</span>
                <span className="font-mono text-cyan-400 font-bold">{supplyVoltage.toFixed(1)} V</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={supplyVoltage}
                onChange={(e) => setSupplyVoltage(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0V (OFF)</span>
                <span>3.3V (Logic)</span>
                <span>5.0V (TTL)</span>
                <span>12V (Max)</span>
              </div>
            </div>

            {/* Current Limiting Resistor Selector */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Resistor Value (R)</span>
                <span className="font-mono text-amber-400 font-bold">{resistance} Ω</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[100, 220, 330, 470, 1000].map((rVal) => (
                  <button
                    key={rVal}
                    onClick={() => setResistance(rVal)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      resistance === rVal
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {rVal}Ω
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
