import { CodingChallenge } from '../types';

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: 'challenge-blink-led',
    title: '1. Blink an LED State Toggle',
    category: 'Embedded Logic',
    difficulty: 'Beginner',
    description: 'Calculate the target digital pin state (0 or 1) given the elapsed millisecond timestamp and the blink period.',
    problemStatement: `In embedded microcontroller firmware without blocking \`delay()\`, developers use timestamp comparisons with \`millis()\` to toggle pin states.

Write a function \`getLedState(currentMillis, periodMs)\` that returns:
- \`1\` (HIGH) if the current time cycle is in the first half of the period (i.e. \`elapsed % periodMs < periodMs / 2\`).
- \`0\` (LOW) if in the second half.
- If \`periodMs <= 0\`, return \`0\`.`,
    starterCode: `function getLedState(currentMillis, periodMs) {
  // Your code here
  // Return 1 for HIGH or 0 for LOW
  if (periodMs <= 0) return 0;
  
  const phase = currentMillis % periodMs;
  return phase < (periodMs / 2) ? 1 : 0;
}`,
    solutionCode: `function getLedState(currentMillis, periodMs) {
  if (periodMs <= 0) return 0;
  const phase = currentMillis % periodMs;
  return phase < (periodMs / 2) ? 1 : 0;
}`,
    hints: [
      'Use the modulo operator: `currentMillis % periodMs` gives elapsed time in the current cycle.',
      'Compare that value with `periodMs / 2` to decide whether it is ON or OFF.'
    ],
    explanation: 'Non-blocking timer logic allows the microcontroller to execute other sensor polling tasks without being stalled by hard delay loops.',
    xpReward: 50,
    functionName: 'getLedState',
    testCases: [
      { inputDescription: 'getLedState(100, 1000)', args: [100, 1000], expected: 1, explanation: '100ms is in first half of 1000ms period (0-499ms)' },
      { inputDescription: 'getLedState(650, 1000)', args: [650, 1000], expected: 0, explanation: '650ms is in second half of 1000ms period (500-999ms)' },
      { inputDescription: 'getLedState(2150, 500)', args: [2150, 500], expected: 0, explanation: '2150 % 500 = 150ms, wait: 500/2=250. 150 < 250 -> 1' },
      { inputDescription: 'getLedState(0, 0)', args: [0, 0], expected: 0, explanation: 'Period <= 0 returns 0' }
    ]
  },
  {
    id: 'challenge-read-switch',
    title: '2. Read Switch with Active-Low Debounce',
    category: 'Digital Input',
    difficulty: 'Beginner',
    description: 'Determine the debounced logical button state from multiple raw digital reads with an active-low pull-up configuration.',
    problemStatement: `Microcontroller pushbuttons with internal pull-up resistors read:
- Logic \`1\` (+3.3V) when UNPRESSED.
- Logic \`0\` (GND) when PRESSED.
Mechanical switch contacts also bounce for several milliseconds when pressed.

Write a function \`isButtonPressed(readings)\` where \`readings\` is an array of raw binary pin readings (e.g., \`[1, 0, 0, 0, 0]\`).
The button is considered genuinely PRESSED if at least 70% of the readings in the sample window are \`0\` (LOW).
Return \`true\` if pressed, \`false\` otherwise. If \`readings\` is empty, return \`false\`.`,
    starterCode: `function isButtonPressed(readings) {
  // Your code here
  // Return true if at least 70% of readings are 0 (LOW)
  if (!readings || readings.length === 0) return false;
  
  const lowCount = readings.filter(r => r === 0).length;
  return (lowCount / readings.length) >= 0.7;
}`,
    solutionCode: `function isButtonPressed(readings) {
  if (!readings || readings.length === 0) return false;
  const lowCount = readings.filter(r => r === 0).length;
  return (lowCount / readings.length) >= 0.7;
}`,
    hints: [
      'Active-low means 0 = button down.',
      'Count the number of 0s in the array and divide by `readings.length`.'
    ],
    explanation: 'Software debouncing eliminates spurious false triggers caused by mechanical spring vibration when switch contacts close.',
    xpReward: 55,
    functionName: 'isButtonPressed',
    testCases: [
      { inputDescription: 'isButtonPressed([0, 0, 0, 0, 0])', args: [[0, 0, 0, 0, 0]], expected: true, explanation: '100% low -> pressed' },
      { inputDescription: 'isButtonPressed([1, 1, 1, 1, 1])', args: [[1, 1, 1, 1, 1]], expected: false, explanation: 'All high -> not pressed' },
      { inputDescription: 'isButtonPressed([1, 0, 0, 0, 0])', args: [[1, 0, 0, 0, 0]], expected: true, explanation: '80% low -> pressed (>= 70%)' },
      { inputDescription: 'isButtonPressed([1, 1, 0, 0, 1])', args: [[1, 1, 0, 0, 1]], expected: false, explanation: '40% low -> noise bounce, false' }
    ]
  },
  {
    id: 'challenge-temp-threshold',
    title: '3. Temperature Safety Relay Controller',
    category: 'Industrial Control',
    difficulty: 'Intermediate',
    description: 'Implement a hysteresis thermostat controller that activates cooling fans and triggers safety alarms.',
    problemStatement: `To prevent rapid relay cycling (chattering) around a threshold, industrial controllers use hysteresis.

Write a function \`getThermostatAction(currentTemp, setpoint, deadband)\`:
- If \`currentTemp >= setpoint + deadband\`: return \`"COOLING_ON"\`
- If \`currentTemp <= setpoint - deadband\`: return \`"COOLING_OFF"\`
- If \`currentTemp > setpoint + (deadband * 2)\`: return \`"CRITICAL_ALARM"\`
- Otherwise, return \`"HOLD"\` to maintain current state.`,
    starterCode: `function getThermostatAction(currentTemp, setpoint, deadband) {
  // Your code here
  if (currentTemp > setpoint + (deadband * 2)) {
    return "CRITICAL_ALARM";
  }
  if (currentTemp >= setpoint + deadband) {
    return "COOLING_ON";
  }
  if (currentTemp <= setpoint - deadband) {
    return "COOLING_OFF";
  }
  return "HOLD";
}`,
    solutionCode: `function getThermostatAction(currentTemp, setpoint, deadband) {
  if (currentTemp > setpoint + (deadband * 2)) {
    return "CRITICAL_ALARM";
  }
  if (currentTemp >= setpoint + deadband) {
    return "COOLING_ON";
  }
  if (currentTemp <= setpoint - deadband) {
    return "COOLING_OFF";
  }
  return "HOLD";
}`,
    hints: [
      'Check the critical condition first to prevent it from being swallowed by the cooling check.',
      'Check `currentTemp > setpoint + (deadband * 2)` first.'
    ],
    explanation: 'Deadband hysteresis protects electromechanical relays and compressors from rapid cycling wear and thermal shock.',
    xpReward: 65,
    functionName: 'getThermostatAction',
    testCases: [
      { inputDescription: 'getThermostatAction(55, 45, 2)', args: [55, 45, 2], expected: 'CRITICAL_ALARM', explanation: '55 > 45 + 4 (49) -> CRITICAL_ALARM' },
      { inputDescription: 'getThermostatAction(48, 45, 2)', args: [48, 45, 2], expected: 'COOLING_ON', explanation: '48 >= 47 -> COOLING_ON' },
      { inputDescription: 'getThermostatAction(42, 45, 2)', args: [42, 45, 2], expected: 'COOLING_OFF', explanation: '42 <= 43 -> COOLING_OFF' },
      { inputDescription: 'getThermostatAction(45.5, 45, 2)', args: [45.5, 45, 2], expected: 'HOLD', explanation: 'Inside deadband -> HOLD' }
    ]
  },
  {
    id: 'challenge-logic-gate-calc',
    title: '4. Universal Logic Gate Evaluator',
    category: 'Digital Logic',
    difficulty: 'Intermediate',
    description: 'Calculate the output of any 2-input logic gate given its gate string type and inputs.',
    problemStatement: `Write a function \`evaluateGate(gateType, a, b)\` where:
- \`gateType\` is one of: \`"AND"\`, \`"OR"\`, \`"NOT"\`, \`"NAND"\`, \`"NOR"\`, \`"XOR"\`, \`"XNOR"\`.
- \`a\` and \`b\` are binary numbers (0 or 1). Note: for \`"NOT"\`, only use input \`a\`.
- Return the resulting binary integer: \`0\` or \`1\`.
- If an unsupported gate name is supplied, return \`-1\`.`,
    starterCode: `function evaluateGate(gateType, a, b) {
  // Normalize inputs to boolean or 0/1
  const type = (gateType || "").toUpperCase();
  const A = a ? 1 : 0;
  const B = b ? 1 : 0;

  switch (type) {
    case "AND": return (A && B) ? 1 : 0;
    case "OR": return (A || B) ? 1 : 0;
    case "NOT": return (!A) ? 1 : 0;
    case "NAND": return !(A && B) ? 1 : 0;
    case "NOR": return !(A || B) ? 1 : 0;
    case "XOR": return (A ^ B) ? 1 : 0;
    case "XNOR": return (A === B) ? 1 : 0;
    default: return -1;
  }
}`,
    solutionCode: `function evaluateGate(gateType, a, b) {
  const type = (gateType || "").toUpperCase();
  const A = a ? 1 : 0;
  const B = b ? 1 : 0;
  switch (type) {
    case "AND": return (A && B) ? 1 : 0;
    case "OR": return (A || B) ? 1 : 0;
    case "NOT": return (!A) ? 1 : 0;
    case "NAND": return !(A && B) ? 1 : 0;
    case "NOR": return !(A || B) ? 1 : 0;
    case "XOR": return (A ^ B) ? 1 : 0;
    case "XNOR": return (A === B) ? 1 : 0;
    default: return -1;
  }
}`,
    hints: [
      'XOR is true when inputs differ (A ^ B).',
      'XNOR is true when inputs are identical (A === B).'
    ],
    explanation: 'Hardware description languages like Verilog and VHDL model logic gates as primitives to synthesize ASIC and FPGA designs.',
    xpReward: 60,
    functionName: 'evaluateGate',
    testCases: [
      { inputDescription: 'evaluateGate("AND", 1, 1)', args: ['AND', 1, 1], expected: 1 },
      { inputDescription: 'evaluateGate("AND", 1, 0)', args: ['AND', 1, 0], expected: 0 },
      { inputDescription: 'evaluateGate("NAND", 1, 1)', args: ['NAND', 1, 1], expected: 0 },
      { inputDescription: 'evaluateGate("XOR", 1, 0)', args: ['XOR', 1, 0], expected: 1 },
      { inputDescription: 'evaluateGate("XNOR", 0, 0)', args: ['XNOR', 0, 0], expected: 1 },
      { inputDescription: 'evaluateGate("NOT", 0, 0)', args: ['NOT', 0, 0], expected: 1 }
    ]
  },
  {
    id: 'challenge-adc-percentage',
    title: '5. ADC Sensor to Percentage & Voltage Scaler',
    category: 'Signal Conditioning',
    difficulty: 'Intermediate',
    description: 'Convert a 10-bit raw ADC reading (0 to 1023) into calibrated voltage and mapped percentage.',
    problemStatement: `An analog sensor is connected to a 10-bit ADC with reference voltage $V_{ref} = 5.0\\text{V}$.
Write a function \`adcToTelemetry(rawAdc, vRef = 5.0)\` that returns an object:
\`{ voltage: number, percentage: number }\` where:
- \`rawAdc\` is clamped between 0 and 1023.
- \`voltage\` is rounded to 2 decimal places: \`Number(((clamped / 1023) * vRef).toFixed(2))\`.
- \`percentage\` is rounded to 1 decimal place: \`Number(((clamped / 1023) * 100).toFixed(1))\`.`,
    starterCode: `function adcToTelemetry(rawAdc, vRef = 5.0) {
  // Clamp between 0 and 1023
  const clamped = Math.max(0, Math.min(1023, rawAdc));
  const voltage = Number(((clamped / 1023) * vRef).toFixed(2));
  const percentage = Number(((clamped / 1023) * 100).toFixed(1));
  return { voltage, percentage };
}`,
    solutionCode: `function adcToTelemetry(rawAdc, vRef = 5.0) {
  const clamped = Math.max(0, Math.min(1023, rawAdc));
  const voltage = Number(((clamped / 1023) * vRef).toFixed(2));
  const percentage = Number(((clamped / 1023) * 100).toFixed(1));
  return { voltage, percentage };
}`,
    hints: [
      'Use `Math.min` and `Math.max` to clamp input between 0 and 1023.',
      'Use `Number(val.toFixed(places))` to ensure accurate numeric outputs without floating point precision noise.'
    ],
    explanation: 'Sensor calibration curves map raw quantization levels to physical engineering units like millivolts and fuel gauge percentages.',
    xpReward: 65,
    functionName: 'adcToTelemetry',
    testCases: [
      { inputDescription: 'adcToTelemetry(512, 5.0)', args: [512, 5.0], expected: { voltage: 2.50, percentage: 50.0 } },
      { inputDescription: 'adcToTelemetry(1023, 5.0)', args: [1023, 5.0], expected: { voltage: 5.00, percentage: 100.0 } },
      { inputDescription: 'adcToTelemetry(0, 3.3)', args: [0, 3.3], expected: { voltage: 0.00, percentage: 0.0 } },
      { inputDescription: 'adcToTelemetry(2000, 5.0)', args: [2000, 5.0], expected: { voltage: 5.00, percentage: 100.0 }, explanation: 'Should clamp upper bound to 1023' }
    ]
  }
];
