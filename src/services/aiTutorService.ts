import { ChatMessage } from '../types';

export interface AiTutorRequest {
  message: string;
  mode: 'beginner' | 'step-by-step' | 'troubleshoot' | 'coding';
  history: ChatMessage[];
  provider?: 'gemini' | 'chatgpt' | 'demo';
  geminiApiKey?: string;
  openaiApiKey?: string;
  apiKey?: string;
  model?: string;
  openaiModel?: string;
}

export interface AiTutorResponse {
  content: string;
  suggestedFollowUps: string[];
  isDemoMode: boolean;
}

// Format history for Gemini API: requires first message to be 'user' and roles to alternate strictly
function formatGeminiContents(history: ChatMessage[], currentMessage: string, systemPrompt: string) {
  const turns: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  
  // Filter out system and empty messages
  const validHistory = history.filter(h => h.content && h.content.trim() && h.sender !== 'system');
  
  // Find first user turn in history
  const firstUserIdx = validHistory.findIndex(h => h.sender === 'user');
  const relevantHistory = firstUserIdx >= 0 ? validHistory.slice(firstUserIdx) : [];

  for (const h of relevantHistory.slice(-4)) {
    const role: 'user' | 'model' = h.sender === 'user' ? 'user' : 'model';
    if (turns.length === 0) {
      if (role === 'user') {
        turns.push({ role: 'user', parts: [{ text: h.content }] });
      }
    } else if (turns[turns.length - 1].role !== role) {
      turns.push({ role, parts: [{ text: h.content }] });
    }
  }

  // If empty or last is not model, add current user message
  if (turns.length === 0 || turns[turns.length - 1].role === 'model') {
    turns.push({ role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent Question: ${currentMessage}` }] });
  } else {
    // Last was user, update it
    turns[turns.length - 1] = {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nStudent Question: ${currentMessage}` }]
    };
  }

  // Ensure first turn is user
  if (turns[0].role !== 'user') {
    return [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent Question: ${currentMessage}` }] }];
  }

  return turns;
}

// Built-in Knowledge Engine for comprehensive ENTC engineering topics
const KNOWLEDGE_BASE: {
  keywords: string[];
  beginner: string;
  stepByStep: string;
  troubleshoot: string;
  coding: string;
  followUps: string[];
}[] = [
  // 1. Greetings & Identity
  {
    keywords: ['hi', 'hello', 'hey', 'who are you', 'what can you do', 'help me', 'start'],
    beginner: `👋 **Hello! I am your ENTC AI Engineering Tutor & Lab Assistant.**

I'm here 24/7 to help you master **Electronics and Telecommunication Engineering**! Here is what I can do for you:

1. ⚡ **Circuit Analysis:** Explain Ohm's law, KVL/KCL, Thevenin theorems, and voltage dividers.
2. 🔲 **Digital Logic:** Break down logic gates (AND, OR, NAND, NOR, XOR), truth tables, flip-flops, and K-maps.
3. 🤖 **Microcontrollers & Arduino:** Guide you through ATmega328P, timers, ADC, PWM, and write embedded C++ code.
4. 📡 **Telecom & Signals:** Explain AM/FM/QAM modulation, Shannon capacity, Nyquist sampling, and DSP filters.
5. 🔬 **Virtual Lab Guidance:** Help you debug breadboard wiring, calculate component values, and test sensors (LM35, LDR, Ultrasonic).

You can switch my explanation persona using the chips above (**Beginner**, **Step-by-Step Derivations**, **Hardware Troubleshooting**, or **Embedded Code**). What topic would you like to explore?`,
    stepByStep: `**Overview of ENTC Learning Modules & Analytical Capabilities:**

1. **Digital Electronics:** Boolean algebra reduction, CMOS logic levels ($V_{IL}, V_{IH}, V_{OL}, V_{OH}$), synchronous state machine design.
2. **Analog Instrumentation:** Small-signal BJT/FET models, op-amp open-loop gain ($A_{OL} \\approx 10^5$), negative feedback stabilization ($A_f = \\frac{A}{1 + A\\beta}$).
3. **Telecommunication Theory:** Bandwidth efficiency (bits/sec/Hz), Shannon-Hartley limit ($C = B \\log_2(1 + \\text{SNR})$), link budget analysis.
4. **Embedded Firmware:** Bare-metal register programming, interrupt service routines (ISRs), timer prescalers.

Ask any specific formula derivation, schematic verification, or code question to begin.`,
    troubleshoot: `**Diagnostic Assistance Capabilities:**

- **Floating Logic Inputs:** Diagnosing erratic gate switching and recommending pull-up/pull-down resistor values.
- **Microcontroller Boot Failures:** Checking crystal oscillator loading caps (22pF), reset pin pull-ups (10kΩ), and power rail brownouts.
- **Sensor Telemetry Noise:** Applying RC low-pass filters and exponential moving average (EMA) firmware filtering.
- **MOSFET Heating:** Diagnosing gate threshold voltage mismatch ($V_{GS(th)}$) and PWM switching loss.`,
    coding: `\`\`\`cpp
// Arduino UNO: Diagnostic Core Online
void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println(">>> ENTC AI Engineering Assistant Online");
  Serial.println(">>> Ready to simulate, calculate, and debug firmware.");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
\`\`\``,
    followUps: [
      'How does an Ohm\'s Law LED resistor calculation work?',
      'Why is an AND gate output zero if any input is zero?',
      'How does Pulse Width Modulation (PWM) work?',
      'How does an LM35 temperature sensor interface with an ADC?'
    ]
  },

  // 2. Ohm's Law & LED Resistor Calculation
  {
    keywords: ['ohm', 'led resistor', 'resistor', 'calculate resistor', 'current', 'voltage', 'v=ir'],
    beginner: `**Ohm's Law & LED Resistor Calculation — Simple & Clear!**

**Ohm's Law** is the most fundamental equation in electronics:
$$\\mathbf{V = I \\times R}$$
- **$V$ (Voltage in Volts):** Electrical pressure pushing electrons.
- **$I$ (Current in Amperes):** Rate of electron flow.
- **$R$ (Resistance in Ohms $\\Omega$):** Friction resisting electron flow.

### Why does an LED need a resistor?
An LED has almost **zero resistance** once it starts glowing. If you connect it directly to a 5V power supply, massive current will surge through it and instantly **burn out the diode**!

A **current-limiting resistor** absorbs the excess voltage so the LED receives its safe current (usually around $15\\text{mA} - 20\\text{mA}$).

**The Formula:**
$$R = \\frac{V_{supply} - V_{forward}}{I_{LED}}$$
For example, with a 5V supply and a Red LED ($V_f = 2.0\\text{V}, I = 20\\text{mA} = 0.02\\text{A}$):
$$R = \\frac{5.0 - 2.0}{0.02} = \\frac{3.0}{0.02} = \\mathbf{150\\,\\Omega}$$
*(A standard 220Ω or 330Ω resistor is commonly used for safety).*`,
    stepByStep: `**Step-by-Step Derivation of LED Current-Limiting Resistor & Power Dissipation:**

1. **Kirchhoff's Voltage Law (KVL) around loop:**
   $$V_{CC} - V_R - V_{LED} = 0 \\implies V_R = V_{CC} - V_F$$
2. **Applying Ohm's Law to Resistor:**
   $$R = \\frac{V_R}{I_D} = \\frac{V_{CC} - V_F}{I_D}$$
3. **Worked Numerical Example:**
   - Supply: $V_{CC} = 9.0\\text{V}$
   - Blue High-Brightness LED: $V_F = 3.2\\text{V}$
   - Target Operating Current: $I_D = 18\\text{mA} = 0.018\\text{A}$
   $$R = \\frac{9.0 - 3.2}{0.018} = \\frac{5.8}{0.018} \\approx 322.2\\,\\Omega$$
   - Standard E24 resistor value to select: **$330\\,\\Omega$**.
4. **Resistor Power Rating Calculation:**
   $$P_R = I_D^2 \\times R = (0.018)^2 \\times 330 = 0.000324 \\times 330 \\approx 0.107\\text{ W}$$
   - A standard $\\frac{1}{4}\\text{W}$ ($0.25\\text{W}$) resistor is fully adequate since $0.107\\text{W} < 0.25\\text{W}$.`,
    troubleshoot: `**Troubleshooting LED & Resistor Circuits:**

1. **LED Not Turning ON:**
   - **Polarity Inversion:** LEDs are diodes; current flows only from Anode (+) to Cathode (-). The longer leg is Anode (+); the flat edge on the plastic lens denotes Cathode (-).
   - **Insufficient Voltage:** If $V_{supply} < V_F$ (e.g. attempting to power a 3.3V White LED from a 1.5V AA battery), the diode cannot reach forward conduction threshold.
2. **LED Flickering or Burning Out:**
   - Resistor value is too small, exceeding the $30\\text{mA}$ maximum absolute rating ($I_{max}$).
3. **Resistor Getting Extremely Hot:**
   - Check power dissipation: $P = \\frac{V^2}{R}$. If dropping large voltage (e.g. 24V down to 2V), use a higher wattage resistor (1W or 2W) or switch to a buck regulator or constant-current LED driver.`,
    coding: `\`\`\`cpp
// Arduino Code: Calculating dynamic LED brightness with PWM
const int LED_PIN = 9; // Connected through 220 Ohm resistor

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Linear ramp
  for (int pwm = 0; pwm <= 255; pwm += 5) {
    analogWrite(LED_PIN, pwm);
    delay(20);
  }
  delay(200);
  for (int pwm = 255; pwm >= 0; pwm -= 5) {
    analogWrite(LED_PIN, pwm);
    delay(20);
  }
}
\`\`\``,
    followUps: [
      'What are typical forward voltages (V_f) for Red, Green, Blue, and White LEDs?',
      'How does Kirchhoff\'s Voltage Law (KVL) apply to series-parallel LED arrays?',
      'Why is a constant current driver better than a simple resistor for high-power LEDs?'
    ]
  },

  // 3. Logic Gates & AND Gate
  {
    keywords: ['and gate', 'logic gate', 'or gate', 'nand', 'nor', 'xor', 'not gate', 'truth table', 'boolean'],
    beginner: `**Logic Gates Explained — The Building Blocks of Computers!**

Logic gates are microscopic electronic decision-makers that take inputs (0s and 1s) and produce a calculated output.

### The AND Gate:
Think of an AND gate like **two safety switches in series along a single power wire** to a light bulb:
- Switch A must be ON (1) **AND** Switch B must be ON (1) for electricity to flow!
- If **even one switch is open (0)**, the electrical circuit is broken, and the output is strictly 0.

### Truth Table for 2-Input AND Gate:
| Input A | Input B | Output Y ($A \\cdot B$) |
|:---:|:---:|:---:|
| 0 | 0 | **0** |
| 0 | 1 | **0** |
| 1 | 0 | **0** |
| 1 | 1 | **1** |

In Boolean Algebra: $Y = A \\cdot B$. Because any number multiplied by 0 equals 0, the output is only 1 when ALL inputs are 1!`,
    stepByStep: `**Step-by-Step Transistor Implementation of an AND Gate (CMOS):**

1. **CMOS Structure:** A CMOS AND gate consists of a **NAND gate** stage followed by a **NOT gate (Inverter)** stage.
2. **NAND Pull-Down Network:** Two N-channel MOSFETs (NMOS) in series between output node and Ground (0V).
   - If either input is 0V, that NMOS is OFF, preventing path to GND.
3. **NAND Pull-Up Network:** Two P-channel MOSFETs (PMOS) in parallel between $V_{DD}$ and output node.
   - If either input is 0V, that PMOS is ON, pulling intermediate output to $V_{DD}$ (HIGH).
4. **CMOS Inverter:** Inverts the NAND intermediate output ($Y_{NAND} = \\overline{A \\cdot B}$) to produce $Y = A \\cdot B$.
5. **Universal Gate Property:** An AND gate can be constructed purely from two NAND gates:
   $$Y = \\overline{\\overline{A \\cdot B}}$$`,
    troubleshoot: `**Troubleshooting Digital Logic Circuits on Breadboards:**

1. **Floating Inputs:** In TTL (74LSxx) or CMOS (74HCxx), never leave unused logic inputs unconnected! A floating CMOS input will drift into the linear threshold zone ($V_{DD}/2$), causing thermal shoot-through and oscillations. Connect unused inputs to $V_{CC}$ or GND.
2. **Missing Decoupling Capacitors:** Place a $0.1\\mu\\text{F}$ ceramic capacitor directly across pin 14 ($V_{CC}$) and pin 7 (GND) of the IC to eliminate voltage dips during gate switching.
3. **Logic Level Incompatibility:** A 3.3V CMOS output ($V_{OH} \\approx 3.0\\text{V}$) can drive a 5V TTL input (where $V_{IH,min} = 2.0\\text{V}$), but cannot reliably drive a 5V CMOS input (where $V_{IH,min} = 0.7 \\times 5\\text{V} = 3.5\\text{V}$). Use a logic-level shifter.`,
    coding: `\`\`\`typescript
// TypeScript: Simulating Boolean Logic Gates
export const logicGates = {
  AND: (a: number, b: number): number => a && b ? 1 : 0,
  OR:  (a: number, b: number): number => a || b ? 1 : 0,
  NOT: (a: number): number => a ? 0 : 1,
  NAND:(a: number, b: number): number => !(a && b) ? 1 : 0,
  NOR: (a: number, b: number): number => !(a || b) ? 1 : 0,
  XOR: (a: number, b: number): number => (a !== b) ? 1 : 0,
  XNOR:(a: number, b: number): number => (a === b) ? 1 : 0,
};
\`\`\``,
    followUps: [
      'Why are NAND and NOR gates called Universal Gates?',
      'How does an XOR gate compute binary addition in a Half Adder?',
      'How do Karnaugh maps (K-maps) simplify Boolean equations?'
    ]
  },

  // 4. Analog vs Digital Signals
  {
    keywords: ['analog vs digital', 'analog and digital', 'continuous vs discrete', 'analog signal', 'digital signal', 'smooth ramp'],
    beginner: `**Analog vs. Digital Signals — Made Simple!**

Imagine the difference between a smooth ramp and a staircase:
- **Analog Signals** are like a **smooth ramp**. They take on *any* continuous real voltage (e.g. 1.25V, 2.789V, 4.12V). Sound waves, sunlight, and body temperature in nature are inherently analog.
- **Digital Signals** are like a **staircase** with only two levels: **0 (LOW / 0V)** and **1 (HIGH / 5V or 3.3V)**. Computers use digital signals because 1s and 0s are extremely resistant to electrical noise and can be transmitted over long distances without distortion!

We use an **ADC (Analog-to-Digital Converter)** to translate smooth analog sensor signals into binary numbers for microcontrollers to process.`,
    stepByStep: `**Step-by-Step Signal Comparison Analysis:**

1. **Continuity of Domain:**
   - Analog: Continuous time $t \\in \\mathbb{R}$ and continuous amplitude $x(t) \\in [V_{min}, V_{max}]$.
   - Digital: Discrete time $n \\in \\mathbb{Z}$ and quantized discrete levels ($2^N$ levels for $N$-bit ADC).
2. **Noise Immunity & Degradation:**
   - Analog: Thermal noise and EMI add directly to the amplitude and cannot be separated without filtering.
   - Digital: Small noise fluctuations are ignored as long as they stay within the logic high/low noise margins ($V_{NH} = V_{OH} - V_{IH}$).
3. **Storage & Transmission:**
   - Digital data can be losslessly compressed, encrypted (AES), error-corrected (Hamming/CRC), and stored on flash memory.`,
    troubleshoot: `**Troubleshooting Signal Integrity & Noise:**

- **Symptom: Noisy ADC telemetry from analog sensor:**
  - Add a 100nF ceramic decoupling capacitor right next to the microcontroller's $AV_{CC}$ and $V_{REF}$ pins.
  - Implement an RC low-pass filter ($R = 1\\text{k}\\Omega, C = 100\\text{nF}$) to attenuate high-frequency switching noise.
  - Separate analog ground (AGND) and digital ground (DGND) on the PCB, joining them at a single star-ground point.`,
    coding: `\`\`\`cpp
// Arduino: Reading Analog Signal and Filtering Noise with Moving Average
const int SENSOR_PIN = A0;

float readFilteredSensor() {
  long sum = 0;
  for (int i = 0; i < 16; i++) {
    sum += analogRead(SENSOR_PIN);
    delayMicroseconds(200);
  }
  return sum / 16.0; // 16-sample averaged reading
}
\`\`\``,
    followUps: [
      'How does an ADC determine its sampling resolution and quantization error?',
      'Why is digital modulation (QAM/PSK) preferred over analog AM/FM in modern telecom?',
      'How does an anti-aliasing filter satisfy the Nyquist-Shannon sampling theorem?'
    ]
  },

  // 5. Pulse Width Modulation (PWM)
  {
    keywords: ['pwm', 'pulse width modulation', 'duty cycle', 'dimming', 'analogwrite'],
    beginner: `**What is Pulse Width Modulation (PWM)?**

Microcontrollers can only output **0V (OFF)** or **5V (ON)**—they cannot natively output 2.5V!

So how does a microcontroller dim an LED or control motor speed?
By switching 5V ON and OFF **thousands of times per second**!
- If the signal is ON for 50% of the time and OFF for 50% of the time, the average voltage is:
  $$50\\% \\times 5\\text{V} = 2.5\\text{V}$$
- The percentage of time the pulse is ON during each cycle is called the **Duty Cycle**.
- Because this switches so fast (e.g. 1000 Hz), our human eyes or mechanical motor coils only experience the smooth average voltage!`,
    stepByStep: `**Step-by-Step PWM Mathematical Formulation:**

1. **Time Period ($T$):** Total duration of one pulse cycle:
   $$T = T_{on} + T_{off} = \\frac{1}{f}$$
2. **Duty Cycle ($D$):**
   $$D = \\frac{T_{on}}{T} \\times 100\\%$$
3. **Average Voltage Output:**
   $$V_{avg} = D \\times V_{cc} = \\frac{T_{on}}{T} \\times V_{cc}$$
4. **Arduino Mapping (8-bit Timer):**
   - The value passed to \`analogWrite(pin, val)\` ranges from 0 to 255 ($2^8 - 1$).
   - Duty cycle: $D = \\frac{\\text{val}}{255}$.
   - For $\\text{val} = 128$: $V_{avg} = \\frac{128}{255} \\times 5.0\\text{V} \\approx 2.51\\text{V}$.`,
    troubleshoot: `**Troubleshooting PWM Circuits:**

- **Audible Motor Whine:** If PWM frequency is in the audible human spectrum (20Hz - 20kHz, e.g. default Arduino 490Hz), motor windings vibrate acoustically. Solution: Change timer prescaler registers (e.g. TCCR1B) to shift PWM to 31kHz (ultrasonic).
- **MOSFET Overheating:** If a power transistor gets burning hot during PWM, it is spending too much time in the linear region. Use a dedicated gate driver IC (e.g. TC4420) to charge gate capacitance rapidly (<50ns).`,
    coding: `\`\`\`cpp
// Arduino Code: Motor Speed Control with PWM Pin 9
const int MOTOR_PWM_PIN = 9;

void setup() {
  pinMode(MOTOR_PWM_PIN, OUTPUT);
}

void setMotorSpeedPercentage(int percent) {
  percent = constrain(percent, 0, 100);
  int pwmValue = map(percent, 0, 100, 0, 255);
  analogWrite(MOTOR_PWM_PIN, pwmValue);
}
\`\`\``,
    followUps: [
      'How do I calculate an RC filter to convert PWM into a ripple-free DC voltage?',
      'What is the difference between Fast PWM and Phase-Correct PWM on AVR timers?',
      'Why is PWM used in Class-D audio amplifiers and switch-mode power supplies (SMPS)?'
    ]
  },

  // 6. Op-Amps (Operational Amplifiers)
  {
    keywords: ['op-amp', 'opamp', 'operational amplifier', 'inverting', 'non-inverting', 'comparator', 'virtual ground'],
    beginner: `**What is an Operational Amplifier (Op-Amp)?**

An **Op-Amp** (like the famous LM741 or LM358) is a voltage amplifier with enormous amplification power (gain $> 100,000$!).

It has two inputs:
1. **Non-Inverting Input (+):** Output goes in the same direction.
2. **Inverting Input (-):** Output goes in the opposite direction.

### Two Golden Rules of Ideal Op-Amps with Negative Feedback:
1. **Rule 1:** No current flows into either input pin ($I_+ = I_- = 0$, infinite input impedance).
2. **Rule 2:** The op-amp adjusts its output to force the two inputs to have the exact same voltage ($V_+ = V_-$, Virtual Short)!`,
    stepByStep: `**Step-by-Step Derivation of Inverting & Non-Inverting Op-Amp Gain:**

1. **Inverting Amplifier Configuration:**
   - Input $V_{in}$ connected to inverting terminal (-) through $R_1$.
   - Feedback resistor $R_f$ connects output $V_{out}$ back to inverting terminal (-).
   - Non-inverting terminal (+) is tied to Ground ($V_+ = 0\\text{V}$).
   - By Golden Rule 2: $V_- = V_+ = 0\\text{V}$ (Virtual Ground).
   - Current through $R_1$: $I = \\frac{V_{in} - 0}{R_1}$.
   - Current through $R_f$: $I = \\frac{0 - V_{out}}{R_f}$.
   - Since no current enters op-amp: $\\frac{V_{in}}{R_1} = -\\frac{V_{out}}{R_f} \\implies \\mathbf{A_v = \\frac{V_{out}}{V_{in}} = -\\frac{R_f}{R_1}}$.

2. **Non-Inverting Amplifier Configuration:**
   - Input $V_{in}$ connected directly to non-inverting terminal (+).
   - Voltage divider $R_1, R_f$ feeds output back to inverting terminal (-):
     $$V_- = V_{out} \\left( \\frac{R_1}{R_1 + R_f} \\right) = V_{in}$$
   - Solving for gain: $\\mathbf{A_v = \\frac{V_{out}}{V_{in}} = 1 + \\frac{R_f}{R_1}}$.`,
    troubleshoot: `**Troubleshooting Op-Amp Circuits:**

- **Output Stuck at Power Rail ($+V_{CC}$ or $-V_{EE}$):**
  - Missing negative feedback: op-amp is saturated as an open-loop comparator.
  - Inputs swapped: positive feedback causes latch-up.
- **Single-Supply Clipping:** A standard LM741 requires dual supply (e.g. $\\pm 12\\text{V}$). If powered from single +5V and GND, negative signal swings will clip at ground. Use a rail-to-rail single-supply op-amp like LM358 or MCP6002.`,
    coding: `\`\`\`cpp
// Arduino Code: Reading Amplified Sensor Voltage from Op-Amp
const int OPAMP_ANALOG_PIN = A0;
const float OPAMP_GAIN = 11.0; // Non-inverting gain: 1 + (100k / 10k)

float getTrueSensorVoltage() {
  int raw = analogRead(OPAMP_ANALOG_PIN);
  float measuredV = (raw * 5.0) / 1023.0;
  // Divide by op-amp gain to recover pre-amplified sensor microvolts
  return (measuredV / OPAMP_GAIN);
}
\`\`\``,
    followUps: [
      'What is an Instrumentation Amplifier (e.g. AD620) and why does it have high CMRR?',
      'How does an active Sallen-Key low-pass filter work?',
      'What causes Op-Amp input offset voltage and how is it nulled?'
    ]
  },

  // 7. Transistors (BJT & MOSFET)
  {
    keywords: ['transistor', 'bjt', 'mosfet', 'npn', 'pnp', 'saturation', 'cutoff', 'gate', 'drain', 'source'],
    beginner: `**How Transistors Work — The Switch That Built Modern Tech!**

Think of a transistor like an **electrically controlled water tap**:
- A small trickle of current or voltage at the control terminal (**Base** in BJT, **Gate** in MOSFET) opens the valve to let a huge flow of electrical current pass between the other two terminals (**Collector-Emitter** in BJT, **Drain-Source** in MOSFET).

### Two Main Types:
1. **BJT (Bipolar Junction Transistor, e.g. 2N2222):** Controlled by **Current** at the Base ($I_C = \\beta \\cdot I_B$).
2. **MOSFET (Field-Effect Transistor, e.g. IRLZ44N):** Controlled by **Voltage** at the Gate ($V_{GS}$). MOSFETs consume almost zero control current and are vastly more efficient for high-power switching!`,
    stepByStep: `**Step-by-Step BJT Switch Design Calculations:**

1. **Load Current ($I_C$):** For a 12V relay drawing $100\\text{mA}$:
   $$I_C = 0.10\\text{A}$$
2. **Determine Base Current for Saturation ($I_B$):**
   - For reliable hard saturation (acting as a closed switch with $V_{CE(sat)} \\approx 0.2\\text{V}$), use a saturation overdrive factor of 10:
     $$I_B = \\frac{I_C}{10} = \\frac{100\\text{mA}}{10} = 10\\text{mA}$$
3. **Calculate Base Resistor ($R_B$) from Microcontroller (5V GPIO):**
   $$V_{GPIO} - V_{BE} - (I_B \\times R_B) = 0$$
   $$R_B = \\frac{5.0\\text{V} - 0.7\\text{V}}{0.010\\text{A}} = \\frac{4.3}{0.010} = \\mathbf{430\\,\\Omega}$$
   - Select standard **$470\\,\\Omega$** or **$390\\,\\Omega$** resistor.`,
    troubleshoot: `**Troubleshooting Transistor Switching:**

- **MOSFET Heating Up in Arduino Projects:**
  - Standard power MOSFETs (like IRF540N) require $V_{GS} = 10\\text{V}$ to fully turn ON. When triggered from a 5V or 3.3V microcontroller, they remain in the semi-conductive linear region, developing high resistance ($R_{DS(on)}$) and overheating.
  - Solution: Use **Logic-Level MOSFETs** (part numbers starting with 'L', like **IRLZ44N** or **FQP30N06L**).
- **Inductive Kickback Destruction:** When driving inductive loads (motors, solenoids, relays), collapsing magnetic fields generate hundreds of volts of reverse EMF ($V = -L \\frac{di}{dt}$). Always place a flyback diode (1N4007 or 1N5819) across the load!`,
    coding: `\`\`\`cpp
// Arduino Code: Controlling high-power DC motor via Logic-Level MOSFET
const int MOSFET_GATE_PIN = 3;

void setup() {
  pinMode(MOSFET_GATE_PIN, OUTPUT);
}

void loop() {
  digitalWrite(MOSFET_GATE_PIN, HIGH); // Turn relay/motor ON
  delay(3000);
  digitalWrite(MOSFET_GATE_PIN, LOW);  // Turn relay/motor OFF
  delay(3000);
}
\`\`\``,
    followUps: [
      'What is the difference between Enhancement-mode and Depletion-mode MOSFETs?',
      'How does an H-Bridge circuit allow bidirectional motor control?',
      'What is Early Effect in BJTs and Channel Length Modulation in MOSFETs?'
    ]
  },

  // 8. Serial Communication: UART, I2C, SPI
  {
    keywords: ['uart', 'i2c', 'spi', 'serial', 'communication', 'baud rate', 'sda', 'scl', 'miso', 'mosi'],
    beginner: `**Microcontroller Communication Protocols Compared:**

When chips talk to sensors, screens, or other microcontrollers, they use one of three standard serial protocols:

1. **UART (Serial):**
   - **Wires:** 2 wires (TX = Transmit, RX = Receive).
   - **How it works:** Point-to-point asynchronous connection (e.g. Arduino Serial Monitor, GPS modules). No shared clock line—both devices must agree on the speed (**Baud Rate**, e.g. 9600 or 115200).
2. **I2C (Inter-Integrated Circuit):**
   - **Wires:** Only 2 wires (SDA = Data, SCL = Clock) + pull-up resistors.
   - **How it works:** Multi-device bus where up to 127 sensors share the same 2 wires! Each sensor has its own unique 7-bit digital address (e.g. OLED display = 0x3C).
3. **SPI (Serial Peripheral Interface):**
   - **Wires:** 4 wires (MOSI, MISO, SCK, CS/SS).
   - **How it works:** Ultra-fast synchronous bus (10 - 50 MHz!) ideal for SD card storage, TFT color screens, and high-speed ADCs.`,
    stepByStep: `**Direct Technical Comparison:**

| Feature | UART | I2C (Two-Wire) | SPI (Four-Wire) |
|---|---|---|---|
| **Clocking** | Asynchronous (No clock wire) | Synchronous (SCL clock) | Synchronous (SCK clock) |
| **Speed** | Up to 1 Mbps | 100 kHz (Std), 400 kHz (Fast) | 10 Mbps - 80+ Mbps |
| **Number of Devices** | 2 devices (Peer-to-peer) | Up to 127 devices on 2 wires | 1 Master to multiple Slaves (1 CS pin per slave) |
| **Complexity** | Simple | Medium (ACK/NACK packets) | Simple protocol, high pin count |
| **Hardware Overhead** | Minimal | Requires $4.7\\text{k}\\Omega$ pull-up resistors | Requires separate Chip Select pin per peripheral |`,
    troubleshoot: `**Troubleshooting Embedded Communication:**

- **I2C Sensor Not Detected (\`Wire.endTransmission()\` returns error 2):**
  - Missing pull-up resistors: I2C lines are open-drain and strictly require $4.7\\text{k}\\Omega$ resistors between SDA/SCL and +3.3V/5V.
  - Address mismatch: Run an I2C scanner sketch to discover the true 7-bit peripheral address.
- **SPI SD Card Read Failure:**
  - SPI lines exceeding 15cm on breadboards suffer capacitance ringing. Reduce SPI clock divider to \`SPI_CLOCK_DIV4\` or \`SPI_CLOCK_DIV8\`.`,
    coding: `\`\`\`cpp
// Arduino Code: I2C Bus Address Scanner
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(115200);
  Serial.println("\n--- Scanning I2C Bus for Devices ---");
  
  int devicesFound = 0;
  for (byte address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    if (Wire.endTransmission() == 0) {
      Serial.print("Found I2C device at 7-bit address: 0x");
      if (address < 16) Serial.print("0");
      Serial.println(address, HEX);
      devicesFound++;
    }
  }
  Serial.print("Done. Total devices found: ");
  Serial.println(devicesFound);
}

void loop() {}
\`\`\``,
    followUps: [
      'How does I2C clock stretching work when a slave is busy processing?',
      'What are the 4 SPI clock modes (CPOL and CPHA)?',
      'How does UART framing use Start, Stop, and Parity bits for error detection?'
    ]
  }
];

// Fallback general response generator for any ENTC engineering query
function generateDemoResponse(prompt: string, mode: string): { content: string; followUps: string[] } {
  const p = prompt.toLowerCase();

  // 1. Search knowledge base
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(k => p.includes(k))) {
      let content = entry.beginner;
      if (mode === 'step-by-step') content = entry.stepByStep;
      else if (mode === 'troubleshoot') content = entry.troubleshoot;
      else if (mode === 'coding') content = entry.coding;
      return { content, followUps: entry.followUps };
    }
  }

  // 2. Intelligent dynamic engineering analysis for any other prompt
  const topicTitle = prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt;

  let explanation = '';
  let formula = '';
  let practical = '';
  let codeSnippet = '';

  if (p.includes('code') || p.includes('program') || p.includes('arduino') || p.includes('sketch') || mode === 'coding') {
    explanation = `To implement **"${topicTitle}"** in embedded firmware, we configure the hardware timers, GPIO registers, and serial telemetry loop.`;
    formula = `$$\\text{Sampling Rate } f_s \\ge 2 \\times f_{max} \\quad \\text{and} \\quad \\text{ADC Count} = \\frac{V_{in}}{V_{ref}} \\times (2^N - 1)$$`;
    practical = `- Ensure hardware debounce on digital inputs (10kΩ pull-up with 100nF filter).\n- Use non-blocking \`millis()\` timing instead of blocking \`delay()\`.`;
    codeSnippet = `\`\`\`cpp
// Arduino Implementation: ${topicTitle}
const int SENSOR_PIN = A0;
const int ACTUATOR_PIN = 9;

void setup() {
  Serial.begin(115200);
  pinMode(ACTUATOR_PIN, OUTPUT);
  Serial.println("System Initialized for: ${topicTitle}");
}

void loop() {
  int sensorRaw = analogRead(SENSOR_PIN);
  float voltage = (sensorRaw * 5.0) / 1023.0;
  
  Serial.print("Telemetry Voltage: ");
  Serial.print(voltage, 2);
  Serial.println(" V");
  
  // Dynamic output response
  if (voltage > 2.5) {
    digitalWrite(ACTUATOR_PIN, HIGH);
  } else {
    digitalWrite(ACTUATOR_PIN, LOW);
  }
  delay(250);
}
\`\`\``;
  } else if (mode === 'step-by-step' || p.includes('derive') || p.includes('formula') || p.includes('math')) {
    explanation = `Here is the formal step-by-step mathematical derivation and physical model for **"${topicTitle}"**:`;
    formula = `1. **Governing Differential Equation:**
   $$L \\frac{di(t)}{dt} + R i(t) + \\frac{1}{C} \\int i(t) dt = v(t)$$
2. **Frequency Domain Transfer Function (Laplace Transform):**
   $$H(s) = \\frac{Y(s)}{X(s)} = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}$$
3. **Resonant Frequency & Quality Factor:**
   $$\\omega_0 = \\frac{1}{\\sqrt{LC}}, \\qquad Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}$$`;
    practical = `- **Stability Criterion:** Poles must reside strictly in the left half of the s-plane ($\text{Re}(s) < 0$).\n- **Bode Phase Margin:** Must exceed $45^{\circ}$ for transient damping.`;
    codeSnippet = `\`\`\`python
# Python Analysis: Computing Frequency Response & Bode Margin
import numpy as np

frequencies = np.logspace(1, 6, 500)
omega = 2 * np.pi * frequencies
R, L, C = 100, 10e-3, 100e-9 # 100 Ohm, 10mH, 100nF
Z = R + 1j * omega * L + 1 / (1j * omega * C)
print(f"Resonant Freq: {1 / (2 * np.pi * np.sqrt(L * C)):.1f} Hz")
\`\`\``;
  } else if (mode === 'troubleshoot' || p.includes('error') || p.includes('bug') || p.includes('not working') || p.includes('fix')) {
    explanation = `Here is the comprehensive hardware and firmware diagnostic procedure for **"${topicTitle}"**:`;
    formula = `$$\\text{Thermal Dissipation: } P_D = I_{RMS}^2 \\times R_{ON} + V_{in} \\times I_Q$$`;
    practical = `1. **Voltage Rail Verification:** Measure $V_{CC}$ with a digital multimeter under load to verify voltage isn't drooping.
2. **Ground Bounce & Floating Pins:** Connect oscilloscope ground clip directly to the nearest decoupling ground; check that unused pins are not floating.
3. **Electromagnetic Interference (EMI):** Place $0.1\\mu\\text{F}$ bypass ceramic capacitors within 5mm of IC power pins.`;
    codeSnippet = `\`\`\`cpp
// Diagnostic Watchdog & Self-Test Routine
void runHardwareDiagnostics() {
  Serial.println("[DIAGNOSTIC] Running Power Rail & Pin Sanity Check...");
  // Read internal reference bandgap
  int vccAdc = analogRead(A0);
  Serial.print("[DIAGNOSTIC] Voltage Rail ADC Count: ");
  Serial.println(vccAdc);
}
\`\`\``;
  } else {
    // Beginner analogy mode
    explanation = `**Understanding "${topicTitle}" — The Intuitive Model!**

In Electronics and Telecommunication, systems operate by translating physical signals into electrical flow. Think of this concept in terms of energy flow:
- Electrical pressure (**Voltage**) pushes charge carriers (**Current**) through functional components (resistors, switches, amplifiers, or microcontrollers).
- In the digital world, signals are clean 1s and 0s to reject noise. In the analog world, signals are smooth continuous waves.`;
    formula = `$$\\text{Key Formula: } V = I \\cdot R \\qquad \\text{and} \\qquad P = V \\cdot I$$`;
    practical = `**Core Principles:**
- Always provide common ground (GND) across all modules in your circuit.
- Use current-limiting resistors to protect low-power semiconductor junctions.`;
    codeSnippet = `\`\`\`cpp
// Basic Getting Started Example
void setup() {
  Serial.begin(9600);
  Serial.println("Ready to experiment with: ${topicTitle}");
}
void loop() {
  delay(1000);
}
\`\`\``;
  }

  const content = `### ENTC Engineering Analysis: ${topicTitle}

${explanation}

${formula}

${practical}

${codeSnippet}

*(You can enter your Google Gemini or OpenAI ChatGPT API key in the top bar to enable live LLM reasoning across custom datasheets.)*`;

  return {
    content,
    followUps: [
      'How do I calculate resistor and capacitor values for this circuit?',
      'What are common hardware debugging pitfalls for this component?',
      'Can you show me the full Arduino C++ code for this setup?',
      'Explain the difference between analog and digital signals.'
    ]
  };
}

export const aiTutorService = {
  async sendMessage(request: AiTutorRequest): Promise<AiTutorResponse> {
    const {
      message,
      mode,
      provider = 'demo',
      geminiApiKey,
      openaiApiKey,
      apiKey,
      model = 'gemini-1.5-flash',
      openaiModel = 'gpt-4o-mini',
      history = []
    } = request;

    const systemPrompt = `You are the ENTC Innovate Lab AI Tutor, an inspiring professor and senior hardware/telecom engineer.
Provide technically accurate, educational, clear, and structured answers in markdown.
Mode: ${mode}.
- beginner: use intuitive real-world analogies.
- step-by-step: give numbered derivations and formulas.
- troubleshoot: diagnose hardware bugs, floating pins, noise, thermal limits.
- coding: write clean, commented C++/Arduino or Python code.`;

    // 1. OpenAI ChatGPT provider (only if user explicitly selected chatgpt AND provided a key)
    const activeOpenAiKey = (openaiApiKey || (provider === 'chatgpt' ? apiKey : '') || '').trim();
    if (provider === 'chatgpt' && activeOpenAiKey.length > 5) {
      try {
        const chatMessages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-4).map(h => ({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.content
          })),
          { role: 'user', content: message }
        ];

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeOpenAiKey}`
          },
          body: JSON.stringify({
            model: openaiModel || 'gpt-4o-mini',
            messages: chatMessages,
            temperature: 0.3,
            max_tokens: 1200
          })
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data?.choices?.[0]?.message?.content;
          if (replyText) {
            return {
              content: replyText,
              suggestedFollowUps: [
                'Can you provide a practical circuit schematic for this?',
                'What are common hardware debugging pitfalls?',
                'Show me the Arduino implementation code.'
              ],
              isDemoMode: false
            };
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData?.error?.message || `HTTP ${res.status}`;
          console.warn('OpenAI API Error:', errMsg);
          const fallback = generateDemoResponse(message, mode);
          return {
            content: `> [!WARNING]
> **OpenAI API Notice:** (${errMsg}). Switched to built-in ENTC AI Engine:

${fallback.content}`,
            suggestedFollowUps: fallback.followUps,
            isDemoMode: true
          };
        }
      } catch (err: any) {
        console.error('Error invoking OpenAI API:', err);
        const fallback = generateDemoResponse(message, mode);
        return {
          content: fallback.content,
          suggestedFollowUps: fallback.followUps,
          isDemoMode: true
        };
      }
    }

    // 2. Google Gemini provider (only if user provided a key)
    const activeGeminiKey = (geminiApiKey || (provider === 'gemini' ? apiKey : '') || '').trim();
    if ((provider === 'gemini' || activeGeminiKey.length > 10) && activeGeminiKey.length > 10) {
      try {
        // Resolve safe model name
        const cleanModel = model.includes('2.0') ? 'gemini-1.5-flash' : model;
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${activeGeminiKey}`;
        
        // Use sanitized contents array guaranteed to start with 'user'
        const contents = formatGeminiContents(history, message, systemPrompt);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1200
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return {
              content: replyText,
              suggestedFollowUps: [
                'Can you provide a practical circuit schematic for this?',
                'What are common hardware debugging pitfalls?',
                'Show me the mathematical derivation.'
              ],
              isDemoMode: false
            };
          }
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.warn('Gemini API error:', errorData);
          const fallback = generateDemoResponse(message, mode);
          return {
            content: `> [!WARNING]
> **Gemini API Notice:** (${errorData?.error?.message || `Status ${res.status}`}). Switched to built-in ENTC AI Engine:

${fallback.content}`,
            suggestedFollowUps: fallback.followUps,
            isDemoMode: true
          };
        }
      } catch (err: any) {
        console.error('Error invoking Gemini API:', err);
        const fallback = generateDemoResponse(message, mode);
        return {
          content: fallback.content,
          suggestedFollowUps: fallback.followUps,
          isDemoMode: true
        };
      }
    }

    // 3. Built-in High-Quality Educational ENTC Knowledge Engine (Default / No key needed)
    await new Promise(r => setTimeout(r, 350));
    const demo = generateDemoResponse(message, mode);
    return {
      content: demo.content,
      suggestedFollowUps: demo.followUps,
      isDemoMode: true
    };
  }
};
