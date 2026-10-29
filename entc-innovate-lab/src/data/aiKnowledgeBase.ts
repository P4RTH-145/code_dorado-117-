import { AIMode } from '../types';

export interface PredefinedResponse {
  queryMatch: string[];
  beginner: string;
  stepByStep: string;
  troubleshoot: string;
  coding: string;
}

export const suggestedQuestions = [
  'Explain the difference between analog and digital signals.',
  'Why does an AND gate output zero if one input is zero?',
  'Explain PWM with a practical example.',
  'How does a temperature sensor work?',
  'Help me debug this Arduino temperature-monitoring code.',
  'What is the Nyquist rate in signal sampling?',
  'What is the difference between I2C and SPI protocols?'
];

export const knowledgeBase: PredefinedResponse[] = [
  {
    queryMatch: ['analog', 'digital', 'difference between analog'],
    beginner: `### 🌊 Analog vs ⚡ Digital Signals: Explained Simply

Think of the difference like a **ramp** versus a **staircase**:

1. **Analog Signal (The Ramp)**:
   - Continuously varies across an infinite number of values.
   - Example: Natural human voice, room temperature, mercury thermometer.
   - Weakness: Sensitive to noise. Even slight static alters the waveform shape.

2. **Digital Signal (The Staircase)**:
   - Jumps between discrete voltage levels (typically just two: **0V = Low = Binary 0** and **3.3V/5V = High = Binary 1**).
   - Example: Computers, USB cables, digital logic gates.
   - Strength: Extremely noise-tolerant! Even if voltage fluctuates from 4.8V to 5.1V, the chip still reads it as a clean '1'.`,
    stepByStep: `### 🔬 Step-by-Step Transition: Analog to Digital Conversion (ADC)

Here is how modern telecommunication systems convert real-world analog waveforms into digital data:

1. **Step 1: Anti-Aliasing Filtering**
   An analog low-pass filter removes frequencies higher than half the sampling rate ($f_{max} < f_s / 2$) to prevent spectral distortion.

2. **Step 2: Periodic Sampling (Nyquist Theorem)**
   The continuous voltage is measured at equal time intervals $T_s = 1/f_s$. The sampling frequency must be at least twice the highest frequency.

3. **Step 3: Quantization**
   The continuous voltage range is divided into $2^N$ discrete vertical steps (e.g., a 10-bit ADC has 1,024 quantization steps). Each sample is rounded to the closest discrete level.

4. **Step 4: Binary Encoding**
   The quantized level is output as an $N$-bit binary word (e.g. \`10110011\`) ready for memory storage or digital transmission.`,
    troubleshoot: `### 🛠️ Troubleshooting Signal Quality Issues

When working with mixed analog and digital circuits:
- **Symptom: High-frequency digital noise creeping into analog ADC lines.**
  - *Fix*: Separate analog ground (AGND) and digital ground (DGND) on the PCB, connecting them at a single star-point.
- **Symptom: Unstable or jittery analog readings.**
  - *Fix*: Place a 100nF ceramic decoupling capacitor directly between the ADC input pin and AGND.
- **Symptom: Signal clipping or flat-topped peaks.**
  - *Fix*: Verify the input signal amplitude does not exceed the ADC reference voltage ($V_{ref}$). Use a resistive voltage divider if needed.`,
    coding: `### 💻 Arduino C++ Code: Reading Analog vs Digital Inputs

\`\`\`cpp
// Pin Definitions
const int ANALOG_SENSOR_PIN = A0;  // 10-bit ADC (0 to 1023)
const int DIGITAL_BUTTON_PIN = 2;  // Digital input (0 or 1)

void setup() {
  Serial.begin(9600);
  pinMode(DIGITAL_BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  // Reading continuous analog voltage
  int rawADC = analogRead(ANALOG_SENSOR_PIN);
  float voltage = rawADC * (5.0 / 1023.0); // Convert to 0.0V - 5.0V

  // Reading discrete binary state
  int buttonState = digitalRead(DIGITAL_BUTTON_PIN); // HIGH (1) or LOW (0)

  Serial.print("Analog: "); Serial.print(voltage, 2); Serial.print("V | ");
  Serial.print("Digital State: "); Serial.println(buttonState);

  delay(500);
}
\`\`\``
  },
  {
    queryMatch: ['and gate', 'why does an and gate', 'output zero'],
    beginner: `### 🚪 Why an AND Gate Outputs Zero if Any Input is Zero

Imagine a hallway with **two locked security doors in a row**:
- To reach the other side, **Door A AND Door B** must both be unlocked!
- If even **one** door is locked (0), you are stopped dead in your tracks. The output is **0**.
- Only when both doors are opened simultaneously (1 and 1) can anyone pass through (1).

In electronics:
- Binary 1 = Switch Closed (Conducting).
- Binary 0 = Switch Open (Disconnected).
- In an AND circuit, two transistors are placed **in series**. If either transistor is OFF (0), the electric current is broken!`,
    stepByStep: `### 📐 Mathematical & Circuit Proof

1. **Boolean Multiplication**:
   - The AND operation represents Boolean multiplication: $Y = A \\cdot B$.
   - Any number multiplied by 0 is fundamentally 0:
     - $0 \\cdot 0 = 0$
     - $0 \\cdot 1 = 0$
     - $1 \\cdot 0 = 0$
     - $1 \\cdot 1 = 1$

2. **Transistor Switch Model (CMOS)**:
   - In CMOS logic, the pull-up network consists of two PMOS transistors in parallel connected to $V_{DD}$.
   - The pull-down network consists of two NMOS transistors in series connected to Ground.
   - If input $A=0$, the bottom NMOS transistor is turned OFF, breaking the conduction path to Ground, ensuring output remains 0 after the output inverter stage.`,
    troubleshoot: `### 🛠️ Hardware Diagnostic for AND Gate Circuits

If your physical 74LS08 or 74HC08 AND gate IC is behaving unexpectedly:
1. **Floating Inputs**: In TTL logic (74LS), an unconnected pin floats HIGH, which can lead to false triggers. Always connect unused input pins through a 10kΩ pull-down resistor to GND.
2. **Missing Decoupling**: Check that a 0.1µF ceramic capacitor is soldered right across Pin 14 ($V_{CC}$) and Pin 7 ($GND$) of the chip.
3. **Logic Threshold Check**: Ensure input voltage meets $V_{IH}$ (minimum 2.0V for TTL, 3.5V for 5V CMOS).`,
    coding: `### 💻 Bitwise AND in C/C++ and Verilog

\`\`\`c
// In C/C++ Firmware
uint8_t inputA = 1;
uint8_t inputB = 0;
uint8_t outputY = inputA & inputB; // Result is 0
\`\`\`

\`\`\`verilog
// In Verilog HDL for FPGA
module and_gate_demo (
    input  wire A,
    input  wire B,
    output wire Y
);
    assign Y = A & B;
endmodule
\`\`\``
  },
  {
    queryMatch: ['pwm', 'pulse width modulation'],
    beginner: `### 💡 Pulse Width Modulation (PWM) Explained Simply

Imagine turning a light switch **ON and OFF with super-human speed** (say, 1,000 times every second):
- If you keep it ON for 90% of each millisecond and OFF for 10%, the room looks bright!
- If you keep it ON for 10% and OFF for 90%, your eyes only see a gentle dim glow.
- The light bulb never sees an in-between voltage — it's always either 0V or 5V — but because it switches so fast, the **average energy delivered** feels like a lower voltage!

This is **PWM**: We modulate (change) the **width** of the ON pulse to control motors and LED brightness without wasting power as heat.`,
    stepByStep: `### ⚡ The Mathematics of PWM

1. **Period ($T$)**: The duration of one complete switching cycle:
   $$T = T_{ON} + T_{OFF}$$
2. **Frequency ($f$)**: How many cycles occur per second:
   $$f = \\frac{1}{T}$$
3. **Duty Cycle ($D$)**: The percentage of time the pulse is HIGH:
   $$D = \\left( \\frac{T_{ON}}{T} \\right) \\times 100\\%$$
4. **Average DC Output ($V_{avg}$)**:
   $$V_{avg} = D \\times V_{peak}$$
   *Example: With a 12V supply and 25% duty cycle:*
   $$V_{avg} = 0.25 \\times 12\\text{V} = 3.0\\text{V}$$`,
    troubleshoot: `### 🛠️ Common PWM Issues & Solutions

- **Issue: High-pitch audible whining noise from motors.**
  - *Cause*: PWM carrier frequency is within human hearing range (typically around 1 kHz - 4 kHz).
  - *Fix*: Increase PWM frequency to above 20 kHz (ultrasonic) by configuring microcontroller hardware timer prescalers.
- **Issue: Driver MOSFET overheating rapidly.**
  - *Cause*: Gate capacitance charges too slowly, causing the MOSFET to linger in the resistive linear region during switching.
  - *Fix*: Use a dedicated gate driver IC (like TC4420 or IR2104) to source high transient gate current.`,
    coding: `### 💻 Arduino ESP32 LED Dimmer PWM Code

\`\`\`cpp
// ESP32 LEDC PWM Example
const int LED_PIN = 16;
const int PWM_CHANNEL = 0;
const int PWM_FREQ = 5000;    // 5 kHz frequency
const int PWM_RESOLUTION = 8; // 8-bit resolution (0 to 255)

void setup() {
  ledcAttach(LED_PIN, PWM_FREQ, PWM_RESOLUTION);
}

void loop() {
  // Gradually fade LED in
  for (int duty = 0; duty <= 255; duty += 5) {
    ledcWrite(LED_PIN, duty);
    delay(20);
  }
  // Gradually fade LED out
  for (int duty = 255; duty >= 0; duty -= 5) {
    ledcWrite(LED_PIN, duty);
    delay(20);
  }
}
\`\`\``
  },
  {
    queryMatch: ['temperature sensor', 'how does a temperature sensor work'],
    beginner: `### 🌡️ How Temperature Sensors Work

Different temperature sensors use different physical properties:
1. **Thermistors (NTC)**: Made of metal-oxide ceramic. Heat frees up mobile charge carriers, so as it gets hotter, its **resistance drops**.
2. **Semiconductor ICs (LM35 / TMP36)**: Use the precise thermal voltage behavior of silicon PN junctions. The LM35 outputs exactly **10 millivolts for every 1°C** (at 25°C, it outputs 250mV).
3. **Thermocouples**: Two dissimilar metals welded at a tip create a small voltage when there's a temperature gradient (the **Seebeck Effect**). Ideal for blast furnaces up to 1000°C!`,
    stepByStep: `### 📊 From Temperature to Digital Value (LM35 + ADC)

1. **Physical Temperature**: Room is at $28.5^\\circ\\text{C}$.
2. **Analog Sensor Output**:
   $$V_{out} = 28.5 \\times 10\\text{ mV} = 285\\text{ mV} = 0.285\\text{ V}$$
3. **ADC Conversion (10-bit with 5.0V reference)**:
   $$\\text{ADC Count} = \\frac{0.285}{5.0} \\times 1023 \\approx 58$$
4. **Firmware Calculation**:
   $$\\text{Voltage} = \\text{rawADC} \\times \\left(\\frac{5.0}{1023.0}\\right)$$
   $$\\text{Temperature} = \\frac{\\text{Voltage}}{0.010}$$`,
    troubleshoot: `### 🛠️ Debugging Fluctuating Sensor Readings

1. **Power Supply Ripple**: If your 5V USB rail drops under load, your ADC reference drops too, making temperatures appear higher than reality! Use the internal stable 1.1V bandgap reference:
   \`analogReference(INTERNAL);\` (on ATmega328P).
2. **Long Wire EMI**: If wires to the sensor exceed 30cm, shield the cable and solder a 0.1µF capacitor right between sensor $V_{out}$ and $GND$.`,
    coding: `### 💻 Arduino Temperature Monitor with Safety Threshold

\`\`\`cpp
const int SENSOR_PIN = A0;
const int FAN_RELAY_PIN = 8;
const float TEMP_THRESHOLD_C = 45.0; // Trigger fan at 45 C

void setup() {
  Serial.begin(9600);
  pinMode(FAN_RELAY_PIN, OUTPUT);
}

void loop() {
  int raw = analogRead(SENSOR_PIN);
  float voltage = raw * (5.0 / 1023.0);
  float tempC = voltage * 100.0; // 10mV per degree -> * 100

  Serial.print("Current Temp: ");
  Serial.print(tempC, 1);
  Serial.println(" °C");

  if (tempC >= TEMP_THRESHOLD_C) {
    digitalWrite(FAN_RELAY_PIN, HIGH); // Turn cooling fan ON
    Serial.println(">>> WARNING: Fan ACTIVATED");
  } else {
    digitalWrite(FAN_RELAY_PIN, LOW);  // Normal state
  }

  delay(1000);
}
\`\`\``
  },
  {
    queryMatch: ['debug', 'arduino temperature-monitoring code', 'debug this arduino'],
    beginner: `### 🔍 Common Arduino Temperature Bugs & How to Fix Them

Here are the top 3 mistakes students make when coding temperature monitors:
1. **Integer Division Bug**: Writing \`(5 / 1023)\` instead of \`(5.0 / 1023.0)\`. In C++, 5 / 1023 equals **0**!
2. **Missing Sensor Delay**: Reading the ADC too fast without allowing the internal sample-and-hold capacitor to charge.
3. **Threshold Chattering**: The fan turns on at 40.0°C and turns off at 39.9°C rapidly (use **hysteresis**!).`,
    stepByStep: `### 🛠️ Step-by-Step Code Review & Hysteresis Implementation

To prevent relays or fans from rapid wear-and-tear clicking:
1. Define an **Upper Setpoint** (e.g. 50°C to turn ON).
2. Define a **Lower Reset Point** (e.g. 45°C to turn OFF).
3. The 5°C deadband prevents noise from fluttering the fan relay.`,
    troubleshoot: `### ⚡ Hardware Diagnostic Checklist

1. Verify pin connections: LM35 Flat face towards you -> Left is $V_{CC}$ (4-20V), Middle is $V_{OUT}$, Right is $GND$.
   *Caution: If wired backwards, the chip will overheat instantly and can burn your fingers!*
2. Ensure you have selected the correct analog input pin (e.g., A0 vs A1) in code.`,
    coding: `### 💻 Production-Grade Arduino Code with Hysteresis & Averaging

\`\`\`cpp
const int TEMP_PIN = A0;
const int COOLER_PIN = 7;

const float FAN_ON_TEMP  = 48.0; // Upper limit
const float FAN_OFF_TEMP = 42.0; // Lower limit (hysteresis)

bool coolerActive = false;

float readFilteredTemperature() {
  long sum = 0;
  for (int i = 0; i < 16; i++) {
    sum += analogRead(TEMP_PIN);
    delay(5);
  }
  float avgRaw = (float)sum / 16.0;
  float millivolts = (avgRaw * 5000.0) / 1024.0;
  return millivolts / 10.0; // 10 mV/°C for LM35
}

void setup() {
  Serial.begin(115200);
  pinMode(COOLER_PIN, OUTPUT);
}

void loop() {
  float temp = readFilteredTemperature();
  Serial.print("Filtered Temp: "); Serial.print(temp, 1); Serial.println(" C");

  if (!coolerActive && temp >= FAN_ON_TEMP) {
    coolerActive = true;
    digitalWrite(COOLER_PIN, HIGH);
  } else if (coolerActive && temp <= FAN_OFF_TEMP) {
    coolerActive = false;
    digitalWrite(COOLER_PIN, LOW);
  }

  delay(500);
}
\`\`\``
  }
];

export function getDemoResponse(userQuery: string, mode: AIMode = 'beginner'): string {
  const queryLower = userQuery.toLowerCase().trim();

  // Find best match in knowledge base
  const match = knowledgeBase.find(kb => 
    kb.queryMatch.some(q => queryLower.includes(q))
  );

  if (match) {
    switch (mode) {
      case 'beginner': return match.beginner;
      case 'stepByStep': return match.stepByStep;
      case 'troubleshoot': return match.troubleshoot;
      case 'coding': return match.coding;
      default: return match.beginner;
    }
  }

  // Smart fallback response for other ENTC queries
  return `### ⚡ ENTC Engineering Tutor Response

**Topic Analyzed**: "${userQuery}"  
**Current Mode**: *${mode.toUpperCase()}*

In Electronics and Telecommunication Engineering, **${userQuery.slice(0, 40)}...** is deeply connected to signal integrity, semiconductor behavior, and embedded firmware design.

#### Key Principles:
1. **Mathematical Representation**: In signal domain, signals are represented either in time-domain $x(t)$ or frequency-domain $X(f)$ via Fourier Transforms.
2. **Physical Layer Implementation**: Voltage levels, propagation delays, and electromagnetic compatibility (EMC) dictate circuit performance.
3. **Firmware / Hardware Co-Design**: Microcontrollers interface with transceivers via standard buses (UART, SPI, I2C, CAN) while managing power budgets and interrupts.

> 💡 **Tip**: Try switching to **"Step-by-Step"** or **"Coding Assistance"** mode in the tutor toolbar above, or select one of the suggested engineering questions below!`;
}
