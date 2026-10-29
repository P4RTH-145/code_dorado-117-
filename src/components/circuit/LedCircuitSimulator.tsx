import React, { useState } from 'react';
import { 
  Power, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Flame, 
  Info,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface LedColorPreset {
  name: string;
  forwardVoltage: number; // in Volts
  hexColor: string;
  glowClass: string;
}

const LED_PRESETS: LedColorPreset[] = [
  { name: 'Red (GaP)', forwardVoltage: 1.8, hexColor: '#ef4444', glowClass: 'shadow-red-500/50' },
  { name: 'Green (GaP)', forwardVoltage: 2.1, hexColor: '#22c55e', glowClass: 'shadow-emerald-500/50' },
  { name: 'Blue (InGaN)', forwardVoltage: 3.0, hexColor: '#3b82f6', glowClass: 'shadow-blue-500/50' },
  { name: 'Amber (AlInGaP)', forwardVoltage: 2.0, hexColor: '#f59e0b', glowClass: 'shadow-amber-500/50' }
];

const RESISTOR_PRESETS = [100, 220, 330, 470, 1000, 4700, 10000];

export const LedCircuitSimulator: React.FC = () => {
  const { recordExperiment } = useApp();

  const [supplyVoltage, setSupplyVoltage] = useState<number>(5.0); // 0 to 12V
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);
  const [resistance, setResistance] = useState<number>(330); // in Ohms
  const [selectedLed, setSelectedLed] = useState<LedColorPreset>(LED_PRESETS[0]);

  // Electrical Model Calculations
  // When switch is closed and Vin > Vf:
  // V_resistor = Vin - Vf
  // I = V_resistor / R (in Amperes) -> I_mA = I * 1000
  const isConducting = isSwitchClosed && supplyVoltage > selectedLed.forwardVoltage;
  const currentAmps = isConducting ? (supplyVoltage - selectedLed.forwardVoltage) / resistance : 0;
  const currentMilliamps = currentAmps * 1000;
  const resistorVoltage = isConducting ? supplyVoltage - selectedLed.forwardVoltage : 0;
  const ledVoltage = isConducting ? selectedLed.forwardVoltage : isSwitchClosed ? supplyVoltage : 0;
  const powerDissipatedMw = currentMilliamps * ledVoltage;

  // Operating State Classification
  let operatingState: 'OFF' | 'DIM' | 'OPTIMAL' | 'OVERLOAD' | 'BURNT_OUT' = 'OFF';
  if (!isSwitchClosed) {
    operatingState = 'OFF';
  } else if (supplyVoltage <= selectedLed.forwardVoltage) {
    operatingState = 'OFF';
  } else if (currentMilliamps > 40) {
    operatingState = 'BURNT_OUT';
  } else if (currentMilliamps > 25) {
    operatingState = 'OVERLOAD';
  } else if (currentMilliamps < 5) {
    operatingState = 'DIM';
  } else {
    operatingState = 'OPTIMAL';
  }

  // Calculate visual brightness (0 to 1)
  const brightnessRatio = operatingState === 'BURNT_OUT' 
    ? 0 
    : Math.min(1, Math.max(0, currentMilliamps / 20));

  const handleToggleSwitch = () => {
    const newState = !isSwitchClosed;
    setIsSwitchClosed(newState);
    recordExperiment(
      'circuit-led-toggle',
      `Toggled Circuit Switch (${newState ? 'CLOSED' : 'OPEN'})`,
      `LED state: ${newState ? 'Power connected' : 'Circuit open'}. Current: ${currentMilliamps.toFixed(1)} mA`,
      15
    );
  };

  const handleReset = () => {
    setSupplyVoltage(5.0);
    setIsSwitchClosed(true);
    setResistance(330);
    setSelectedLed(LED_PRESETS[0]);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Interactive DC LED Circuit Demonstrator</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time Kirchhoff&apos;s Voltage Law (KVL) &amp; Ohm&apos;s Law with Forward Diode Modeling
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Circuit</span>
        </button>
      </div>

      {/* Main Grid: Circuit Visualizer + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive SVG Circuit Diagram */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-circuit-dots opacity-25 pointer-events-none" />

          {/* Circuit Status Banner */}
          <div className="flex items-center justify-between z-10 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">Circuit State:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider ${
                  operatingState === 'OPTIMAL'
                    ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                    : operatingState === 'OVERLOAD'
                    ? 'bg-amber-950/80 border border-amber-500/60 text-amber-300 animate-pulse'
                    : operatingState === 'BURNT_OUT'
                    ? 'bg-rose-950/80 border border-rose-500/60 text-rose-300'
                    : operatingState === 'DIM'
                    ? 'bg-blue-950/80 border border-blue-500/60 text-blue-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {operatingState}
              </span>
            </div>

            {/* Live Multimeter Readout */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-cyan-400">
                I: <span className="font-bold">{currentMilliamps.toFixed(2)} mA</span>
              </div>
              <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-violet-400">
                V_led: <span className="font-bold">{ledVoltage.toFixed(2)} V</span>
              </div>
            </div>
          </div>

          {/* SVG Schematic Loop */}
          <div className="w-full h-64 sm:h-72 flex items-center justify-center relative z-10 my-1">
            <svg viewBox="0 0 540 260" className="w-full h-full max-h-72 select-none">
              <defs>
                <filter id="led-radiance" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Wire Loop (Rectangular closed loop) */}
              {/* Top wire: Battery(+) -> Switch -> Resistor */}
              <path
                d="M 80 80 L 170 80"
                stroke={isSwitchClosed ? '#06b6d4' : '#334155'}
                strokeWidth="3.5"
                fill="none"
              />
              <path
                d="M 230 80 L 320 80"
                stroke={isConducting ? '#06b6d4' : '#334155'}
                strokeWidth="3.5"
                fill="none"
              />

              {/* Top right corner down to LED */}
              <path
                d="M 400 80 L 460 80 L 460 110"
                stroke={isConducting ? '#06b6d4' : '#334155'}
                strokeWidth="3.5"
                fill="none"
              />

              {/* Bottom wire: LED cathode -> Battery(-) */}
              <path
                d="M 460 170 L 460 210 L 80 210 L 80 150"
                stroke={isConducting ? '#10b981' : '#334155'}
                strokeWidth="3.5"
                fill="none"
              />

              {/* DC Power Supply Graphic (Left side) */}
              <g transform="translate(60, 90)">
                <rect x="0" y="0" width="40" height="60" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="8" y1="20" x2="32" y2="20" stroke="#ef4444" strokeWidth="3" />
                <line x1="14" y1="40" x2="26" y2="40" stroke="#64748b" strokeWidth="3" />
                <text x="20" y="14" fill="#ef4444" fontSize="12" fontWeight="bold" textAnchor="middle">+</text>
                <text x="20" y="55" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">-</text>
                <text x="50" y="34" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  {supplyVoltage.toFixed(1)}V
                </text>
              </g>

              {/* Switch Graphic (Top wire) */}
              <g transform="translate(170, 60)" className="cursor-pointer" onClick={handleToggleSwitch}>
                <circle cx="10" cy="20" r="5" fill="#38bdf8" />
                <circle cx="50" cy="20" r="5" fill="#38bdf8" />
                {isSwitchClosed ? (
                  <line x1="10" y1="20" x2="50" y2="20" stroke="#22c55e" strokeWidth="3.5" />
                ) : (
                  <line x1="10" y1="20" x2="45" y2="2" stroke="#ef4444" strokeWidth="3.5" />
                )}
                <text x="30" y="45" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {isSwitchClosed ? 'SW: CLOSED' : 'SW: OPEN'}
                </text>
              </g>

              {/* Resistor Graphic (Top right) */}
              <g transform="translate(320, 65)">
                {/* Zigzag resistor path */}
                <path
                  d="M 0 15 L 12 15 L 18 3 L 28 27 L 38 3 L 48 27 L 58 3 L 68 27 L 74 15 L 80 15"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <text x="40" y="45" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {resistance} Ω
                </text>
              </g>

              {/* LED Diode Graphic (Right vertical leg) */}
              <g transform="translate(435, 110)">
                {/* Diode Triangle */}
                <polygon
                  points="25,25 5,45 45,45"
                  fill={isConducting ? selectedLed.hexColor : '#1e293b'}
                  stroke={selectedLed.hexColor}
                  strokeWidth="2.5"
                  opacity={operatingState === 'BURNT_OUT' ? 0.3 : Math.max(0.4, brightnessRatio)}
                />
                {/* Cathode bar */}
                <line x1="5" y1="46" x2="45" y2="46" stroke={selectedLed.hexColor} strokeWidth="3" />

                {/* Photon Emission Arrows */}
                {isConducting && operatingState !== 'BURNT_OUT' && (
                  <g stroke={selectedLed.hexColor} strokeWidth="2" fill="none" opacity={brightnessRatio}>
                    <path d="M 40 30 L 52 18 M 47 18 L 52 18 L 52 23" />
                    <path d="M 45 40 L 57 28 M 52 28 L 57 28 L 57 33" />
                  </g>
                )}

                {/* Glowing LED Halo */}
                {isConducting && operatingState !== 'BURNT_OUT' && (
                  <circle
                    cx="25"
                    cy="35"
                    r={18 + brightnessRatio * 14}
                    fill={selectedLed.hexColor}
                    opacity={0.35 * brightnessRatio}
                    filter="url(#led-radiance)"
                  />
                )}

                {/* Burnt Out Smoke / Cross Icon */}
                {operatingState === 'BURNT_OUT' && (
                  <g stroke="#ef4444" strokeWidth="3">
                    <line x1="12" y1="22" x2="38" y2="48" />
                    <line x1="38" y1="22" x2="12" y2="48" />
                    <text x="25" y="70" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      FUSED (BURNT)
                    </text>
                  </g>
                )}

                <text x="25" y="62" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                  {selectedLed.name.split(' ')[0]}
                </text>
              </g>

              {/* Current Flow Direction Animated Arrows */}
              {isConducting && operatingState !== 'BURNT_OUT' && (
                <g fill="#06b6d4" opacity="0.8">
                  <polygon points="130,76 140,80 130,84" />
                  <polygon points="275,76 285,80 275,84" />
                  <polygon points="456,190 460,200 464,190" />
                  <polygon points="250,206 240,210 250,214" />
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Switch Quick Action Bar */}
          <div className="z-10 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSwitch}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                  isSwitchClosed
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                    : 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{isSwitchClosed ? 'SWITCH: CLOSED (ON)' : 'SWITCH: OPEN (OFF)'}</span>
              </button>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Click to open/close physical circuit loop.
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-300 block">LED Power</span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {powerDissipatedMw.toFixed(1)} mW
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Circuit Controls & Component Tuners */}
        <div className="lg:col-span-5 space-y-5">
          {/* Controls Container */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 backdrop-blur-sm">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Component Parameters</span>
            </h4>

            {/* 1. DC Supply Voltage Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">DC Power Supply ($V_{in}$)</span>
                <span className="font-mono text-cyan-400 font-bold">{supplyVoltage.toFixed(1)} Volts</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.1"
                value={supplyVoltage}
                onChange={(e) => setSupplyVoltage(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-300">
                <span>0.0V</span>
                <span>3.3V (CMOS)</span>
                <span>5.0V (TTL)</span>
                <span>12.0V (Max)</span>
              </div>
            </div>

            {/* 2. Resistor Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Current Limiting Resistor ($R$)</span>
                <span className="font-mono text-amber-400 font-bold">{resistance} Ω</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {RESISTOR_PRESETS.map((ohms) => (
                  <button
                    key={ohms}
                    onClick={() => setResistance(ohms)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      resistance === ohms
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {ohms >= 1000 ? `${ohms / 1000}k` : ohms}Ω
                  </button>
                ))}
              </div>
            </div>

            {/* 3. LED Type Selection */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">LED Semiconductor Diode</span>
                <span className="font-mono text-slate-400">$V_f = {selectedLed.forwardVoltage}V$</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LED_PRESETS.map((led) => {
                  const isCurrent = selectedLed.name === led.name;
                  return (
                    <button
                      key={led.name}
                      onClick={() => setSelectedLed(led)}
                      className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                        isCurrent
                          ? 'bg-slate-800 border-cyan-500/80 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: led.hexColor }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{led.name.split(' ')[0]}</div>
                        <div className="text-[10px] font-mono text-slate-400">{led.forwardVoltage}V Drop</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Electrical Formula & Warning Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 backdrop-blur-sm">
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-300">
              Analytical Circuit Calculations
            </h4>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Resistor Voltage ($V_R = V_{in} - V_f$):</span>
                <span className="text-amber-300 font-bold">{resistorVoltage.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Calculated Current ($I = V_R / R$):</span>
                <span className="text-cyan-300 font-bold">{currentMilliamps.toFixed(2)} mA</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Safe LED Current Limit:</span>
                <span className="text-slate-400">10 mA - 20 mA</span>
              </div>
            </div>

            {operatingState === 'BURNT_OUT' ? (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <p>
                  <strong>Thermal Destruction Warning:</strong> Current exceeded 40mA. The semiconductor junction melted due to lack of sufficient ballast resistance! Increase R or decrease Vin.
                </p>
              </div>
            ) : operatingState === 'OVERLOAD' ? (
              <div className="p-3 bg-amber-950/60 border border-amber-800 rounded-xl text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <p>
                  <strong>Stress Warning:</strong> Current ({currentMilliamps.toFixed(1)} mA) is above recommended 20mA. Life expectancy of the diode will drastically decrease.
                </p>
              </div>
            ) : operatingState === 'OPTIMAL' ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <p>
                  <strong>Nominal Operation:</strong> Clean forward bias, optimal luminous flux, and safe thermal dissipation.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                <p>
                  {supplyVoltage <= selectedLed.forwardVoltage
                    ? `Supply voltage (${supplyVoltage.toFixed(1)}V) is below the LED threshold barrier voltage (${selectedLed.forwardVoltage}V). No conduction occurs.`
                    : 'Circuit switch is open. Close the switch to complete the loop.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
