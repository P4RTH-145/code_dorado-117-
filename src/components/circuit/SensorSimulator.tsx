import React, { useState } from 'react';
import { 
  Thermometer, 
  Sun, 
  Radio, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SensorSimulator: React.FC = () => {
  const [activeSensor, setActiveSensor] = useState<'temp' | 'light' | 'ultrasonic'>('temp');

  // Temperature Sensor State (LM35)
  const [temperatureC, setTemperatureC] = useState<number>(28); // -10 to 110 °C
  const [tempThreshold, setTempThreshold] = useState<number>(50); // alert above 50°C

  // Light Sensor State (LDR + 10kΩ divider)
  const [ambientLux, setAmbientLux] = useState<number>(450); // 0 to 1000 Lux
  const [lightThreshold, setLightThreshold] = useState<number>(200); // trigger dark mode

  // Ultrasonic Sensor State (HC-SR04)
  const [distanceCm, setDistanceCm] = useState<number>(35); // 2 to 400 cm
  const [distanceThreshold, setDistanceThreshold] = useState<number>(15); // collision alert <= 15cm

  const { completeExperiment } = useApp();

  // Calculations for LM35
  // LM35 outputs 10mV / °C. At 28°C -> 280mV = 0.28V.
  // 10-bit ADC with 5V reference: ADC = (V_out / 5.0) * 1023
  const tempMv = Math.max(0, temperatureC * 10);
  const tempVolts = tempMv / 1000;
  const tempAdc = Math.round((tempVolts / 5.0) * 1023);
  const isTempAlert = temperatureC >= tempThreshold;

  // Calculations for LDR
  // Approximate LDR resistance in 10kΩ voltage divider: R_ldr = 500000 / (lux + 1)
  const rLdr = Math.round(500000 / (ambientLux + 10)); // ohms
  const rFixed = 10000; // 10 kΩ
  // Voltage divider: V_out = 5V * (R_fixed / (R_ldr + R_fixed))
  const lightVolts = Number((5.0 * (rFixed / (rLdr + rFixed))).toFixed(2));
  const lightAdc = Math.round((lightVolts / 5.0) * 1023);
  const isLightAlert = ambientLux <= lightThreshold;

  // Calculations for HC-SR04
  // Speed of sound = 340 m/s = 0.034 cm/µs. Round trip time t = 2 * d / 0.034 ≈ d * 58.82 µs.
  const pulseDurationUs = Math.round(distanceCm * 58.82);
  const isDistanceAlert = distanceCm <= distanceThreshold;

  const handleSelectSensor = (sensor: 'temp' | 'light' | 'ultrasonic') => {
    setActiveSensor(sensor);
    completeExperiment(`sensor-${sensor}`, `${sensor.toUpperCase()} Sensor Simulator`, 25);
  };

  return (
    <div className="space-y-6">
      {/* Sensor Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleSelectSensor('temp')}
          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
            activeSensor === 'temp'
              ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Thermometer className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">LM35 Temperature Sensor</div>
            <div className="text-[11px] text-slate-400">Analog 10 mV/°C Precision</div>
          </div>
        </button>

        <button
          onClick={() => handleSelectSensor('light')}
          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
            activeSensor === 'light'
              ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">LDR Ambient Light Sensor</div>
            <div className="text-[11px] text-slate-400">Photoresistor Voltage Divider</div>
          </div>
        </button>

        <button
          onClick={() => handleSelectSensor('ultrasonic')}
          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
            activeSensor === 'ultrasonic'
              ? 'bg-gradient-to-r from-violet-500/15 to-purple-500/15 border-violet-500/40 text-violet-300 shadow-md shadow-violet-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <div className="h-10 w-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">HC-SR04 Ultrasonic Sensor</div>
            <div className="text-[11px] text-slate-400">Sonar Echo Time-of-Flight</div>
          </div>
        </button>
      </div>

      {/* Main Sensor Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Visual Sensor Graphic */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-circuit-dots opacity-40 pointer-events-none" />

            {/* Threshold Alert Banner */}
            <div className="absolute top-4 left-4 z-10">
              {activeSensor === 'temp' && (
                isTempAlert ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>HIGH TEMP ALERT ({temperatureC}°C &ge; {tempThreshold}°C)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Normal Operating Range</span>
                  </div>
                )
              )}

              {activeSensor === 'light' && (
                isLightAlert ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold animate-pulse">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>LOW LIGHT DETECTED ({ambientLux} Lux &le; {lightThreshold} Lux)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Daylight Illuminated</span>
                  </div>
                )
              )}

              {activeSensor === 'ultrasonic' && (
                isDistanceAlert ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-bounce">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>OBSTACLE PROXIMITY ALERT ({distanceCm}cm &le; {distanceThreshold}cm)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Clear Path</span>
                  </div>
                )
              )}
            </div>

            {/* Simulated Graphics per Sensor */}
            <div className="w-full max-w-md py-6 flex flex-col items-center justify-center">
              {activeSensor === 'temp' && (
                <div className="flex items-center gap-10">
                  {/* Thermometer Tube Graphic */}
                  <div className="relative w-12 h-56 rounded-full bg-slate-900 border-2 border-slate-700 flex flex-col justify-end p-1.5 shadow-inner">
                    <div
                      className="w-full rounded-full transition-all duration-300 bg-gradient-to-t from-blue-500 via-amber-500 to-rose-500"
                      style={{
                        height: `${Math.min(100, Math.max(10, ((temperatureC + 10) / 120) * 100))}%`
                      }}
                    />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-rose-600 border-4 border-slate-900 shadow-lg flex items-center justify-center text-xs font-bold text-white">
                      {temperatureC}°C
                    </div>
                  </div>

                  {/* LM35 IC Pinout Diagram */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-2">
                    <div className="font-bold text-slate-300 text-center pb-1 border-b border-slate-800">
                      LM35 TO-92 SILICON IC
                    </div>
                    <div className="flex items-center justify-between gap-4 text-slate-400">
                      <span>Pin 1 (Vs):</span>
                      <span className="text-cyan-400">+5.0V DC</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-slate-400">
                      <span>Pin 2 (Vout):</span>
                      <span className="text-emerald-400 font-bold">{tempMv} mV</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-slate-400">
                      <span>Pin 3 (GND):</span>
                      <span className="text-slate-400">0V (GND)</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400">
                      Scale: 10 mV / 1.0°C
                    </div>
                  </div>
                </div>
              )}

              {activeSensor === 'light' && (
                <div className="flex flex-col items-center gap-6">
                  {/* Light Bulb / Lux Indicator */}
                  <div
                    className="h-28 w-28 rounded-full border-4 border-slate-800 flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: `rgba(250, 204, 21, ${ambientLux / 1000})`,
                      boxShadow: `0 0 ${Math.round(ambientLux / 15)}px rgba(250, 204, 21, 0.6)`
                    }}
                  >
                    <Sun className={`h-12 w-12 ${ambientLux > 300 ? 'text-amber-950' : 'text-slate-300'}`} />
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-mono font-bold text-amber-300">{ambientLux} Lux</div>
                    <div className="text-xs text-slate-400">Photo-conductive LDR Resistance: ~{rLdr.toLocaleString()} Ω</div>
                  </div>
                </div>
              )}

              {activeSensor === 'ultrasonic' && (
                <div className="w-full flex flex-col items-center gap-4">
                  {/* Visual Sonar Beam Graphic */}
                  <div className="relative w-full h-32 flex items-center justify-between px-6 bg-slate-900/60 rounded-xl border border-slate-800">
                    {/* Sensor Node */}
                    <div className="flex flex-col items-center">
                      <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center text-[10px] text-cyan-300 font-bold">
                          T
                        </div>
                        <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-emerald-400 flex items-center justify-center text-[10px] text-emerald-300 font-bold">
                          R
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 font-mono">HC-SR04</span>
                    </div>

                    {/* Sonar Wave Pulses */}
                    <div className="flex-1 mx-4 flex items-center justify-center relative">
                      <div className="h-0.5 w-full bg-dashed bg-cyan-500/30" />
                      <div
                        className="absolute h-16 w-16 border-r-4 border-cyan-400 rounded-full animate-ping opacity-60 pointer-events-none"
                        style={{ left: `${Math.min(80, (distanceCm / 400) * 100)}%` }}
                      />
                    </div>

                    {/* Obstacle Target */}
                    <div
                      className="w-6 h-20 rounded-md bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-500 flex items-center justify-center text-[10px] text-slate-300 font-bold rotate-6"
                      title="Obstacle Target Wall"
                    >
                      WALL
                    </div>
                  </div>

                  <div className="text-center font-mono">
                    <span className="text-2xl font-bold text-cyan-300">{distanceCm} cm</span>
                    <span className="text-xs text-slate-400 ml-2">({(distanceCm / 100).toFixed(2)} m)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Sliders & Telemetry Readouts */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Telemetry Display */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Simulated Telemetry Metrics</h4>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[10px]">
                10-BIT ADC
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {activeSensor === 'temp' && (
                <>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[11px] text-slate-400 mb-1">Analog Voltage</div>
                    <div className="text-xl font-mono font-bold text-amber-300">{tempMv} mV</div>
                    <div className="text-[10px] text-slate-400 mt-1">{tempVolts.toFixed(3)} V</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[11px] text-slate-400 mb-1">10-Bit ADC Count</div>
                    <div className="text-xl font-mono font-bold text-cyan-300">{tempAdc}</div>
                    <div className="text-[10px] text-slate-400 mt-1">out of 1023</div>
                  </div>
                </>
              )}

              {activeSensor === 'light' && (
                <>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[11px] text-slate-400 mb-1">Divider Voltage</div>
                    <div className="text-xl font-mono font-bold text-cyan-300">{lightVolts} V</div>
                    <div className="text-[10px] text-slate-400 mt-1">across 10k resistor</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[11px] text-slate-400 mb-1">10-Bit ADC Count</div>
                    <div className="text-xl font-mono font-bold text-amber-300">{lightAdc}</div>
                    <div className="text-[10px] text-slate-400 mt-1">out of 1023</div>
                  </div>
                </>
              )}

              {activeSensor === 'ultrasonic' && (
                <>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[11px] text-slate-400 mb-1">Echo Pulse Duration</div>
                    <div className="text-xl font-mono font-bold text-violet-300">{pulseDurationUs} µs</div>
                    <div className="text-[10px] text-slate-400 mt-1">round-trip echo</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="text-[11px] text-slate-400 mb-1">Speed of Sound</div>
                    <div className="text-xl font-mono font-bold text-cyan-300">343 m/s</div>
                    <div className="text-[10px] text-slate-400 mt-1">in dry air @ 20°C</div>
                  </div>
                </>
              )}
            </div>

            {/* Formula Explanatory note */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
              {activeSensor === 'temp' && (
                <div>ADC_val = (Temp_C × 10mV / 5000mV) × 1023 = {tempAdc}</div>
              )}
              {activeSensor === 'light' && (
                <div>V_out = 5.0 × (10k / (R_ldr + 10k)) = {lightVolts}V</div>
              )}
              {activeSensor === 'ultrasonic' && (
                <div>Distance = (Pulse_Duration_µs / 58.82) = {distanceCm} cm</div>
              )}
            </div>
          </div>

          {/* Interactive Sliders Panel */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
            {activeSensor === 'temp' && (
              <>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Ambient Temperature</span>
                    <span className="font-mono text-amber-400 font-bold">{temperatureC} °C</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="110"
                    value={temperatureC}
                    onChange={(e) => setTemperatureC(parseInt(e.target.value))}
                    className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>-10°C (Freezing)</span>
                    <span>25°C (Room)</span>
                    <span>50°C (Industrial)</span>
                    <span>110°C (Boiling)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Configurable Alarm Threshold</span>
                    <span className="font-mono text-rose-400 font-bold">{tempThreshold} °C</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    value={tempThreshold}
                    onChange={(e) => setTempThreshold(parseInt(e.target.value))}
                    className="w-full accent-rose-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {activeSensor === 'light' && (
              <>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Ambient Illuminance</span>
                    <span className="font-mono text-cyan-400 font-bold">{ambientLux} Lux</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={ambientLux}
                    onChange={(e) => setAmbientLux(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0 (Dark Night)</span>
                    <span>250 (Office)</span>
                    <span>500 (Study Desk)</span>
                    <span>1000 (Sunlight)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Dark Trigger Threshold</span>
                    <span className="font-mono text-indigo-400 font-bold">{lightThreshold} Lux</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={lightThreshold}
                    onChange={(e) => setLightThreshold(parseInt(e.target.value))}
                    className="w-full accent-indigo-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}

            {activeSensor === 'ultrasonic' && (
              <>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Obstacle Distance</span>
                    <span className="font-mono text-violet-400 font-bold">{distanceCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="400"
                    value={distanceCm}
                    onChange={(e) => setDistanceCm(parseInt(e.target.value))}
                    className="w-full accent-violet-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>2 cm (Min)</span>
                    <span>50 cm</span>
                    <span>200 cm (2m)</span>
                    <span>400 cm (Max)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-300">Proximity Collision Threshold</span>
                    <span className="font-mono text-rose-400 font-bold">{distanceThreshold} cm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={distanceThreshold}
                    onChange={(e) => setDistanceThreshold(parseInt(e.target.value))}
                    className="w-full accent-rose-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

