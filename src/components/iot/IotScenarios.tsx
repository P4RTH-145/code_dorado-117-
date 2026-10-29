import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Thermometer, 
  Droplet, 
  Fan, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  RotateCcw,
  Sparkles,
  Sliders,
  History,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EventLogItem {
  id: string;
  time: string;
  event: string;
  type: 'info' | 'warning' | 'action';
}

export const IotScenarios: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'temp' | 'irrigation'>('home');
  const { completeExperiment } = useApp();

  // ----------------------------------------------------
  // Scenario A: Smart Home Automation
  // ----------------------------------------------------
  const [motionDetected, setMotionDetected] = useState<boolean>(false);
  const [homeMode, setHomeMode] = useState<'auto' | 'manual'>('auto');
  const [manualLightOn, setManualLightOn] = useState<boolean>(false);
  const [ambientLightLux, setAmbientLightLux] = useState<number>(180);
  const [homeEvents, setHomeEvents] = useState<EventLogItem[]>([
    { id: '1', time: '12:00:00', event: 'System initialized in AUTOMATIC mode', type: 'info' }
  ]);

  const isLightActuallyOn = homeMode === 'manual' ? manualLightOn : (motionDetected && ambientLightLux < 300);

  const triggerMotion = () => {
    setMotionDetected(true);
    const newEvt: EventLogItem = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      event: `PIR Motion detected! ${homeMode === 'auto' && ambientLightLux < 300 ? 'Automated relay activated Room Light.' : 'Light state unchanged.'}`,
      type: 'action'
    };
    setHomeEvents(prev => [newEvt, ...prev].slice(0, 8));
    completeExperiment('iot-home', 'Smart Home Motion Automation', 30);

    // Auto-clear motion after 4 seconds
    setTimeout(() => {
      setMotionDetected(false);
    }, 4000);
  };

  // ----------------------------------------------------
  // Scenario B: Industrial Temperature Safety Monitoring
  // ----------------------------------------------------
  const [furnaceTemp, setFurnaceTemp] = useState<number>(48);
  const [safetyThreshold, setSafetyThreshold] = useState<number>(75);
  const [tempHistory, setTempHistory] = useState<{ time: string; temp: number }[]>([
    { time: '12:00', temp: 42 },
    { time: '12:01', temp: 45 },
    { time: '12:02', temp: 48 }
  ]);
  const [tempEvents, setTempEvents] = useState<EventLogItem[]>([
    { id: '1', time: '12:00:00', event: 'HVAC safety telemetry monitoring active', type: 'info' }
  ]);

  const isOverheating = furnaceTemp >= safetyThreshold;
  const fanRpm = isOverheating ? Math.min(3600, 1200 + (furnaceTemp - safetyThreshold) * 60) : 0;

  const handleTempChange = (newTemp: number) => {
    setFurnaceTemp(newTemp);
    if (newTemp >= safetyThreshold) {
      const evt: EventLogItem = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        event: `CRITICAL THRESHOLD EXCEEDED: ${newTemp}°C >= ${safetyThreshold}°C! Emergency Cooling Fan RPM: ${Math.min(3600, 1200 + (newTemp - safetyThreshold) * 60)}`,
        type: 'warning'
      };
      setTempEvents(prev => [evt, ...prev].slice(0, 8));
      completeExperiment('iot-temp', 'Industrial Temperature Safety Reactor', 30);
    }
  };

  // ----------------------------------------------------
  // Scenario C: Smart Agriculture Irrigation
  // ----------------------------------------------------
  const [soilMoisturePct, setSoilMoisturePct] = useState<number>(28); // 0 to 100%
  const [irrigationThreshold, setIrrigationThreshold] = useState<number>(35); // below 35% triggers pump
  const [irrigationMode, setIrrigationMode] = useState<'auto' | 'manual'>('auto');
  const [pumpManualOn, setPumpManualOn] = useState<boolean>(false);
  const [irrigationEvents, setIrrigationEvents] = useState<EventLogItem[]>([
    { id: '1', time: '12:00:00', event: 'Soil moisture telemetry active', type: 'info' }
  ]);

  const isPumpRunning = irrigationMode === 'manual' ? pumpManualOn : soilMoisturePct < irrigationThreshold;

  const getSoilStatus = (pct: number) => {
    if (pct < 30) return { label: 'Dry / Parched Soil', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    if (pct <= 70) return { label: 'Optimal Moisture', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { label: 'Saturated / Waterlogged', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
  };

  const handleMoistureChange = (pct: number) => {
    setSoilMoisturePct(pct);
    if (pct < irrigationThreshold) {
      const evt: EventLogItem = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString(),
        event: `Moisture dropped to ${pct}% (Below ${irrigationThreshold}% threshold). Submersible Pump ACTIVATED.`,
        type: 'action'
      };
      setIrrigationEvents(prev => [evt, ...prev].slice(0, 8));
      completeExperiment('iot-irrigation', 'Smart Agriculture Irrigation', 30);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Scenario Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
            activeTab === 'home'
              ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Scenario A: Smart Home</div>
            <div className="text-[11px] text-slate-400">PIR Motion & Automatic Lighting</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('temp')}
          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
            activeTab === 'temp'
              ? 'bg-gradient-to-r from-rose-500/15 to-orange-500/15 border-rose-500/40 text-rose-300 shadow-md shadow-rose-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Thermometer className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Scenario B: Safety Reactor</div>
            <div className="text-[11px] text-slate-400">Thermal Threshold & Active Fan</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('irrigation')}
          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
            activeTab === 'irrigation'
              ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Scenario C: Smart Irrigation</div>
            <div className="text-[11px] text-slate-400">Soil Moisture & Submersible Pump</div>
          </div>
        </button>
      </div>

      {/* Simulated Telemetry Banner Notice */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          All sensor telemetry, relays, and actuators in these scenarios are mathematically modeled in real-time.
        </span>
        <span className="text-[10px] font-mono text-cyan-400">Simulated Edge Gateway: ONLINE</span>
      </div>

      {/* ==================================================== */}
      {/* SCENARIO A: SMART HOME AUTOMATION */}
      {/* ==================================================== */}
      {activeTab === 'home' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-circuit-dots opacity-40 pointer-events-none" />

              {/* Status Header */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  isLightActuallyOn
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  Room Light: {isLightActuallyOn ? 'ILLUMINATED' : 'OFF'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  Mode: {homeMode.toUpperCase()}
                </span>
              </div>

              {/* Visual Room Graphic */}
              <div className="relative w-full max-w-sm h-64 rounded-2xl border-2 border-slate-800 flex flex-col items-center justify-center transition-all duration-500"
                style={{
                  backgroundColor: isLightActuallyOn ? 'rgba(251, 191, 36, 0.12)' : '#090d16',
                  boxShadow: isLightActuallyOn ? '0 0 40px rgba(251, 191, 36, 0.25)' : 'none'
                }}
              >
                {/* Ceiling Lamp */}
                <div className="absolute top-0 flex flex-col items-center">
                  <div className="w-1 h-12 bg-slate-700" />
                  <div className={`p-4 rounded-full border-2 transition-all ${
                    isLightActuallyOn
                      ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-xl shadow-amber-400/50 scale-110'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    <Lightbulb className="h-8 w-8" />
                  </div>
                </div>

                {/* PIR Sensor Node mounted on side */}
                <div className="absolute bottom-4 left-6 flex flex-col items-center gap-1">
                  <div className={`p-2.5 rounded-xl border transition-all ${
                    motionDetected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">PIR SENSOR</span>
                  {motionDetected && (
                    <span className="text-[10px] text-cyan-400 font-bold animate-bounce">
                      MOTION DETECTED
                    </span>
                  )}
                </div>

                {/* Ambient Light Sensor reading */}
                <div className="absolute bottom-4 right-6 text-right">
                  <span className="text-[10px] text-slate-400 font-mono">AMBIENT LIGHT</span>
                  <div className="text-sm font-mono font-bold text-cyan-300">{ambientLightLux} Lux</div>
                  <div className="text-[10px] text-slate-400">
                    {ambientLightLux < 300 ? '(Dusk/Dark)' : '(Bright Room)'}
                  </div>
                </div>
              </div>

              {/* Bottom Motion Trigger Button */}
              <div className="w-full flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={triggerMotion}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all"
                >
                  <Activity className="h-4 w-4" />
                  <span>Simulate Person Entering Room</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Mode:</span>
                  <button
                    onClick={() => setHomeMode('auto')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      homeMode === 'auto' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => setHomeMode('manual')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      homeMode === 'manual' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Controls & Event History */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-cyan-400" />
                Home Automation Controls
              </h4>

              {homeMode === 'manual' ? (
                <div>
                  <span className="text-xs text-slate-400 block mb-2">Manual Light Switch:</span>
                  <button
                    onClick={() => setManualLightOn(!manualLightOn)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs border transition-all ${
                      manualLightOn
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Switch is {manualLightOn ? 'ON' : 'OFF'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Ambient Daylight Level</span>
                    <span className="font-mono text-cyan-400 font-bold">{ambientLightLux} Lux</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="600"
                    value={ambientLightLux}
                    onChange={(e) => setAmbientLightLux(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Auto-light triggers only if ambient light &lt; 300 Lux when motion is detected.
                  </p>
                </div>
              )}

              {/* Event Log */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                  <History className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Real-Time Edge Event Log</span>
                </div>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {homeEvents.map((ev) => (
                    <div key={ev.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px]">
                      <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                        <span>{ev.time}</span>
                        <span className="text-cyan-400 font-semibold">{ev.type.toUpperCase()}</span>
                      </div>
                      <div className="text-slate-300 mt-0.5">{ev.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SCENARIO B: INDUSTRIAL TEMPERATURE SAFETY MONITORING */}
      {/* ==================================================== */}
      {activeTab === 'temp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-circuit-dots opacity-40 pointer-events-none" />

              {/* Overheating Alarm Badge */}
              <div className="absolute top-4 left-4 z-10">
                {isOverheating ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>EMERGENCY COOLING ACTIVE ({furnaceTemp}°C &ge; {safetyThreshold}°C)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Thermal Core Stable</span>
                  </div>
                )}
              </div>

              {/* Graphic: Industrial Reactor Chamber with Cooling Fan */}
              <div className="w-full max-w-sm flex items-center justify-around py-6">
                {/* Reactor Core */}
                <div className="flex flex-col items-center">
                  <div
                    className="relative w-28 h-40 rounded-2xl border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-xl"
                    style={{
                      borderColor: isOverheating ? '#f43f5e' : '#38bdf8',
                      backgroundColor: isOverheating ? 'rgba(244, 63, 94, 0.15)' : '#0f172a',
                      boxShadow: isOverheating ? '0 0 30px rgba(244, 63, 94, 0.35)' : 'none'
                    }}
                  >
                    <Thermometer className={`h-10 w-10 ${isOverheating ? 'text-rose-400 animate-bounce' : 'text-cyan-400'}`} />
                    <span className="text-xl font-mono font-bold text-white mt-1">{furnaceTemp}°C</span>
                    <span className="text-[10px] text-slate-400">CHAMBER</span>
                  </div>
                </div>

                {/* Simulated Brushless DC Cooling Fan */}
                <div className="flex flex-col items-center">
                  <div
                    className={`h-28 w-28 rounded-full border-4 border-slate-700 flex items-center justify-center bg-slate-900 transition-all ${
                      fanRpm > 0 ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' : ''
                    }`}
                  >
                    <Fan
                      className={`h-16 w-16 text-cyan-400 ${
                        fanRpm > 0 ? 'animate-spin' : 'opacity-40'
                      }`}
                      style={{
                        animationDuration: fanRpm > 2000 ? '0.2s' : fanRpm > 0 ? '0.6s' : '0s'
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 mt-2">
                    {fanRpm} RPM
                  </span>
                  <span className="text-[10px] text-slate-400">COOLING BLOWER</span>
                </div>
              </div>

              {/* Slider for Temperature */}
              <div className="w-full pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Adjust Chamber Temperature</span>
                  <span className="font-mono text-rose-400 font-bold">{furnaceTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={furnaceTemp}
                  onChange={(e) => handleTempChange(parseInt(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>20°C (Ambient)</span>
                  <span>60°C (Normal Load)</span>
                  <span>80°C (Critical)</span>
                  <span>120°C (Maximum)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Threshold config & Events */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-rose-400" />
                Safety Configuration
              </h4>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Trip Alarm Threshold</span>
                  <span className="font-mono text-rose-400 font-bold">{safetyThreshold}°C</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={safetyThreshold}
                  onChange={(e) => setSafetyThreshold(parseInt(e.target.value))}
                  className="w-full accent-rose-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Event Log */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                  <History className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Thermal Protection Event Log</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {tempEvents.map((ev) => (
                    <div key={ev.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px]">
                      <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                        <span>{ev.time}</span>
                        <span className="text-rose-400 font-semibold">{ev.type.toUpperCase()}</span>
                      </div>
                      <div className="text-slate-300 mt-0.5">{ev.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SCENARIO C: SMART IRRIGATION */}
      {/* ==================================================== */}
      {activeTab === 'irrigation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-circuit-dots opacity-40 pointer-events-none" />

              {/* Status Header */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSoilStatus(soilMoisturePct).color}`}>
                  {getSoilStatus(soilMoisturePct).label}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  isPumpRunning ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  Water Pump: {isPumpRunning ? 'PUMPING (ON)' : 'IDLE (OFF)'}
                </span>
              </div>

              {/* Graphic: Soil Pot & Irrigation Pump */}
              <div className="w-full max-w-sm flex items-center justify-around py-6">
                {/* Soil Plant Graphic */}
                <div className="flex flex-col items-center">
                  <div className="relative w-28 h-32 rounded-b-3xl border-4 border-amber-900 bg-amber-950/60 flex flex-col items-center justify-end p-2 overflow-hidden shadow-xl">
                    <div
                      className="w-full rounded-b-2xl bg-gradient-to-t from-blue-600 to-emerald-700 transition-all duration-500"
                      style={{ height: `${soilMoisturePct}%` }}
                    />
                    <div className="absolute top-3 flex flex-col items-center">
                      <Droplet className={`h-8 w-8 ${soilMoisturePct < 30 ? 'text-amber-500' : 'text-emerald-400'}`} />
                      <span className="text-xs font-mono font-bold text-white mt-1">{soilMoisturePct}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">CAPACITIVE SENSOR</span>
                </div>

                {/* Submersible Pump */}
                <div className="flex flex-col items-center">
                  <div className={`p-5 rounded-2xl border-2 transition-all ${
                    isPumpRunning
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-xl shadow-cyan-500/30 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <Activity className={`h-10 w-10 ${isPumpRunning ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 mt-2">
                    {isPumpRunning ? 'FLOW RATE: 2.4 L/min' : '0.0 L/min'}
                  </span>
                  <span className="text-[10px] text-slate-400">12V SUBMERSIBLE PUMP</span>
                </div>
              </div>

              {/* Slider for Soil Moisture */}
              <div className="w-full pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Simulate Soil Moisture Level</span>
                  <span className="font-mono text-emerald-400 font-bold">{soilMoisturePct}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={soilMoisturePct}
                  onChange={(e) => handleMoistureChange(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>5% (Bone Dry)</span>
                  <span>35% (Threshold)</span>
                  <span>60% (Optimal)</span>
                  <span>95% (Saturated)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Controls & Event History */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Droplet className="h-4 w-4 text-emerald-400" />
                Irrigation Threshold Logic
              </h4>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Automated Watering Trigger</span>
                  <span className="font-mono text-emerald-400 font-bold">{irrigationThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={irrigationThreshold}
                  onChange={(e) => setIrrigationThreshold(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When moisture drops below this value, the irrigation pump turns ON automatically.
                </p>
              </div>

              {/* Event Log */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                  <History className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Irrigation Telemetry Log</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {irrigationEvents.map((ev) => (
                    <div key={ev.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px]">
                      <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                        <span>{ev.time}</span>
                        <span className="text-emerald-400 font-semibold">{ev.type.toUpperCase()}</span>
                      </div>
                      <div className="text-slate-300 mt-0.5">{ev.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

