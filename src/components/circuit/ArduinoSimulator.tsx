import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  Code2, 
  Sliders, 
  Volume2, 
  Lightbulb, 
  Zap, 
  Fan, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ArduinoProject } from '../../types';

export const ArduinoSimulator: React.FC = () => {
  const { arduinoProjects, completeExperiment } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    arduinoProjects[0]?.id || 'arduino-smart-thermostat'
  );

  const activeProject: ArduinoProject = 
    arduinoProjects.find(p => p.id === selectedProjectId) || arduinoProjects[0];

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [sensorValue, setSensorValue] = useState<number>(50); // 0 to 100%
  const [serialLogs, setSerialLogs] = useState<string[]>([
    '[BOOT] Arduino UNO ATmega328P bootloader initialized.',
    '[SERIAL] Serial interface connected at 115200 baud.',
    '[READY] Sketch loaded into flash memory (28.4 KB / 32 KB).'
  ]);
  const [serialInput, setSerialInput] = useState<string>('');
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [activeTab, setActiveTab] = useState<'board' | 'code'>('board');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileStatus, setCompileStatus] = useState<string | null>(null);

  // Dynamic simulation telemetry loop
  useEffect(() => {
    if (!isRunning || !activeProject) return;

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      let logLine = '';

      if (activeProject.actuatorType === 'motor') {
        const tempC = Math.round(20 + (sensorValue / 100) * 70); // 20°C to 90°C
        const rawADC = Math.round((tempC / 100) * 1023 * (5.0 / 5.0));
        const isHot = tempC >= 45;
        const fanSpeed = isHot ? Math.min(255, Math.round(150 + ((tempC - 45) / 45) * 105)) : 0;
        
        logLine = `[${now}] Sensor A0: ${tempC}°C (ADC: ${rawADC}) -> ${
          isHot ? `ALERT: Fan MOSFET PWM Pin 9 = ${fanSpeed}/255` : 'Normal (Fan Idle)'
        }`;
      } else if (activeProject.actuatorType === 'relay') {
        const ldrAdc = Math.round((sensorValue / 100) * 1023);
        const isDark = ldrAdc < 300;
        logLine = `[${now}] Photocell A1: ${ldrAdc} ADC -> ${
          isDark ? 'DUSK: Relay Pin 8 CLOSED [HIGH BEAM ON]' : 'DAYLIGHT: Relay Pin 8 OPEN [OFF]'
        }`;
      } else if (activeProject.actuatorType === 'buzzer') {
        const distCm = Math.max(2, Math.round((sensorValue / 100) * 150));
        const freqHz = Math.round(2000 - distCm * 10);
        logLine = `[${now}] Sonar Echo: ${distCm} cm -> Pin 6 Chirp: ${distCm < 30 ? 'CRITICAL ' : ''}${freqHz} Hz`;
      } else {
        const adc = Math.round((sensorValue / 100) * 1023);
        logLine = `[${now}] Pin ${activeProject.connectedPin || 13} Telemetry ADC: ${adc}`;
      }

      setSerialLogs(prev => [...prev.slice(-35), logLine]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning, sensorValue, activeProject]);

  const handleSendSerial = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!serialInput.trim()) return;
    const now = new Date().toLocaleTimeString();
    setSerialLogs(prev => [
      ...prev,
      `[${now}] > TX: ${serialInput.trim()}`,
      `[${now}] < RX: ACK command "${serialInput.trim()}" executed.`
    ]);
    setSerialInput('');
  };

  const handleCompileAndUpload = () => {
    setIsCompiling(true);
    setCompileStatus('Compiling sketch with avr-g++...');
    setTimeout(() => {
      setCompileStatus('Verifying memory boundaries & linking binary...');
      setTimeout(() => {
        setIsCompiling(false);
        setCompileStatus('Binary flashed successfully to ATmega328P (100% verified)!');
        completeExperiment('arduino-sim', `Arduino: ${activeProject.title}`, 30);
        setTimeout(() => setCompileStatus(null), 3500);
      }, 700);
    }, 800);
  };

  const handleReset = () => {
    setSerialLogs([
      '[BOOT] ATmega328P Hardware Reset Pin Pulsed LOW.',
      '[BOOT] Initializing Arduino bootloader registers...',
      '[READY] System ready. void loop() running.'
    ]);
    setSensorValue(50);
  };

  // Derive actuator states for visual graphics
  const isActuatorTriggered = (() => {
    if (!activeProject) return false;
    if (activeProject.actuatorType === 'motor') {
      const tempC = 20 + (sensorValue / 100) * 70;
      return tempC >= 45;
    }
    if (activeProject.actuatorType === 'relay') {
      const ldrAdc = (sensorValue / 100) * 1023;
      return ldrAdc < 300;
    }
    if (activeProject.actuatorType === 'buzzer') {
      const distCm = (sensorValue / 100) * 150;
      return distCm < 40;
    }
    return sensorValue > 50;
  })();

  return (
    <div className="space-y-6">
      {/* Top Project Selector Bar */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
              ARDUINO UNO WORKBENCH
            </span>
            <span className="text-xs text-slate-400 font-mono">ATmega328P @ 16 MHz</span>
          </div>
          <h2 className="text-lg font-bold text-white">{activeProject?.title}</h2>
          <p className="text-xs text-slate-300 max-w-2xl">{activeProject?.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
              setSerialLogs(prev => [
                ...prev,
                `[SYSTEM] Switched project to ${e.target.value}. Flashing sketch...`
              ]);
            }}
            className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none"
          >
            {arduinoProjects.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Visual Arduino Board & Interactive Actuator Breadboard */}
        <div className="lg:col-span-7 space-y-6">
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('board')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'board'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Visual Hardware Board</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'code'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Arduino C++ Sketch</span>
              </button>
            </div>

            {/* Run / Stop Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isRunning
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isRunning ? 'Running' : 'Paused'}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Reset Microcontroller"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {activeTab === 'board' ? (
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-2xl space-y-6">
              {/* Visual Graphic Representation of Arduino UNO */}
              <div className="relative rounded-2xl bg-[#005B66] p-6 border-2 border-[#008184] shadow-inner text-white overflow-hidden">
                {/* PCB silkscreen markings */}
                <div className="absolute top-3 left-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-900 border border-slate-700" />
                  <span className="font-mono text-xs font-black tracking-wider text-teal-200">
                    ARDUINO UNO R3
                  </span>
                </div>

                <div className="absolute top-3 right-4 font-mono text-[10px] text-teal-200 uppercase tracking-widest">
                  ITALY DESIGN • 16MHz
                </div>

                {/* Main components on board */}
                <div className="grid grid-cols-12 gap-4 mt-6">
                  {/* Left: USB-B port & Barrel Power Jack */}
                  <div className="col-span-3 space-y-4">
                    <div className="w-14 h-16 rounded bg-gradient-to-b from-slate-400 to-slate-600 border border-slate-300 flex items-center justify-center text-[9px] font-mono font-bold text-slate-900 shadow">
                      USB B
                    </div>
                    <div className="w-12 h-14 rounded-r-lg bg-gradient-to-r from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-[8px] font-mono text-slate-400 shadow">
                      PWR 7-12V
                    </div>
                  </div>

                  {/* Center: ATmega328P Microcontroller */}
                  <div className="col-span-6 flex flex-col items-center justify-center space-y-3">
                    <div className="w-full py-4 px-3 rounded-lg bg-slate-950 border-2 border-slate-800 shadow-2xl relative">
                      <div className="text-center font-mono font-bold text-xs text-slate-300 tracking-wider">
                        ATmega328P-PU
                      </div>
                      <div className="text-center font-mono text-[9px] text-slate-500">
                        MICROCHIP AVR 8-BIT
                      </div>
                      {/* Notch */}
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-4 rounded-r-full bg-slate-900 border-r border-slate-700" />
                    </div>

                    {/* Status LEDs on board */}
                    <div className="flex items-center gap-4 text-[10px] font-mono">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2.5 w-2.5 rounded-full transition-all ${
                            isRunning ? 'bg-emerald-400 shadow-lg shadow-emerald-400/80 animate-pulse' : 'bg-slate-700'
                          }`}
                        />
                        <span className="text-emerald-200 font-bold">ON</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2.5 w-2.5 rounded-full transition-all ${
                            isActuatorTriggered
                              ? 'bg-amber-400 shadow-lg shadow-amber-400/80'
                              : 'bg-slate-700'
                          }`}
                        />
                        <span className="text-amber-200 font-bold">L (Pin 13)</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2.5 w-2.5 rounded-full transition-all ${
                            isRunning ? 'bg-yellow-400 animate-ping' : 'bg-slate-700'
                          }`}
                        />
                        <span className="text-yellow-200">TX/RX</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Digital Header Pins */}
                  <div className="col-span-3 flex flex-col justify-between items-end space-y-2">
                    <div className="bg-slate-950/80 border border-slate-800 p-2 rounded-lg text-right">
                      <div className="text-[9px] font-mono text-teal-300 font-bold mb-1">
                        DIGITAL PIN {activeProject.connectedPin || 9}
                      </div>
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-white">
                          {isActuatorTriggered ? 'HIGH (5V)' : 'LOW (0V)'}
                        </span>
                        <div
                          className={`h-3 w-3 rounded-full border ${
                            isActuatorTriggered
                              ? 'bg-cyan-400 border-cyan-300 shadow-md shadow-cyan-400/80'
                              : 'bg-slate-800 border-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom header pin rail */}
                <div className="mt-6 pt-3 border-t border-teal-600/60 flex items-center justify-between text-[9px] font-mono text-teal-200">
                  <span>ANALOG IN: [A0] [A1] [A2] [A3] [A4] [A5]</span>
                  <span>POWER: [5V] [3.3V] [GND] [VIN]</span>
                </div>
              </div>

              {/* Breadboard & Actuator Telemetry Display */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Connected Output Actuator: {activeProject.actuatorType.toUpperCase()}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActuatorTriggered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isActuatorTriggered ? 'ACTUATOR ACTIVE' : 'IDLE / OFF'}
                  </span>
                </div>

                {/* Visual Actuator Rendering */}
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-around">
                  {/* If Motor/Fan */}
                  {activeProject.actuatorType === 'motor' && (
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`h-24 w-24 rounded-full border-4 flex items-center justify-center transition-all ${
                          isActuatorTriggered
                            ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/30'
                            : 'border-slate-800 bg-slate-900 text-slate-600'
                        }`}
                      >
                        <Fan
                          className={`h-14 w-14 transition-all ${
                            isActuatorTriggered
                              ? 'text-cyan-300 animate-spin'
                              : 'text-slate-600'
                          }`}
                          style={{
                            animationDuration: isActuatorTriggered ? '0.4s' : '0s'
                          }}
                        />
                      </div>
                      <div className="text-center font-mono">
                        <div className="text-xs font-bold text-white">
                          {isActuatorTriggered ? 'PWM Fan Speed: High (100%)' : 'Fan Speed: 0 RPM'}
                        </div>
                        <div className="text-[10px] text-slate-400">Gate Driver on Pin 9</div>
                      </div>
                    </div>
                  )}

                  {/* If Relay */}
                  {activeProject.actuatorType === 'relay' && (
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`p-4 rounded-xl border-2 flex items-center justify-center transition-all ${
                          isActuatorTriggered
                            ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div className="h-16 w-24 rounded-lg bg-blue-700 border border-blue-500 flex flex-col items-center justify-center font-mono text-[10px] text-white shadow">
                          <span>SONGLE RELAY</span>
                          <span className="text-[9px] text-blue-200">10A 250VAC</span>
                          <span className="text-[8px] font-bold text-amber-300 mt-1">
                            {isActuatorTriggered ? '[COIL ENERGIZED]' : '[OPEN]'}
                          </span>
                        </div>
                      </div>
                      <div className="text-center font-mono">
                        <div className="text-xs font-bold text-white">
                          {isActuatorTriggered ? 'Streetlight Lamp: ILLUMINATED (220V)' : 'Streetlight Lamp: OFF'}
                        </div>
                        <div className="text-[10px] text-slate-400">Controlled by Transistor on Pin 8</div>
                      </div>
                    </div>
                  )}

                  {/* If Buzzer */}
                  {activeProject.actuatorType === 'buzzer' && (
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`h-20 w-20 rounded-full border-4 flex items-center justify-center transition-all ${
                          isActuatorTriggered
                            ? 'border-amber-400 bg-amber-950/30 text-amber-300 shadow-xl shadow-amber-500/30 animate-bounce'
                            : 'border-slate-800 bg-slate-900 text-slate-600'
                        }`}
                      >
                        <Volume2 className="h-10 w-10" />
                      </div>
                      <div className="text-center font-mono">
                        <div className="text-xs font-bold text-white">
                          {isActuatorTriggered ? 'Piezo Sonar Alarm: 1850 Hz Chirp' : 'Buzzer Muted'}
                        </div>
                        <div className="text-[10px] text-slate-400">PWM Output on Pin 6</div>
                      </div>
                    </div>
                  )}

                  {/* If LED */}
                  {activeProject.actuatorType === 'led' && (
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`h-20 w-20 rounded-full border-4 flex items-center justify-center transition-all ${
                          isActuatorTriggered
                            ? 'border-red-500 bg-red-500 shadow-2xl shadow-red-500/80 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-600'
                        }`}
                      >
                        <Lightbulb className="h-10 w-10" />
                      </div>
                      <div className="text-center font-mono">
                        <div className="text-xs font-bold text-white">
                          {isActuatorTriggered ? 'Indicator LED: GLOWING' : 'Indicator LED: OFF'}
                        </div>
                        <div className="text-[10px] text-slate-400">Pin {activeProject.connectedPin}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulated Input Telemetry Slider */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Adjust Sensor Input Simulation:</span>
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">{sensorValue}% Level</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sensorValue}
                    onChange={(e) => setSensorValue(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Min Input (0%)</span>
                    <span>Set Trigger Threshold</span>
                    <span>Max Input (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Arduino C++ Sketch Code Viewer */
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    main.ino — Arduino C++ Firmware
                  </span>
                </div>
                <button
                  onClick={handleCompileAndUpload}
                  disabled={isCompiling}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isCompiling ? 'Compiling & Flashing...' : 'Verify & Upload'}
                </button>
              </div>

              {compileStatus && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{compileStatus}</span>
                </div>
              )}

              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-cyan-200 overflow-x-auto leading-relaxed max-h-[480px]">
                {activeProject?.sketchCode}
              </pre>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Serial Monitor Telemetry Console */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-5 shadow-2xl flex flex-col h-[650px]">
            {/* Serial Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Serial Monitor
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={baudRate}
                  onChange={(e) => setBaudRate(Number(e.target.value))}
                  className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 focus:outline-none"
                >
                  <option value={9600}>9600 baud</option>
                  <option value={115200}>115200 baud</option>
                </select>

                <button
                  onClick={() => setSerialLogs([])}
                  className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Serial Logs Screen */}
            <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] text-emerald-400/90 space-y-1.5 scrollbar-thin">
              {serialLogs.map((log, index) => (
                <div key={index} className="leading-tight break-all">
                  {log}
                </div>
              ))}
            </div>

            {/* Serial Input Bar */}
            <form onSubmit={handleSendSerial} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                placeholder="Send Serial command (e.g. GET_TEMP, STATUS)..."
                className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

