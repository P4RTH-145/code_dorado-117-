import { CodingChallenge } from '../types';

export const challengesData: CodingChallenge[] = [
  {
    id: 'challenge-blink-led',
    title: 'Toggle LED State (Blink Control)',
    difficulty: 'Beginner',
    category: 'Embedded Systems',
    description: 'Implement a function that simulates toggling the digital state of an LED on each clock cycle based on an enable flag and current state.',
    problemStatement: `In microcontroller firmware, GPIO pins can be flipped using bitwise XOR operations or simple condition checks.

Write a function \`toggleLED(currentState, isEnabled)\`:
- \`currentState\` is a boolean or number (1 for ON, 0 for OFF).
- \`isEnabled\` is a boolean indicating if blinking is active.
- If \`isEnabled\` is true, return the opposite state (1 if current is 0, or 0 if current is 1).
- If \`isEnabled\` is false, the LED state must remain unchanged.`,
    functionName: 'toggleLED',
    params: ['currentState', 'isEnabled'],
    starterCode: `function toggleLED(currentState, isEnabled) {
  // Return the new LED state (1 or 0)
  if (!isEnabled) {
    return currentState ? 1 : 0;
  }
  return currentState ? 0 : 1;
}`,
    testCases: [
      { id: 1, name: 'Toggle from OFF when enabled', input: [0, true], expected: 1 },
      { id: 2, name: 'Toggle from ON when enabled', input: [1, true], expected: 0 },
      { id: 3, name: 'Stay OFF when disabled', input: [0, false], expected: 0 },
      { id: 4, name: 'Stay ON when disabled', input: [1, false], expected: 1 }
    ],
    points: 50,
    hints: [
      'Check if isEnabled is false first. If so, return the normalized currentState (1 or 0).',
      'Use the logical NOT operator (!) or ternary expression: currentState ? 0 : 1.'
    ],
    solutionExplanation: 'When enabled, toggling can simply be evaluated as: return isEnabled ? (currentState ? 0 : 1) : (currentState ? 1 : 0).'
  },
  {
    id: 'challenge-digital-switch',
    title: 'Read Digital Switch with Debounce',
    difficulty: 'Beginner',
    category: 'Embedded Systems',
    description: 'Determine the stable switch state after filtering rapid mechanical contact bounces.',
    problemStatement: `Mechanical pushbuttons bounce repeatedly between 0 and 1 for 5-20 milliseconds before settling.

Write a function \`readSwitchState(samples)\`:
- \`samples\` is an array of binary readings (e.g., [1, 0, 1, 1, 1, 1]).
- If more than 60% of the sample readings are 1, declare the switch as pressed (return 1).
- Otherwise, return 0.`,
    functionName: 'readSwitchState',
    params: ['samples'],
    starterCode: `function readSwitchState(samples) {
  if (!samples || samples.length === 0) return 0;
  // Calculate the fraction of HIGH (1) samples
  const ones = samples.filter(s => s === 1).length;
  return (ones / samples.length > 0.6) ? 1 : 0;
}`,
    testCases: [
      { id: 1, name: 'Clean pressed state', input: [[1, 1, 1, 1, 1]], expected: 1 },
      { id: 2, name: 'Bouncing but predominantly pressed', input: [[0, 1, 1, 0, 1, 1, 1]], expected: 1 },
      { id: 3, name: 'Clean unpressed state', input: [[0, 0, 0, 0]], expected: 0 },
      { id: 4, name: 'Minor noise pulse', input: [[0, 1, 0, 0, 0]], expected: 0 }
    ],
    points: 75,
    hints: [
      'Count the number of 1s in the array using array.filter() or a simple loop.',
      'Divide by samples.length and compare against 0.6.'
    ],
    solutionExplanation: 'Software debounce through majority sampling is standard in embedded C to avoid false triggering from contact chatter.'
  },
  {
    id: 'challenge-temp-led-threshold',
    title: 'Thermal Warning Trigger',
    difficulty: 'Intermediate',
    category: 'Sensors & Instrumentation',
    description: 'Activate safety cooling fans and warning LEDs based on live thermistor telemetry.',
    problemStatement: `An industrial motor controller monitors its heatsink temperature. 

Write a function \`evaluateThermalSafety(currentTemp, warningThreshold, criticalThreshold)\`:
- Return \`"NORMAL"\` if \`currentTemp < warningThreshold\`.
- Return \`"FAN_ON"\` if \`currentTemp >= warningThreshold\` AND \`currentTemp < criticalThreshold\`.
- Return \`"EMERGENCY_SHUTDOWN"\` if \`currentTemp >= criticalThreshold\`.`,
    functionName: 'evaluateThermalSafety',
    params: ['currentTemp', 'warningThreshold', 'criticalThreshold'],
    starterCode: `function evaluateThermalSafety(currentTemp, warningThreshold, criticalThreshold) {
  // Your safety logic here
  if (currentTemp >= criticalThreshold) {
    return "EMERGENCY_SHUTDOWN";
  }
  if (currentTemp >= warningThreshold) {
    return "FAN_ON";
  }
  return "NORMAL";
}`,
    testCases: [
      { id: 1, name: 'Safe ambient operation', input: [42, 60, 85], expected: 'NORMAL' },
      { id: 2, name: 'Warning threshold reached', input: [60, 60, 85], expected: 'FAN_ON' },
      { id: 3, name: 'Elevated temperature cooling', input: [75, 60, 85], expected: 'FAN_ON' },
      { id: 4, name: 'Critical thermal limit exceeded', input: [88, 60, 85], expected: 'EMERGENCY_SHUTDOWN' }
    ],
    points: 100,
    hints: [
      'Evaluate the most severe condition (criticalThreshold) first.',
      'Check string spelling matches: "NORMAL", "FAN_ON", "EMERGENCY_SHUTDOWN".'
    ],
    solutionExplanation: 'Checking the critical limit first simplifies the conditional branching and guarantees immediate safety shutdown.'
  },
  {
    id: 'challenge-logic-evaluator',
    title: 'Combinational Logic Gate Evaluator',
    difficulty: 'Intermediate',
    category: 'Digital Electronics',
    description: 'Build a software emulator for elementary 2-input logic gates.',
    problemStatement: `Simulate the behavior of fundamental digital CMOS gates.

Write a function \`evaluateGate(gateType, a, b)\`:
- \`gateType\` is one of: \`"AND"\`, \`"OR"\`, \`"NAND"\`, \`"NOR"\`, \`"XOR"\`, \`"XNOR"\`.
- \`a\` and \`b\` are binary numbers (0 or 1).
- Return the resulting binary output as 1 or 0.`,
    functionName: 'evaluateGate',
    params: ['gateType', 'a', 'b'],
    starterCode: `function evaluateGate(gateType, a, b) {
  switch (gateType.toUpperCase()) {
    case 'AND': return (a && b) ? 1 : 0;
    case 'OR':  return (a || b) ? 1 : 0;
    case 'NAND': return !(a && b) ? 1 : 0;
    case 'NOR':  return !(a || b) ? 1 : 0;
    case 'XOR':  return (a !== b) ? 1 : 0;
    case 'XNOR': return (a === b) ? 1 : 0;
    default: return 0;
  }
}`,
    testCases: [
      { id: 1, name: 'AND(1, 0)', input: ['AND', 1, 0], expected: 0 },
      { id: 2, name: 'NAND(1, 1)', input: ['NAND', 1, 1], expected: 0 },
      { id: 3, name: 'XOR(1, 0)', input: ['XOR', 1, 0], expected: 1 },
      { id: 4, name: 'XNOR(0, 0)', input: ['XNOR', 0, 0], expected: 1 },
      { id: 5, name: 'NOR(0, 0)', input: ['NOR', 0, 0], expected: 1 }
    ],
    points: 120,
    hints: [
      'Use a switch statement or object mapping for clean gate routing.',
      'XOR is true when a !== b, and XNOR is true when a === b.'
    ],
    solutionExplanation: 'A switch or lookup table correctly models digital hardware lookup tables (LUTs) used inside FPGAs.'
  },
  {
    id: 'challenge-adc-percentage',
    title: 'Analog Sensor Reading to Percentage',
    difficulty: 'Beginner',
    category: 'Sensors & Instrumentation',
    description: 'Scale raw 10-bit or 12-bit ADC integer values into human-readable engineering percentage values.',
    problemStatement: `Microcontroller ADCs return raw integer values (e.g. 0 to 1023 for 10-bit).

Write a function \`scaleADCToPercent(rawValue, bitResolution)\`:
- \`rawValue\` is the measured ADC integer (e.g., 512).
- \`bitResolution\` is the number of bits (e.g., 10 for 10-bit ADC, or 12 for 12-bit ADC).
- Calculate maximum possible counts: \`maxCount = (2 ** bitResolution) - 1\`.
- Clamp rawValue between 0 and maxCount.
- Return the percentage rounded to 1 decimal place (e.g., 50.0).`,
    functionName: 'scaleADCToPercent',
    params: ['rawValue', 'bitResolution'],
    starterCode: `function scaleADCToPercent(rawValue, bitResolution) {
  const maxCount = Math.pow(2, bitResolution) - 1;
  const clamped = Math.max(0, Math.min(rawValue, maxCount));
  const percent = (clamped / maxCount) * 100;
  return Number(percent.toFixed(1));
}`,
    testCases: [
      { id: 1, name: 'Midpoint of 10-bit (511.5 counts)', input: [511, 10], expected: 49.9 },
      { id: 2, name: 'Full scale 10-bit (1023 counts)', input: [1023, 10], expected: 100.0 },
      { id: 3, name: 'Zero scale', input: [0, 10], expected: 0.0 },
      { id: 4, name: '12-bit midpoint (2047 counts)', input: [2047, 12], expected: 50.0 }
    ],
    points: 90,
    hints: [
      'Calculate max count with Math.pow(2, bitResolution) - 1.',
      'Clamp the value and use .toFixed(1) to round to one decimal place, then convert back to Number.'
    ],
    solutionExplanation: 'Analog scaling is one of the most common firmware routines in embedded engineering for telemetry displays.'
  }
];
