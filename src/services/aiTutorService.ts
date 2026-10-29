import { ChatMessage } from '../types';

export interface TutorMode {
  id: 'beginner' | 'step-by-step' | 'troubleshoot' | 'coding';
  label: string;
  description: string;
  promptPrefix: string;
}

export const TUTOR_MODES: TutorMode[] = [
  {
    id: 'beginner',
    label: "Explain Like I'm a Beginner",
    description: 'Intuitive analogies, plain English, zero unnecessary jargon',
    promptPrefix: 'Explain this in an intuitive, beginner-friendly way using simple real-world analogies suitable for an entry-level electronics student:'
  },
  {
    id: 'step-by-step',
    label: 'Step-by-Step Breakdown',
    description: 'Rigorous engineering steps, derivations, and circuit flow',
    promptPrefix: 'Provide a structured, rigorous, step-by-step engineering breakdown with mathematical formulas, circuit diagrams, and working steps:'
  },
  {
    id: 'troubleshoot',
    label: 'Hardware & Circuit Debugger',
    description: 'Diagnose wiring mistakes, noise, voltage drops, and faulty logic',
    promptPrefix: 'Act as a senior hardware debugging engineer. Troubleshoot this circuit or hardware issue, listing common failure modes, diagnostic multimeter test points, and actionable fixes:'
  },
  {
    id: 'coding',
    label: 'Embedded Firmware Assistant',
    description: 'C/C++, Arduino, Python, registers, and timing routines',
    promptPrefix: 'Act as an embedded systems firmware engineer. Provide clean, well-commented C/C++ or Arduino code, register definitions, non-blocking timing, and explain key operations:'
  }
];

export const SUGGESTED_QUESTIONS = [
  'Explain the difference between analog and digital signals.',
  'Why does an AND gate output zero if one input is zero?',
  'Help me debug this Arduino temperature-monitoring code.',
  'Explain PWM with a practical duty cycle example.',
  'How does an HC-SR04 ultrasonic distance sensor work?',
  'Why do we need a pull-up resistor on microcontroller input pins?'
];

const PREDEFINED_KNOWLEDGE_BASE: {
  keywords: string[];
  responseByMode: Record<string, { answer: string; followUps: string[] }>;
}[] = [
  {
    keywords: ['analog', 'digital', 'difference'],
    responseByMode: {
      beginner: {
        answer: `### 🌊 Analog vs ⚡ Digital: The Dimmer vs The Light Switch Analogy

Think of **Analog** like a dimmer switch or a ramp. You can slide it to *any* continuous brightness level—dim, medium, 43.7%, or blazing bright. Nature is purely analog: sound, temperature, and sunlight vary smoothly without jumps.

Think of **Digital** like a standard light switch or a flight of stairs. It is strictly in one of two states: **ON (1)** or **OFF (0)**. There are no in-between states!

#### Quick Comparison Table:
| Property | Analog Signal | Digital Signal |
| :--- | :--- | :--- |
| **Values** | Continuous range (e.g. 0.0V to 5.0V) | Discrete states (HIGH = 5V, LOW = 0V) |
| **Noise Immunity** | Sensitive (noise corrupts exact voltage) | Robust (minor noise doesn't flip a 0 into a 1) |
| **Storage & Processing** | Hard to compress without degradation | Easily saved, encrypted, and processed by CPUs |
| **Real-World Examples** | Human voice, mercury thermometer | Microprocessors, HDMI, Wi-Fi packets |`,
        followUps: [
          'How does an Analog-to-Digital Converter (ADC) convert smooth signals?',
          'What is the Nyquist sampling rate?',
          'Why do digital signals use binary instead of decimal?'
        ]
      },
      'step-by-step': {
        answer: `### Detailed Engineering Analysis: Continuous vs Discrete Signals

#### 1. Mathematical Representation
- **Analog Signal $x(t)$**: Continuous-time function defined for every real $t \\in \\mathbb{R}$. The amplitude can take an uncountably infinite number of values within a range $[V_{min}, V_{max}]$.
- **Digital Signal $x[n]$**: Sampled at discrete intervals $t = nT_s$ and quantized to finite bit-depth $Q = 2^N$ levels (where $N$ is the ADC bit resolution).

#### 2. The Conversion Pipeline (ADC & DAC)
1. **Anti-Aliasing Filter**: Low-pass filter removing frequencies above Nyquist limit ($f_{max} < f_s / 2$).
2. **Sample-and-Hold (S/H)**: Capacitor freezes analog voltage during the conversion window.
3. **Quantization**: Mapping continuous voltage into discrete integer code words with quantization error $e_q \\le \\frac{V_{LSB}}{2}$.
4. **Encoding**: Generating binary parallel or serial stream (I2S, SPI, UART).

#### 3. Signal-to-Noise Ratio (SNR)
Digital signals achieve superior Signal-to-Quantization-Noise Ratio:
$$\\text{SQNR (dB)} \\approx 6.02 N + 1.76$$
Every additional ADC bit improves dynamic range by approximately 6 dB!`,
        followUps: [
          'Calculate quantization noise for a 12-bit ADC at 3.3V',
          'Explain the aperture jitter effect in high-speed ADCs',
          'How does a Flash ADC compare to a Successive Approximation (SAR) ADC?'
        ]
      },
      troubleshoot: {
        answer: `### Debugging Mixed-Signal Analog/Digital Interference

When analog sensor lines run adjacent to high-speed digital switching traces:
1. **Symptom**: Unstable sensor readings with high-frequency noise spikes or periodic ripples matching SPI/I2C clocks.
2. **Root Cause**: Capacitive or inductive cross-talk from sharp digital rise/fall edges ($dV/dt > 1\\text{V/ns}$).
3. **Hardware Fixes**:
   - Separate **AGND (Analog Ground)** and **DGND (Digital Ground)** planes, tying them together at a single "star ground" point beneath the ADC.
   - Place a $0.1\\mu\\text{F}$ ceramic bypass capacitor directly between the ADC $V_{ref}$ and AGND pins.
   - Route analog traces over solid ground planes without crossing split ground voids.`,
        followUps: [
          'How do I size an RC low-pass filter for an analog input pin?',
          'How to implement software moving-average filtering in Arduino?'
        ]
      },
      coding: {
        answer: `### Arduino Analog Reading & Filtering Example

\`\`\`cpp
// High-stability analog sampling with oversampling and rolling average
const int SENSOR_PIN = A0;
const int NUM_SAMPLES = 16;

float readFilteredVoltage() {
  long rawSum = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    rawSum += analogRead(SENSOR_PIN);
    delayMicroseconds(50); // settle ADC sample-and-hold cap
  }
  float avgRaw = (float)rawSum / NUM_SAMPLES;
  // Convert 10-bit ADC (0-1023) to Voltage (0-5.0V)
  float voltage = (avgRaw / 1023.0) * 5.0;
  return voltage;
}

void setup() {
  Serial.begin(115200);
}

void loop() {
  float v = readFilteredVoltage();
  Serial.print("Filtered Voltage: ");
  Serial.print(v, 3);
  Serial.println(" V");
  delay(200);
}
\`\`\``,
        followUps: [
          'Can we implement an Exponential Moving Average (EMA) filter?',
          'How to use the internal 1.1V bandgap reference on ATmega328P?'
        ]
      }
    }
  },
  {
    keywords: ['and gate', 'zero', 'input is zero', 'why'],
    responseByMode: {
      beginner: {
        answer: `### 🔐 The Two-Key Safe Analogy for an AND Gate

Imagine a bank vault door that requires **two distinct keys turned simultaneously** to open.
- Key A = Input 1
- Key B = Input 2
- Vault Opens = Output 1 (HIGH)

If you turn Key A, but Key B is missing (0), the vault remains securely locked (0)!
If you turn Key B, but Key A is missing (0), the vault remains locked (0)!
Only when **both Key A AND Key B** are present does current flow and the door opens!

In Boolean algebra, an AND gate is direct mathematical multiplication:
$$Y = A \\times B$$
In ordinary arithmetic, anything multiplied by zero ($0 \\times 1$ or $0 \\times 0$) is always zero!`,
        followUps: [
          'What is the difference between AND and NAND gates?',
          'How is an AND gate built with two NPN transistors?'
        ]
      },
      'step-by-step': {
        answer: `### Transistor-Level Circuit Analysis of an AND Gate

In CMOS silicon implementations, an AND gate is fabricated as a **NAND gate followed by an Inverter**:

#### 1. NMOS Pull-Down Network (PDN)
- Two n-channel MOSFETs ($Q_1$ and $Q_2$) are placed **in series** between the output node and Ground (0V).
- For a conductive path to ground to form, both transistors must be turned ON simultaneously ($A=1$ AND $B=1$).
- If either $A=0$ or $B=0$, the series channel is broken (open circuit).

#### 2. PMOS Pull-Up Network (PUN)
- Two p-channel MOSFETs are placed in **parallel** between $V_{DD}$ and output node.
- If either input is $0$, at least one PMOS conducts, pulling the internal node to $V_{DD}$ (HIGH).

#### 3. Output Stage
- The output of the CMOS NAND is fed into a CMOS inverter ($Y = \\overline{A \\cdot B} \\rightarrow \\text{NOT} \\rightarrow A \\cdot B$).
- Thus, whenever any input is 0, the AND output is forced strictly to 0V.`,
        followUps: [
          'Show the truth table for 3-input AND gate',
          'Explain propagation delay in CMOS gates'
        ]
      },
      troubleshoot: {
        answer: `### Troubleshooting a Floating Logic Gate Input

If your physical 74HC08 AND gate outputs sporadic 1s or oscillates when an input is supposedly disconnected:
- **Root Cause**: In CMOS technology, disconnected (floating) inputs have infinite gate impedance ($>10^{12}\\Omega$) and act as tiny antennas, picking up electrostatic charge that drifts into the undefined threshold zone ($1.5V - 2.5V$).
- **Solution**: Never leave unused inputs floating. Connect unused inputs either directly to $V_{CC}$ (or Ground), or tie with a $10\\text{k}\\Omega$ pull-down resistor!`,
        followUps: [
          'What happens when TTL inputs float vs CMOS?',
          'How do Schmitt trigger gates clean noisy inputs?'
        ]
      },
      coding: {
        answer: `### Bitwise AND in Embedded C / C++

\`\`\`c
#include <stdio.h>
#include <stdint.h>

// Microcontroller port bit masking using bitwise AND (&)
#define STATUS_READY_BIT  (1 << 2) // Bit 2 (0b00000100)

int main() {
    uint8_t hardwareStatusRegister = 0b00000101; // Sensor ready and running
    
    // Check if bit 2 is HIGH
    if (hardwareStatusRegister & STATUS_READY_BIT) {
        printf("Device is READY!\\n");
    } else {
        printf("Device is NOT ready (bit 2 is 0).\\n");
    }
    return 0;
}
\`\`\``,
        followUps: [
          'How to clear a specific bit using bitwise AND and bitwise NOT?',
          'What is the difference between logical && and bitwise &?'
        ]
      }
    }
  },
  {
    keywords: ['pwm', 'pulse width', 'duty cycle'],
    responseByMode: {
      beginner: {
        answer: `### 💡 PWM: The Rapid Light Switch Analogy

Imagine standing in front of a light switch and flicking it ON and OFF very rapidly, 1000 times a second:
- If you leave it **ON for 90% of each millisecond** and OFF for 10%, the room looks bright!
- If you leave it **ON for 50%** and OFF for 50%, the room looks half-bright!
- If you leave it **ON for 10%** and OFF for 90%, the room is dim.

Your eyes and the filament cannot react fast enough to see the flickers; they only perceive the **average brightness**.
That is **Pulse Width Modulation (PWM)**!

#### Key Definitions:
- **Period ($T$)**: The total duration of one cycle ($T = T_{on} + T_{off}$).
- **Frequency ($f$)**: How many cycles occur per second ($f = 1/T$, typically 490Hz to 20kHz).
- **Duty Cycle ($D$)**: The percentage of time the switch is ON.
$$\\text{Duty Cycle} = \\frac{T_{on}}{T} \\times 100\\%$$`,
        followUps: [
          'What frequency should be used to avoid audible motor hum?',
          'How does PWM control a RC Servo Motor angle?',
          'Can an RC filter turn PWM into pure analog DC?'
        ]
      },
      'step-by-step': {
        answer: `### Pulse Width Modulation: Mathematical & Hardware Analysis

#### 1. Average Voltage Derivation
The average value of a periodic signal $v(t)$ of period $T$:
$$V_{avg} = \\frac{1}{T} \\int_{0}^{T} v(t) dt$$
Since $v(t) = V_{cc}$ for $0 \\le t \\le T_{on}$ and $v(t) = 0$ for $T_{on} < t \\le T$:
$$V_{avg} = \\frac{1}{T} \\left( \\int_{0}^{T_{on}} V_{cc} dt + \\int_{T_{on}}^{T} 0 dt \\right) = \\frac{V_{cc} \\cdot T_{on}}{T} = D \\cdot V_{cc}$$

#### 2. Hardware Timer PWM Architecture (e.g. Timer0 in AVR)
1. **Prescaler**: Scales system clock $f_{clk}$ down by factor $N$ (e.g. 1, 8, 64, 256).
2. **Counter Register (TCNT)**: Increments continuously from 0 up to \`TOP\` (255 for 8-bit).
3. **Output Compare Register (OCR)**: Compared with TCNT on every clock cycle.
4. When $\\text{TCNT} = \\text{OCR}$, hardware comparator flips the physical output pin.
5. **Phase-Correct PWM Frequency**:
   $$f_{PWM} = \\frac{f_{clk}}{2 \\cdot N \\cdot \\text{TOP}}$$`,
        followUps: [
          'Calculate component values for an RC PWM demodulator',
          'What is Fast PWM vs Phase-Correct PWM?'
        ]
      },
      troubleshoot: {
        answer: `### Debugging PWM Issues: Motor Whine & MOSFET Heating

1. **Audible Motor Whine (High pitched squeal ~500Hz-1kHz)**:
   - *Cause*: PWM frequency falls directly within the human acoustic range (20Hz - 20kHz) and vibrates motor windings via magnetostriction.
   - *Solution*: Increase timer PWM frequency above 20 kHz (ultrasonic) using timer prescaler registers.

2. **MOSFET Overheating at Moderate Loads**:
   - *Cause*: Gate capacitance charging too slowly through high-impedance microcontroller pins ($R_{gate} > 1\\text{k}\\Omega$), trapping the MOSFET in its linear resistive region during switching transitions.
   - *Solution*: Use a dedicated low-side gate driver (e.g. TC4427 or TC4420) capable of sourcing 1A+ peak transient gate current.`,
        followUps: [
          'Why is a flyback diode mandatory across inductive motor loads?',
          'How to measure PWM duty cycle using an oscilloscope?'
        ]
      },
      coding: {
        answer: `### High-Frequency Hardware PWM on ESP32 / Arduino

\`\`\`cpp
// ESP32 LEDC (LED Control) Hardware PWM configuration
const int LED_PIN = 18;
const int PWM_CHANNEL = 0;
const int PWM_FREQ = 25000;    // 25 kHz (Silent, no motor whine)
const int PWM_RESOLUTION = 8;  // 8-bit resolution (0 - 255)

void setup() {
  ledcAttach(LED_PIN, PWM_FREQ, PWM_RESOLUTION);
}

void loop() {
  // Smoothly fade from 0% to 100% duty cycle
  for (int duty = 0; duty <= 255; duty++) {
    ledcWrite(LED_PIN, duty);
    delay(5);
  }
  for (int duty = 255; duty >= 0; duty--) {
    ledcWrite(LED_PIN, duty);
    delay(5);
  }
}
\`\`\``,
        followUps: [
          'How do I generate complementary PWM with dead-time for an H-Bridge?',
          'Explain PWM timer registers on STM32 using CMSIS'
        ]
      }
    }
  },
  {
    keywords: ['temperature', 'sensor', 'lm35', 'how does'],
    responseByMode: {
      beginner: {
        answer: `### 🌡️ How Temperature Sensors Work

Temperature sensors convert thermal energy into an electrical signal that a microcontroller can read.

There are three common types:
1. **Analog Linear ICs (e.g. LM35)**:
   - Uses a special silicon transistor bandgap circuit.
   - Outputs a voltage that rises by exactly **$10\\text{ millivolts}$ for every $1^{\\circ}\\text{C}$ increase**.
   - At $25^{\\circ}\\text{C}$, it gives $250\\text{ mV}$. At $50^{\\circ}\\text{C}$, it gives $500\\text{ mV}$.
2. **Thermistors (NTC/PTC)**:
   - Resistors whose resistance changes with temperature.
   - NTC (Negative Temperature Coefficient) drops in resistance as it gets hotter!
3. **Digital Sensors (e.g. DS18B20, DHT22)**:
   - Includes its own internal computer chip that sends temperature as a digital message over 1 wire!`,
        followUps: [
          'How to calculate temperature from an NTC thermistor using Steinhart-Hart equation?',
          'Why does LM35 require an analog pin but DHT11 uses digital?'
        ]
      },
      'step-by-step': {
        answer: `### Silicon Bandgap Temperature Sensor Physics (LM35)

#### Principle of Operation
The core of an integrated semiconductor temperature sensor is the difference in base-emitter voltage ($\\Delta V_{be}$) between two identical bipolar transistors operated at different collector current densities ($J_1$ and $J_2$):

$$\\Delta V_{be} = V_{be1} - V_{be2} = \\frac{k T}{q} \\ln\\left(\\frac{J_1}{J_2}\\right)$$
Where:
- $k = 1.38 \\times 10^{-23}\\text{ J/K}$ (Boltzmann constant)
- $q = 1.602 \\times 10^{-19}\\text{ C}$ (Electron charge)
- $T$ = Absolute temperature in Kelvin

Notice that $\\Delta V_{be}$ is **strictly linear with absolute temperature $T$** (PTAT: Proportional to Absolute Temperature). Internal operational amplifiers scale and calibrate this slope to yield exactly $10.0\\text{ mV/}^{\\circ}\\text{C}$.`,
        followUps: [
          'Derive the ADC conversion equation for Arduino 5V reference',
          'How do RTD (Pt100) sensors measure high temperatures up to 850°C?'
        ]
      },
      troubleshoot: {
        answer: `### Troubleshooting Inaccurate LM35 Temperature Readings

1. **Symptoms**: Readout jumps erratically by $\\pm 4^{\\circ}\\text{C}$ or reads falsely high ($+5^{\\circ}\\text{C}$ too hot).
2. **Common Culprits**:
   - **Noisy USB Vcc**: The Arduino default ADC reference is $V_{CC}$ (which fluctuates from 4.7V to 5.2V depending on computer USB load). When reference fluctuates, ADC readings jump!
   - **Self-Heating**: If the sensor load impedance is too low, current drawn heats the silicone die.
3. **Cures**:
   - Switch Arduino reference to stable internal bandgap: \`analogReference(INTERNAL);\` (1.1V reference on ATmega328P).
   - Add a $0.1\\mu\\text{F}$ bypass capacitor between sensor $V_{out}$ and GND close to the micro pin.`,
        followUps: [
          'How to implement median filtering to reject outlier sensor spikes?',
          'What cable type should be used for long-distance sensor runs?'
        ]
      },
      coding: {
        answer: `### Calibrated Arduino LM35 Reader with Internal 1.1V Reference

\`\`\`cpp
// High precision LM35 reading using internal 1.1V stable reference
const int LM35_PIN = A0;

void setup() {
  Serial.begin(115200);
  // Switch ADC reference to 1.1V internal bandgap (eliminates USB 5V fluctuations!)
  analogReference(INTERNAL);
}

void loop() {
  // Discard first reading after channel switch to settle ADC multiplexer
  analogRead(LM35_PIN);
  delay(10);
  
  int rawADC = analogRead(LM35_PIN);
  // 1.1V / 1024 = 1.0742 mV per ADC step
  float millivolts = (rawADC * 1100.0) / 1024.0;
  // LM35 is 10mV per degree Celsius
  float tempC = millivolts / 10.0;
  
  Serial.print("Raw: ");
  Serial.print(rawADC);
  Serial.print(" | Temp: ");
  Serial.print(tempC, 2);
  Serial.println(" °C");
  delay(1000);
}
\`\`\``,
        followUps: [
          'How to convert Celsius to Fahrenheit and Kelvin?',
          'How to sound a buzzer alarm when temperature exceeds 50°C?'
        ]
      }
    }
  },
  {
    keywords: ['debug', 'arduino', 'code', 'help'],
    responseByMode: {
      beginner: {
        answer: `### 🛠️ Common Arduino Code Mistakes & How to Fix Them

Here is a checklist of the top reasons Arduino code fails to work:

1. **Forgetting \`pinMode()\` in \`setup()\`**:
   - If an LED doesn't light up or is super dim, check if you wrote \`pinMode(ledPin, OUTPUT);\`. Without it, the pin defaults to high-impedance INPUT!
2. **Blocking with \`delay()\`**:
   - \`delay(5000)\` freezes the CPU completely. It cannot read buttons or react to alarms during that time.
3. **Mismatched Baud Rate in Serial Monitor**:
   - Seeing gibberish like \`⸮⸮x⸮\` in Serial Monitor? Ensure the baud dropdown at bottom-right matches \`Serial.begin(9600)\` or \`Serial.begin(115200)\`.
4. **Integer Division Pitfall**:
   - Writing \`float ratio = 1 / 2;\` gives \`0.0\` because both are integers! Write \`1.0 / 2.0\` or \`1.0f / 2\`.`,
        followUps: [
          'Show me how to replace delay() with millis()',
          'How to debounce a button switch in code?'
        ]
      },
      'step-by-step': {
        answer: `### Arduino Non-Blocking State Machine Pattern

\`\`\`cpp
// Non-blocking asynchronous task execution pattern
unsigned long previousMillis = 0;
const long interval = 1000; // 1 second interval
int ledState = LOW;
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  unsigned long currentMillis = millis();

  // Non-blocking timer check
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis; // Reset timer milestone

    // Toggle LED
    ledState = (ledState == LOW) ? HIGH : LOW;
    digitalWrite(LED_PIN, ledState);
  }

  // Other sensors can be read continuously with zero delay here!
}
\`\`\``,
        followUps: [
          'How to handle millis() rollover every ~49.7 days?',
          'How to structure a multi-state finite state machine (FSM)?'
        ]
      },
      troubleshoot: {
        answer: `### Hardware Diagnostic Checklist for Microcontroller Projects

1. **Power Supply Droop**:
   - When servos or relays engage, power rails can droop below 4.5V, causing brown-out reset (BOR). Add a $470\\mu\\text{F}$ electrolytic capacitor across 5V and GND.
2. **Missing Ground Return**:
   - Are you powering an external sensor/driver with an external battery? The external ground **MUST be tied together** with the Arduino GND!
3. **Pin Current Limit**:
   - ATmega328P pins can safely supply max 20mA (absolute limit 40mA). Never drive high-power LEDs, buzzers, or motors directly from an I/O pin without a transistor or MOSFET.`,
        followUps: [
          'How to wire a 2N2222 NPN transistor as a low-side switch?',
          'What is an optocoupler and why use it for galvanic isolation?'
        ]
      },
      coding: {
        answer: `### Robust Arduino Sensor Reader with Watchdog Protection

\`\`\`cpp
#include <avr/wdt.h>

void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  // Enable 2-second hardware watchdog timer
  wdt_enable(WDTO_2S);
  Serial.println("System Initialized with Watchdog.");
}

void loop() {
  wdt_reset(); // "Pet" or kick the watchdog to prevent reset

  // Perform normal sensor telemetry
  int val = analogRead(A0);
  Serial.println(val);
  delay(100);
}
\`\`\``,
        followUps: [
          'How does the watchdog timer prevent embedded lockups?',
          'How to configure sleep modes to save battery power?'
        ]
      }
    }
  }
];

export async function askAiTutor(
  userQuestion: string,
  mode: 'beginner' | 'step-by-step' | 'troubleshoot' | 'coding',
  apiKey?: string,
  modelName: string = 'gemini-1.5-flash'
): Promise<{ text: string; isDemo: boolean; followUps: string[] }> {
  // If API key is provided and valid length, attempt real API call
  if (apiKey && apiKey.trim().length > 15) {
    try {
      const modeConfig = TUTOR_MODES.find(m => m.id === mode) || TUTOR_MODES[0];
      const systemInstruction = `You are the ENTC Innovate Lab AI Tutor, a friendly, deeply knowledgeable professor and engineer in Electronics and Telecommunication Engineering.
Teaching Style: ${modeConfig.promptPrefix}
Guidelines:
- Explain clearly with formulas (use Markdown LaTeX syntax), diagrams represented in ascii/markdown, pinouts, and code where helpful.
- Keep responses practical and technically sound.
- Conclude with 2-3 relevant follow-up questions for the student.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nStudent Question: ${userQuestion}` }]
              }
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1200
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return {
            text: candidate,
            isDemo: false,
            followUps: [
              'Can you explain this with a circuit diagram?',
              'What are the typical industrial failure modes?',
              'How would I write the firmware code for this?'
            ]
          };
        }
      }
    } catch (apiError) {
      console.warn('Real AI API call failed, falling back to ENTC Knowledge Engine Demo mode:', apiError);
    }
  }

  // Fallback to rich built-in ENTC Knowledge Base (clearly marked as Demo Mode)
  const lowerQ = userQuestion.toLowerCase();
  for (const entry of PREDEFINED_KNOWLEDGE_BASE) {
    const matched = entry.keywords.some(kw => lowerQ.includes(kw));
    if (matched) {
      const modeData = entry.responseByMode[mode] || entry.responseByMode['beginner'];
      return {
        text: modeData.answer,
        isDemo: true,
        followUps: modeData.followUps
      };
    }
  }

  // Default educational response for other electronics topics
  const defaultAnswers: Record<string, string> = {
    beginner: `### ⚡ ENTC Engineering Insight: "${userQuestion}"

In electronics and telecommunication engineering, everything connects back to the interaction between **electrons, voltage potentials, electromagnetic waves, and binary states**:

- **Signals**: Carry information either continuously (analog waves) or discretely (binary 0 and 1 pulses).
- **Processing**: We shape, amplify, filter, and compute these signals using active components (transistors, op-amps, microcontrollers).
- **Transmission**: We broadcast signals through wired copper/fiber or wireless radio frequencies.

*Tip: For live AI responses on any custom question, you can enter your free Gemini API key in Settings.*`,
    'step-by-step': `### 🔬 Technical Analysis: "${userQuestion}"

1. **System Modeling**: Define the input excitation signal $x(t)$ and output response $y(t)$ of the system transfer function $H(s)$ or $H(z)$.
2. **Circuit Architecture**: Determine the required active elements (transistors, logic gates, ADC/DAC converters) and impedance matching networks.
3. **Signal Integrity**: Verify timing budgets, propagation delays ($t_{pd}$), slew rates, and power dissipation.
4. **Validation**: Test using virtual oscilloscope probes, logic analyzers, and unit test suites.`,
    troubleshoot: `### 🛠️ Hardware Diagnostic Protocol for: "${userQuestion}"

1. **Measure Supply Rails**: Verify DC voltage with a multimeter at the IC pins ($V_{CC} \\pm 5\\%$). Check for excessive ripple.
2. **Ground Continuity**: Ensure common ground reference across all modules (MCU, sensors, external power supplies).
3. **Logic Level Verification**: Confirm CMOS/TTL voltage compatibility (3.3V logic vs 5.0V tolerant pins).
4. **Inspect Signal Traces**: Look for cold solder joints, floating inputs, or missing pull-up/pull-down resistors.`,
    coding: `### 💻 Microcontroller Implementation Blueprint

\`\`\`cpp
// Generic Embedded System Pattern
void setup() {
  Serial.begin(115200);
  // Configure pins and registers
}

void loop() {
  // Read telemetry, execute control algorithm, output response
  delay(10);
}
\`\`\``
  };

  return {
    text: defaultAnswers[mode] || defaultAnswers['beginner'],
    isDemo: true,
    followUps: [
      'Explain the difference between analog and digital signals.',
      'Why does an AND gate output zero if one input is zero?',
      'Explain PWM with a practical example.',
      'How does an ultrasonic distance sensor work?'
    ]
  };
}
