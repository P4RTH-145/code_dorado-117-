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

// Built-in Knowledge Engine for comprehensive ENTC engineering topics
const KNOWLEDGE_BASE: {
  keywords: string[];
  beginner: string;
  stepByStep: string;
  troubleshoot: string;
  coding: string;
  followUps: string[];
}[] = [
  {
    keywords: ['analog', 'digital', 'difference', 'signal', 'continuous', 'discrete'],
    beginner: `**Analog vs. Digital Signals — Made Simple!**

Imagine the difference between a smooth ramp and a staircase:
- **Analog Signals** are like a **smooth ramp**. They can take on *any* continuous value across a voltage range (e.g., 1.23V, 2.789V). Real-world phenomena like sound, temperature, and light are inherently analog.
- **Digital Signals** are like a **staircase** with only two steps: **0 (LOW / Ground)** and **1 (HIGH / +3.3V or +5V)**. Computers and microcontrollers speak digital because 1s and 0s are extremely resistant to electrical noise!

**Key Takeaway:** We use ADCs (Analog-to-Digital Converters) to translate smooth analog sensor signals into 1s and 0s so microprocessors can calculate them.`,
    stepByStep: `**Step-by-Step Signal Comparison Analysis:**

1. **Continuity of Domain:**
   - Analog: Continuous in both time $t$ and amplitude $A(t) \\in \\mathbb{R}$.
   - Digital: Quantized in discrete time $n$ and discrete amplitude levels ($2^N$ levels for $N$-bit ADC).

2. **Noise Resilience & Degradation:**
   - Analog: Electrical noise, EMI, and attenuation add directly to the signal amplitude and cannot be easily separated.
   - Digital: As long as noise does not push voltage past the threshold ($V_{IL}$ or $V_{IH}$), the 0 or 1 is reconstructed perfectly with zero degradation.

3. **Storage & Processing:**
   - Analog requires physical storage like magnetic tape or vinyl grooves.
   - Digital data can be compressed, encrypted, transmitted over 5G/Wi-Fi, and processed by DSPs.

4. **Conversion Interface:**
   - Physical world $\\to$ Sensor $\\to$ Analog Signal $\\to$ ADC $\\to$ Digital Microcontroller $\\to$ DAC $\\to$ Actuator.`,
    troubleshoot: `**Troubleshooting Signal Integrity & Noise in Analog/Digital Circuits:**

- **Symptom: Noisy or fluctuating ADC readings:**
  - Add a 100nF ceramic decoupling capacitor right next to the microcontroller's $V_{REF}$ or $AV_{CC}$ pin.
  - Implement an RC low-pass filter ($R = 1\\text{k}\\Omega, C = 100\\text{nF}$) between the sensor output and ADC pin ($f_c \\approx 1.59\\text{kHz}$).
  - Separate analog ground (AGND) and digital ground (DGND) on the PCB, connecting them at a single star-ground point.
- **Symptom: Digital clock ringing or crosstalk:**
  - Add 22Ω - 33Ω series termination resistors on high-speed digital clock traces (SPI SCK).`,
    coding: `\`\`\`cpp
// Arduino Code: Reading Analog Sensor with Exponential Moving Average (EMA) Filter
const int SENSOR_PIN = A0;
float filteredValue = 0;
const float ALPHA = 0.15; // Smoothing factor (0.0 to 1.0)

void setup() {
  Serial.begin(115200);
  filteredValue = analogRead(SENSOR_PIN);
}

void loop() {
  int rawADC = analogRead(SENSOR_PIN);
  // Low-pass EMA filter eliminates high frequency analog noise
  filteredValue = (ALPHA * rawADC) + ((1.0 - ALPHA) * filteredValue);
  
  float voltage = (filteredValue * 5.0) / 1023.0;
  Serial.print("Raw: "); Serial.print(rawADC);
  Serial.print(" | Filtered Voltage: "); Serial.println(voltage);
  delay(50);
}
\`\`\``,
    followUps: [
      'How does an ADC (Analog-to-Digital Converter) determine its sampling resolution?',
      'Why is digital modulation like QAM preferred over analog AM/FM in 5G?',
      'Show me how an anti-aliasing filter prevents spectral overlap.'
    ]
  },
  {
    keywords: ['and gate', 'zero', 'why and', 'logic 0', 'logic gate', 'truth table'],
    beginner: `**Why does an AND Gate output 0 if any input is 0?**

Think of an AND gate like **two safety switches wired in series along a single power line** to a light bulb:
- Switch A must be ON (1) **AND** Switch B must be ON (1) for electricity to complete the circuit and reach the bulb.
- If **even one switch is open (0)**, the electrical circuit is broken, no current can flow, and the output is strictly 0!

In Boolean algebra: $Y = A \\cdot B$. Multiplication by 0 always equals 0:
- $0 \\cdot 0 = 0$
- $1 \\cdot 0 = 0$
- $0 \\cdot 1 = 0$
- $1 \\cdot 1 = 1$`,
    stepByStep: `**Step-by-Step Transistor Implementation of an AND Gate:**

1. **CMOS Transistor Architecture:**
   - A CMOS AND gate consists of a **NAND gate** followed by a **CMOS Inverter (NOT gate)**.
2. **NAND Stage Pull-Down Network:**
   - Two N-channel MOSFETs (NMOS) are connected in series between the output node and Ground (0V).
   - If either input is LOW (0V), that NMOS transistor is turned OFF (non-conducting), preventing connection to ground.
3. **NAND Stage Pull-Up Network:**
   - Two P-channel MOSFETs (PMOS) are connected in parallel between the supply ($V_{DD}$) and output node.
   - If *any* input is LOW (0V), that PMOS transistor turns ON, pulling the intermediate output HIGH ($V_{DD}$).
4. **Final Inversion:**
   - The NOT stage inverts that HIGH down to 0V (LOW).
   - Hence, any 0 input guarantees the AND gate output collapses to 0!`,
    troubleshoot: `**Troubleshooting Logic Gate Circuits on a Breadboard:**

1. **Floating Inputs:** In TTL (74LS series) or CMOS (74HC series), leaving an input pin unconnected (floating) causes indeterminate states or picks up 50Hz/60Hz mains hum. Always tie unused inputs to $V_{CC}$ (via 10kΩ pull-up) or GND.
2. **Missing Bypass Capacitors:** Always place a 0.1µF (100nF) ceramic capacitor across pin 14 ($V_{CC}$) and pin 7 (GND) of standard 74xx ICs to suppress switching transients.
3. **Output Voltage Loading:** Exceeding the gate's maximum fan-out causes $V_{OH}$ to drop below the threshold ($V_{IH}$ of downstream gates).`,
    coding: `\`\`\`typescript
// TypeScript: Simulating 2-Input and N-Input Logic Gates
export function evaluateAndGate(...inputs: number[]): number {
  // If ANY input is 0, the product collapses to 0
  for (const input of inputs) {
    if (input === 0) return 0;
  }
  return 1;
}

// Example usage:
console.log(evaluateAndGate(1, 1)); // 1
console.log(evaluateAndGate(1, 0)); // 0
console.log(evaluateAndGate(1, 1, 1, 0, 1)); // 0
\`\`\``,
    followUps: [
      'Why are NAND and NOR gates called Universal Gates?',
      'How does an XOR gate differ from an OR gate?',
      'Can you show me the transistor schematic of a CMOS NAND gate?'
    ]
  },
  {
    keywords: ['pwm', 'pulse width', 'duty cycle', 'motor speed', 'led dimming', 'analogwrite'],
    beginner: `**What is Pulse Width Modulation (PWM)?**

Microcontrollers can only output **0V (OFF)** or **5V (ON)**—they cannot natively output 2.5V!

So how does a phone dim its screen or an Arduino slow down a motor?
By switching 5V ON and OFF **thousands of times per second**!
- If the signal is ON for 50% of the time and OFF for 50% of the time, the average voltage is **$50\\% \\times 5\\text{V} = 2.5\\text{V}$**.
- The percentage of time the signal is ON during each cycle is called the **Duty Cycle**.
- Because this toggles so fast (e.g., 1000 times a second), human eyes (or motor coils) only experience the smooth average!`,
    stepByStep: `**Step-by-Step PWM Mathematical Formulation:**

1. **Time Period ($T$):** Total duration of one pulse cycle:
   $$T = T_{on} + T_{off} = \\frac{1}{f}$$
2. **Duty Cycle ($D$):**
   $$D = \\frac{T_{on}}{T} \\times 100\\%$$
3. **Average Voltage ($V_{avg}$):**
   $$V_{avg} = \\frac{1}{T} \\int_{0}^{T} v(t) dt = D \\times V_{cc}$$
4. **Example:** For $V_{cc} = 12\\text{V}$ with $T_{on} = 3\\text{ms}$ and $T_{off} = 1\\text{ms}$:
   $$T = 3 + 1 = 4\\text{ms}$$
   $$D = \\frac{3}{4} = 75\\%$$
   $$V_{avg} = 0.75 \\times 12\\text{V} = 9.0\\text{V}$$`,
    troubleshoot: `**Troubleshooting PWM Motor Noise and Heating:**

- **Audible Whining / High-Pitch Noise:** If your PWM frequency is between 20Hz and 20kHz (e.g. default Arduino 490Hz or 980Hz), the motor coils physically vibrate at that frequency, creating annoying acoustic whine. Solution: Increase timer frequency above 20kHz (ultrasonic) by modifying timer prescalers.
- **MOSFET Overheating:** If your switching FET gets extremely hot, check gate drive voltage. A logic-level MOSFET (e.g., IRLZ44N) requires only 3.3V-5V gate drive, whereas a standard IRFZ44N needs 10V to fully saturate into low $R_{DS(on)}$.
- **Missing Flyback Diode:** Always connect an antiparallel Schottky diode (e.g., 1N5819) across the inductive motor load to clamp inductive kickback spikes ($V = -L \\frac{di}{dt}$).`,
    coding: `\`\`\`cpp
// Arduino Code: Smooth LED Breathing / PWM Control
const int LED_PIN = 9; // Hardware PWM pin on ATmega328P

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Fade in from 0% to 100% duty cycle
  for (int brightness = 0; brightness <= 255; brightness++) {
    analogWrite(LED_PIN, brightness); // 0 = 0V, 255 = 5V
    delay(5);
  }
  // Fade out from 100% to 0% duty cycle
  for (int brightness = 255; brightness >= 0; brightness--) {
    analogWrite(LED_PIN, brightness);
    delay(5);
  }
}
\`\`\``,
    followUps: [
      'How do I calculate an RC low-pass filter to convert PWM into a pure analog DC voltage?',
      'What is the difference between fast PWM and phase-correct PWM?',
      'Why is PWM used in Class-D audio amplifiers?'
    ]
  },
  {
    keywords: ['temperature', 'sensor', 'lm35', 'dht11', 'dht22', 'ds18b20', 'thermistor', 'debug arduino'],
    beginner: `**How do Temperature Sensors Work with Microcontrollers?**

There are two primary types of temperature sensors:
1. **Analog Sensors (like LM35):**
   - The LM35 changes its output voltage linearly with temperature: exactly **$10\\text{ mV per }^{\\circ}\\text{C}$**.
   - At $25^{\\circ}\\text{C}$, it outputs $250\\text{ mV}$ ($0.25\\text{V}$).
   - The microcontroller's Analog-to-Digital Converter (ADC) reads this voltage and converts it into a number between 0 and 1023.
2. **Digital Sensors (like DS18B20 or DHT22):**
   - They contain their own internal microchip and ADC.
   - They send the exact temperature as a digital binary message over 1 wire (Dallas 1-Wire) or I2C.`,
    stepByStep: `**Step-by-Step LM35 ADC Conversion Formula:**

1. **Read 10-bit raw ADC count:**
   $$\\text{ADC} \\in [0, 1023]$$
2. **Calculate measured input voltage:**
   $$V_{in} = \\frac{\\text{ADC} \\times V_{ref}}{1024} = \\frac{\\text{ADC} \\times 5.0\\text{V}}{1024}$$
3. **Convert voltage to temperature:**
   $$\\text{Temp}(^{\\circ}\\text{C}) = \\frac{V_{in}}{0.010\\text{ V/}^{\\circ}\\text{C}} = V_{in} \\times 100$$
4. **Combined direct calculation:**
   $$\\text{Temp}(^{\\circ}\\text{C}) = \\frac{\\text{ADC} \\times 500.0}{1024.0}$$`,
    troubleshoot: `**Troubleshooting Arduino Temperature Monitoring Code & Hardware:**

1. **Fluctuating / Erratic Readings:**
   - LM35 outputs are high impedance and very sensitive to ground bounce. Use the Arduino's internal 1.1V reference (\`analogReference(INTERNAL)\`) for 5x higher resolution (0.1°C per count) and immunity to USB 5V rail fluctuations.
2. **Pin Misalignment (Very Common!):**
   - Looking at the flat face of the TO-92 LM35 package:
     - Left pin: $+V_s$ (+4V to +20V)
     - Middle pin: $V_{out}$ (to Arduino A0)
     - Right pin: GND.
   - **Warning:** Inverting pins 1 and 3 will cause the sensor to become scalding hot instantly!
3. **Long Cable Noise:**
   - If running wire longer than 30cm, add a 1kΩ series resistor and 0.01µF capacitor at the sensor output.`,
    coding: `\`\`\`cpp
// Arduino: Precision LM35 Temperature Monitor with 1.1V Internal Reference
const int TEMP_PIN = A0;

void setup() {
  Serial.begin(9600);
  // Switch to internal 1.1V bandgap reference for superior accuracy!
  #if defined(__AVR_ATmega328P__)
    analogReference(INTERNAL);
  #endif
}

void loop() {
  // Discard first reading after reference switch
  analogRead(TEMP_PIN);
  delay(10);
  
  // Average 10 samples to eliminate noise
  float sum = 0;
  for(int i = 0; i < 10; i++) {
    sum += analogRead(TEMP_PIN);
    delay(5);
  }
  float avgAdc = sum / 10.0;
  
  // 1.1V reference: V_out = (avgAdc / 1023.0) * 1.1V
  // Temp = V_out * 100.0 (°C)
  float temperatureC = (avgAdc * 110.0) / 1023.0;
  
  Serial.print("Temperature: ");
  Serial.print(temperatureC, 2);
  Serial.println(" °C");
  delay(1000);
}
\`\`\``,
    followUps: [
      'How does a Thermistor (NTC) compare with an LM35 sensor?',
      'How do I calculate Steinhart-Hart equation coefficients for an NTC thermistor?',
      'How does the Dallas 1-Wire protocol handle multi-drop addressing?'
    ]
  },
  {
    keywords: ['ultrasonic', 'hc-sr04', 'distance', 'sound', 'sonar', 'echo', 'trigger'],
    beginner: `**How does the HC-SR04 Ultrasonic Distance Sensor Work?**

Just like a bat using echolocation!
1. **Trigger:** The microcontroller sends a short 10-microsecond digital pulse to the sensor's **TRIG pin**.
2. **Transmit:** The sensor's transmitter emits an 8-cycle sonic burst at **40 kHz** (ultrasound, inaudible to human ears).
3. **Echo:** The waves bounce off an object and return to the receiver.
4. **Time Measurement:** The sensor's **ECHO pin** stays HIGH for the exact duration of time it took for the sound wave to travel to the obstacle and bounce back.
5. Because sound travels at approximately $340\\text{ m/s}$ in dry air, we divide the time by 2 (round-trip) to calculate distance!`,
    stepByStep: `**Step-by-Step HC-SR04 Distance Mathematics:**

1. **Speed of sound in air ($20^{\\circ}\\text{C}$):**
   $$v = 343\\text{ m/s} = 0.0343\\text{ cm/}\\mu\\text{s} = \\frac{1}{29.1}\\text{ cm/}\\mu\\text{s}$$
2. **Round-trip distance:**
   $$\\text{Distance}_{total} = v \\times t_{\\mu s}$$
3. **One-way obstacle distance:**
   $$d = \\frac{v \\times t}{2} = \\frac{t_{\\mu s} \\times 0.0343}{2} = \\frac{t_{\\mu s}}{58.2}\\text{ cm}$$
4. **Example:** If echo pulse duration is $582\\,\\mu\\text{s}$:
   $$d = \\frac{582}{58.2} = 10.0\\text{ cm}$$`,
    troubleshoot: `**Troubleshooting HC-SR04 Issues:**

- **Sensor hangs or freezes code:**
  - Standard \`pulseIn(echoPin, HIGH)\` has a default timeout of 1 full second! If no echo returns (sound absorbed by fabric or reflected at angle), your loop stalls for 1000ms.
  - Solution: Specify a timeout: \`pulseIn(echoPin, HIGH, 25000)\` (25ms timeout = max ~4 meters).
- **Incompatible with 3.3V Microcontrollers (ESP32 / Raspberry Pi Pico):**
  - HC-SR04 ECHO pin outputs 5V. Connecting 5V directly to a 3.3V ESP32 GPIO can damage the chip!
  - Solution: Use a simple 2-resistor voltage divider (1kΩ and 2kΩ) on the Echo pin to drop 5V to 3.3V.`,
    coding: `\`\`\`cpp
// Arduino Code: HC-SR04 Non-blocking Distance Measure
const int TRIG_PIN = 7;
const int ECHO_PIN = 8;

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

float measureDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // 30ms timeout (corresponds to ~5 meters)
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return -1; // Out of range or no echo
  
  return duration / 58.2;
}

void loop() {
  float distance = measureDistanceCm();
  if (distance > 0) {
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
  } else {
    Serial.println("Warning: Target Out of Range");
  }
  delay(100);
}
\`\`\``,
    followUps: [
      'How does temperature variation affect the speed of sound and ultrasonic accuracy?',
      'How does LiDAR Time-of-Flight (ToF) sensors compare with ultrasonic?',
      'Show me how to filter acoustic multi-echo reflections.'
    ]
  }
];

// Fallback general response generator for any ENTC engineering query
function generateDemoResponse(prompt: string, mode: string): { content: string; followUps: string[] } {
  const p = prompt.toLowerCase();

  // Search knowledge base
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some(k => p.includes(k))) {
      let content = entry.beginner;
      if (mode === 'step-by-step') content = entry.stepByStep;
      else if (mode === 'troubleshoot') content = entry.troubleshoot;
      else if (mode === 'coding') content = entry.coding;
      return { content, followUps: entry.followUps };
    }
  }

  // Broad ENTC fallback generator
  const content = `### ENTC Engineering Analysis: "${prompt}"

**Mode: ${mode.toUpperCase()}**

In Electronics and Telecommunication Engineering, addressing this requires examining the hardware circuit model, mathematical equations, and firmware implementation:

1. **Fundamental Principle:**
   - Electronic systems operate by mapping physical quantities into electrical parameters (voltage, current, frequency, or phase).
   - In digital domains, noise margins determine stability ($V_{OH,min} - V_{IH,min}$).
   - In analog and RF domains, signal-to-noise ratio (SNR) and impedance matching ($Z_{source} = Z_{load}^*$) govern maximum power transfer.

2. **Core Mathematical Formulation:**
   $$\\text{System Response: } Y(s) = H(s) \\cdot X(s) \\quad \\text{or} \\quad V = I \\cdot Z$$

3. **Practical Engineering Guidelines:**
   - Verify power decoupling: place $0.1\\mu\\text{F}$ ceramic caps within 5mm of every IC power pin.
   - For analog telemetry, use differential signaling or shielded twisted-pair cables to reject electromagnetic interference (EMI).
   - In embedded firmware, avoid blocking delays inside interrupt service routines (ISRs).

*Tip: You can connect your live Google Gemini API key in **Profile & Settings** to enable real-time generative reasoning across custom schematics, datasheets, and code!*`;

  return {
    content,
    followUps: [
      'Explain the difference between analog and digital signals.',
      'Why does an AND gate output zero if one input is zero?',
      'How does Pulse Width Modulation (PWM) work?',
      'How do I calculate resistor values for an LED circuit?'
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

    const systemPrompt = `You are the ENTC Innovate Lab AI Tutor, a friendly, deeply knowledgeable professor and senior hardware/telecom engineer.
Your explanations are technically accurate, educational, clear, and inspiring.
Current Mode: ${mode}.
- If beginner mode: use intuitive analogies, clear language, and avoid overwhelming jargon.
- If step-by-step mode: provide structured numbered derivations, formulas, and verification steps.
- If troubleshoot mode: diagnose hardware bugs, schematic flaws, floating pins, noise, and component mismatch.
- If coding mode: provide clean, well-commented C++/Arduino, Python, or Verilog/VHDL code with explanations.
Always maintain good formatting using markdown and LaTeX where helpful.`;

    // 1. OpenAI ChatGPT provider
    if (provider === 'chatgpt' || (!provider && openaiApiKey && !geminiApiKey)) {
      const activeKey = (openaiApiKey || apiKey || '').trim();
      if (!activeKey) {
        return {
          content: `> [!NOTE]
> **OpenAI ChatGPT API key required.**
> Please enter your OpenAI API key (starts with \`sk-...\`) in the top bar or in **Settings** to chat with ChatGPT.
> 
> *Meanwhile, here is the answer from the built-in ENTC Knowledge Engine:*

` + generateDemoResponse(message, mode).content,
          suggestedFollowUps: generateDemoResponse(message, mode).followUps,
          isDemoMode: true
        };
      }

      try {
        const chatMessages = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-6).map(h => ({
            role: h.sender === 'user' ? 'user' : 'assistant',
            content: h.content
          })),
          { role: 'user', content: message }
        ];

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeKey}`
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
> **OpenAI ChatGPT API request returned an error** (${res.status}: ${errMsg}).
> Please check your OpenAI API key and usage quota in Settings.
> 
> *Providing curated answer from the offline ENTC Knowledge Engine:*

${fallback.content}`,
            suggestedFollowUps: fallback.followUps,
            isDemoMode: true
          };
        }
      } catch (err: any) {
        console.error('Error invoking OpenAI API:', err);
        const fallback = generateDemoResponse(message, mode);
        return {
          content: `> [!NOTE]
> Network error reaching OpenAI endpoint: ${err.message || 'Check internet connection'}.
> Switched to offline ENTC Knowledge Engine.

${fallback.content}`,
          suggestedFollowUps: fallback.followUps,
          isDemoMode: true
        };
      }
    }

    // 2. Google Gemini provider
    if (provider === 'gemini' || (geminiApiKey && geminiApiKey.trim().length > 10) || (apiKey && apiKey.trim().length > 10)) {
      const activeGeminiKey = (geminiApiKey || apiKey || '').trim();
      if (!activeGeminiKey) {
        return {
          content: `> [!NOTE]
> **Google Gemini API key required.**
> Please enter your Gemini API key (from Google AI Studio) in the top bar or in **Settings** to chat with Gemini.
> 
> *Meanwhile, here is the answer from the built-in ENTC Knowledge Engine:*

` + generateDemoResponse(message, mode).content,
          suggestedFollowUps: generateDemoResponse(message, mode).followUps,
          isDemoMode: true
        };
      }

      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeGeminiKey}`;
        
        const contents = [
          ...history.slice(-4).map(h => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
          })),
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nStudent Question: ${message}` }]
          }
        ];

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
          console.warn('Gemini API returned an error:', errorData);
          const fallback = generateDemoResponse(message, mode);
          return {
            content: `> [!WARNING]
> **Gemini API request failed** (${res.status}: ${errorData?.error?.message || 'Check API key or quota'}). 
> Providing curated answer from ENTC Knowledge Engine below:

${fallback.content}`,
            suggestedFollowUps: fallback.followUps,
            isDemoMode: true
          };
        }
      } catch (err: any) {
        console.error('Error invoking Gemini API:', err);
        const fallback = generateDemoResponse(message, mode);
        return {
          content: `> [!NOTE]
> Network error reaching Gemini API endpoint. Switched to offline ENTC Knowledge Engine.

${fallback.content}`,
          suggestedFollowUps: fallback.followUps,
          isDemoMode: true
        };
      }
    }

    // 3. Built-in High-Quality Educational ENTC Knowledge Engine (Demo / Offline Mode)
    await new Promise(r => setTimeout(r, 450));
    const demo = generateDemoResponse(message, mode);
    return {
      content: demo.content,
      suggestedFollowUps: demo.followUps,
      isDemoMode: true
    };
  }
};
