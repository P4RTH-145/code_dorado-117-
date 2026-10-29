import { LessonContent, SubjectCategory } from '../types';

export const LESSONS_DATA: LessonContent[] = [
  {
    id: 'logic-gates-truth-tables',
    title: 'Logic Gates & Truth Tables',
    category: 'digital-electronics',
    categoryLabel: 'Digital Electronics',
    difficulty: 'Beginner',
    durationMinutes: 18,
    description: 'Master the fundamental building blocks of digital computing: AND, OR, NOT, NAND, NOR, XOR, and XNOR gates.',
    learningObjectives: [
      'Understand binary logic representation (HIGH/1 vs LOW/0 in voltage levels)',
      'Analyze the boolean operations and truth tables of primary and universal gates',
      'Learn why NAND and NOR gates are termed universal logic gates',
      'Apply logic expressions to simplify basic combinational circuits'
    ],
    conceptExplanation: `In electronic systems, information is represented in binary format using two distinct voltage levels: logic HIGH (typically +5V in TTL or +3.3V in modern CMOS) and logic LOW (ground or 0V). 

Logic gates are electronic circuits consisting of interconnected MOSFET or bipolar junction transistors that perform Boolean algebraic operations. 

1. **AND Gate**: Yields HIGH (1) only if ALL inputs are HIGH. Expression: $Y = A \\cdot B$.
2. **OR Gate**: Yields HIGH (1) if AT LEAST ONE input is HIGH. Expression: $Y = A + B$.
3. **NOT Gate (Inverter)**: Reverses the input state. If input is 0, output is 1. Expression: $Y = \\bar{A}$.
4. **NAND Gate**: An AND gate followed by a NOT. Yields LOW only when both inputs are HIGH. This is a Universal Gate capable of constructing any other boolean function.
5. **NOR Gate**: An OR gate followed by an inverter. Yields HIGH only when all inputs are LOW. Also universal.
6. **XOR (Exclusive OR)**: Yields HIGH when inputs are different (odd parity). Used widely in full adders and parity checkers. Expression: $Y = A \\oplus B = A\\bar{B} + \\bar{A}B$.
7. **XNOR Gate**: Yields HIGH when inputs are identical (even parity). Used as an equivalence comparator.`,
    formula: {
      latex: 'Y_{XOR} = A \\cdot \\bar{B} + \\bar{A} \\cdot B',
      explanation: 'XOR produces a logic 1 exclusively when input A and B differ in state.'
    },
    visualDiagramType: 'truth-table',
    workedExample: {
      title: 'Security Door Interlock Design',
      problem: 'An industrial safety hatch must open ($Y=1$) only when either the Keycard Sensor ($A=1$) OR the Biometric Scanner ($B=1$) is verified, but NEVER if the Emergency Lockdown ($C=1$) is engaged.',
      solutionSteps: [
        'Step 1: Identify input conditions. Access allowed condition: $(A + B)$.',
        'Step 2: Emergency lockdown condition: Lockdown $C=0$ allows entry, so invert $C$: $\\bar{C}$.',
        'Step 3: Combine conditions using AND logic: $Y = (A + B) \\cdot \\bar{C}$.',
        'Step 4: Verify test vector: If $A=1$, $B=0$, $C=1$ (lockdown active), then $Y = (1 + 0) \\cdot 0 = 1 \\cdot 0 = 0$. Hatch remains safely locked!'
      ],
      result: 'Boolean Expression: Y = (A + B) · C̄'
    },
    practicalApplications: [
      'Arithmetic Logic Units (ALUs) inside microprocessors for binary addition and comparison',
      'Automotive anti-lock braking systems (ABS) input verification logic',
      'Industrial fail-safe interlocks in chemical processing plants'
    ],
    quickQuiz: {
      question: 'Which of the following gates outputs 1 if and only if both inputs are identical?',
      options: ['XOR Gate', 'XNOR Gate', 'NAND Gate', 'NOR Gate'],
      correctIndex: 1,
      explanation: 'The XNOR (Exclusive NOR) gate is an equivalence gate; its output is logic 1 when both inputs are 0 or both inputs are 1.'
    },
    xpReward: 60
  },
  {
    id: 'pulse-width-modulation-pwm',
    title: 'Pulse Width Modulation (PWM)',
    category: 'microcontrollers',
    categoryLabel: 'Microcontrollers & Embedded',
    difficulty: 'Intermediate',
    durationMinutes: 24,
    description: 'Learn how microcontrollers synthesize analog voltage levels from digital square waves to control motor speed, LED brightness, and power converters.',
    learningObjectives: [
      'Understand the principles of Duty Cycle and Switching Frequency',
      'Calculate average output voltage ($V_{avg} = D \\times V_{cc}$)',
      'Distinguish hardware PWM timers from software-bit-banging PWM',
      'Analyze low-pass RC filter circuits used to reconstruct smooth analog signals'
    ],
    conceptExplanation: `Most modern microcontrollers (such as ESP32, STM32, and AVR ATmega328P) are purely digital devices; they cannot naturally output a true continuous analog voltage such as 2.35V without an integrated Digital-to-Analog Converter (DAC).

Instead, they employ **Pulse Width Modulation (PWM)**. PWM generates a high-frequency digital square wave that rapidly toggles between 0V and $V_{cc}$ (e.g., 5V). 

By varying the fraction of time the signal stays HIGH during each cycle—known as the **Duty Cycle ($D$)**—the average voltage delivered to the electrical load can be smoothly and accurately varied.

**Duty Cycle Definition:**
$$D = \\frac{T_{on}}{T} = \\frac{T_{on}}{T_{on} + T_{off}} \\times 100\\%$$

**Average Voltage:**
$$V_{avg} = D \\times V_{cc}$$

Because the switching happens faster than the response time of the load (e.g. thermal inertia of an LED or mechanical inertia of an electric DC motor rotor), the device perceives the average voltage rather than the rapid switching pulses.`,
    formula: {
      latex: 'V_{avg} = \\left(\\frac{T_{on}}{T_{period}}\\right) \\times V_{cc}',
      explanation: 'Average output voltage is directly proportional to the duty cycle ratio multiplied by supply voltage.'
    },
    visualDiagramType: 'waveform-pwm',
    workedExample: {
      title: 'DC Motor Speed Control Calculation',
      problem: 'An Arduino UNO running on 5V powers a 5V DC motor driver with an 8-bit PWM timer (analogWrite values from 0 to 255). What PWM register value should be set to supply an average voltage of 3.2V to the motor?',
      solutionSteps: [
        'Step 1: Calculate the required Duty Cycle: D = V_avg / V_cc = 3.2V / 5.0V = 0.64 (64%).',
        'Step 2: Determine register resolution. An 8-bit timer ranges from 0 to 255 (2^8 - 1 = 255).',
        'Step 3: Multiply duty cycle by maximum counter value: Value = 0.64 × 255 = 163.2.',
        'Step 4: Round to nearest integer: analogWrite(motorPin, 163).'
      ],
      result: 'PWM Register Value = 163 (Duty Cycle = 64%, V_avg = 3.2V)'
    },
    practicalApplications: [
      'LED Dimming without color temperature shifting (used in architectural and studio lighting)',
      'Variable speed control for electric vehicle BLDC and brushed DC motors',
      'Switch-mode power supplies (SMPS) and buck/boost voltage regulators'
    ],
    quickQuiz: {
      question: 'If a 12V PWM signal has an ON time of 3ms and an OFF time of 1ms, what is the average output voltage?',
      options: ['6V', '8V', '9V', '10V'],
      correctIndex: 2,
      explanation: 'Total period T = 3ms + 1ms = 4ms. Duty Cycle D = 3ms / 4ms = 0.75 (75%). Average voltage = 0.75 × 12V = 9.0V.'
    },
    xpReward: 75
  },
  {
    id: 'temperature-sensors-microcontrollers',
    title: 'Temperature Sensors & Microcontrollers',
    category: 'sensors-instrumentation',
    categoryLabel: 'Sensors & Instrumentation',
    difficulty: 'Intermediate',
    durationMinutes: 22,
    description: 'Interface analog sensors (LM35/TMP36) and digital sensors (DS18B20/DHT22) with microcontrollers using ADC conversion and SPI/I2C/1-Wire protocols.',
    learningObjectives: [
      'Understand thermoelectric principles (Seebeck effect, RTD resistance curves, silicon bandgap)',
      'Analyze Analog-to-Digital Converter (ADC) quantization steps ($V_{res} = V_{ref} / 2^N$)',
      'Interface the analog LM35 precision Celsius sensor to an ADC input',
      'Write sensor linearization and noise-filtering algorithms in embedded C/C++'
    ],
    conceptExplanation: `Temperature measurement is critical across industrial automation, telecommunication base stations, and aerospace avionics.

**1. Analog Temperature Sensors (e.g., LM35, TMP36):**
The LM35 produces an analog output voltage linearly proportional to the Celsius temperature, with a scale factor of $10\\text{ mV/}^{\\circ}\\text{C}$.
- At $0^{\\circ}\\text{C}$: Output is $0\\text{ mV}$
- At $25^{\\circ}\\text{C}$: Output is $250\\text{ mV} = 0.250\\text{V}$
- At $100^{\\circ}\\text{C}$: Output is $1000\\text{ mV} = 1.000\\text{V}$

**2. ADC Quantization & Resolution:**
When connected to a 10-bit ADC with $V_{ref} = 5.0\\text{V}$, the voltage per ADC step is:
$$\\text{Resolution} = \\frac{V_{ref}}{2^{10} - 1} = \\frac{5.0\\text{V}}{1023} \\approx 4.887\\text{ mV/step}$$

**3. Digital Temperature Sensors (e.g., DS18B20, DHT22):**
Digital sensors integrate the thermistor, an internal ADC, and a communication controller on silicon. The DS18B20 communicates over Dallas 1-Wire protocol, allowing dozens of sensors to share a single micro-pin with 12-bit temperature resolution ($0.0625^{\\circ}\\text{C}$).`,
    formula: {
      latex: 'T(^{\\circ}\\text{C}) = \\frac{\\text{ADC\\_Reading} \\times \\left(\\frac{V_{ref}}{1023}\\right)}{0.010\\text{ V/}^{\\circ}\\text{C}}',
      explanation: 'Calculates degrees Celsius from a 10-bit ADC reading connected to an LM35 sensor.'
    },
    visualDiagramType: 'sensor-pinout',
    workedExample: {
      title: 'ADC Value to Temperature Conversion',
      problem: 'An Arduino UNO ADC (10-bit, 5V reference) reads a raw integer value of 61 from an LM35 sensor pin. Calculate the measured temperature in degrees Celsius.',
      solutionSteps: [
        'Step 1: Calculate the voltage read at the analog pin: V_pin = (61 / 1023) × 5.0V = 0.059628 × 5.0V ≈ 0.2981V (298.1 mV).',
        'Step 2: Apply the LM35 transfer coefficient of 10 mV/°C: Temp = 298.1 mV / (10 mV/°C) = 29.81°C.',
        'Step 3: Verification: At 29.81°C, LM35 generates ~298mV. 298mV / 4.887mV per LSB = 60.98 -> 61 ADC counts.'
      ],
      result: 'Calculated Temperature: 29.8°C'
    },
    practicalApplications: [
      'Thermal throttling in smartphone CPUs and high-power RF power amplifiers',
      'Cold-chain vaccine refrigeration monitoring with cellular IoT telemetry',
      'Automotive engine coolant temperature sensors (ECT) for fuel injection tuning'
    ],
    quickQuiz: {
      question: 'What voltage does an LM35 sensor output when the ambient temperature is 45°C?',
      options: ['0.045V (45mV)', '0.450V (450mV)', '4.500V (4500mV)', '1.450V (1450mV)'],
      correctIndex: 1,
      explanation: 'Because LM35 has a scale factor of 10 mV/°C, at 45°C the output is 45 × 10 mV = 450 mV = 0.45 V.'
    },
    xpReward: 70
  },
  {
    id: 'op-amp-fundamentals',
    title: 'Operational Amplifiers (Op-Amps)',
    category: 'analog-electronics',
    categoryLabel: 'Analog Electronics',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    description: 'Explore the universal analog building block: inverting, non-inverting, summing amplifiers, and voltage followers.',
    learningObjectives: [
      'Understand the ideal Op-Amp golden rules ($V_+ = V_-$, $I_{in} = 0$)',
      'Derive closed-loop gain for inverting and non-inverting configurations',
      'Calculate virtual ground and bandwidth-gain product trade-offs',
      'Analyze active RC filters for noise attenuation'
    ],
    conceptExplanation: `The Operational Amplifier (Op-Amp) is an active high-gain differential voltage amplifier. In linear feedback configurations, we analyze circuits using two fundamental Golden Rules:

1. **Virtual Short ($V_+ = V_-$)**: Negative feedback forces the differential voltage between the non-inverting and inverting terminals to zero.
2. **Infinite Input Impedance ($I_+ = I_- = 0$)**: No current flows into or out of the amplifier's input terminals.

**Configurations:**
- **Inverting Amplifier:** Gain $A_v = -\\frac{R_f}{R_{in}}$. The input voltage is amplified and phase-shifted by 180°.
- **Non-Inverting Amplifier:** Gain $A_v = 1 + \\frac{R_f}{R_1}$. The output is in-phase with the input.
- **Voltage Follower (Buffer):** Gain $A_v = 1$. Provides high input impedance to prevent signal source loading.`,
    formula: {
      latex: 'A_v = -\\frac{R_f}{R_{in}} \\quad \\text{and} \\quad A_v = 1 + \\frac{R_f}{R_1}',
      explanation: 'Formulas for inverting and non-inverting closed-loop gains respectively.'
    },
    visualDiagramType: 'circuit-diagram',
    workedExample: {
      title: 'Inverting Amplifier Design',
      problem: 'Design an inverting amplifier with a voltage gain of -10. You have an input resistor R_in = 10 kΩ. What feedback resistor R_f is required?',
      solutionSteps: [
        'Step 1: Write gain formula: A_v = - (R_f / R_in).',
        'Step 2: Substitute values: -10 = - (R_f / 10,000 Ω).',
        'Step 3: Solve for R_f: R_f = 10 × 10,000 Ω = 100,000 Ω = 100 kΩ.'
      ],
      result: 'Feedback Resistor R_f = 100 kΩ'
    },
    practicalApplications: [
      'Preamplifiers for microphones and piezoelectric acoustic sensors',
      'Analog active audio equalizers and crossover networks',
      'Medical ECG and EEG biopotential signal conditioning'
    ],
    quickQuiz: {
      question: 'What is the voltage gain of a unity-gain buffer (voltage follower)?',
      options: ['0', '1', '10', 'Infinite'],
      correctIndex: 1,
      explanation: 'A voltage follower has a feedback connection from output to inverting terminal with no resistor, yielding Av = 1 with high input impedance and low output impedance.'
    },
    xpReward: 65
  },
  {
    id: 'am-fm-modulation',
    title: 'Analog Modulation: AM vs FM',
    category: 'communication-systems',
    categoryLabel: 'Communication Systems',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    description: 'Understand carrier frequencies, amplitude modulation (AM), and frequency modulation (FM) in telecommunication channels.',
    learningObjectives: [
      'Understand why high-frequency carrier modulation is essential for wireless antenna transmission',
      'Analyze Amplitude Modulation index ($m = A_m / A_c$) and spectral sidebands',
      'Compare bandwidth and noise immunity of FM versus AM',
      'Calculate transmission bandwidth using Carson\'s Rule'
    ],
    conceptExplanation: `Baseband audio signals (20Hz - 20kHz) cannot be efficiently radiated directly through the air because electromagnetic antennas require physical lengths comparable to the wavelength ($\\lambda = c/f$). A 1 kHz audio signal would require a 75-kilometer tall antenna!

Modulation superimposes the low-frequency information signal $m(t)$ onto a high-frequency sinusoidal carrier signal $c(t) = A_c \\cos(2\\pi f_c t)$.

1. **Amplitude Modulation (AM):**
The instantaneous amplitude of the carrier wave varies in direct proportion to the modulating signal.
- Modulation Index: $m = \\frac{A_m}{A_c}$. If $m > 1$, overmodulation occurs, causing severe harmonic distortion.
- AM Bandwidth: $BW = 2 f_m$.
- Disadvantage: Atmospheric static and RF noise affect signal amplitude directly, causing hiss and interference.

2. **Frequency Modulation (FM):**
The instantaneous frequency of the carrier is shifted according to the modulating signal while carrier amplitude remains constant.
- Bandwidth (Carson's Rule): $BW \\approx 2(\\Delta f + f_m)$.
- Advantage: Superb noise immunity, as amplitude noise can be clipped off by limiters before demodulation.`,
    formula: {
      latex: 'BW_{FM} = 2(\\Delta f + f_m) = 2 f_m(\\beta + 1)',
      explanation: 'Carson\'s rule for estimating transmission bandwidth of an FM signal.'
    },
    visualDiagramType: 'waveform-pwm',
    workedExample: {
      title: 'FM Broadcast Bandwidth Estimation',
      problem: 'A commercial FM station broadcasts with a maximum frequency deviation Δf of 75 kHz and a maximum audio modulating frequency f_m of 15 kHz. Determine the required channel bandwidth using Carson\'s Rule.',
      solutionSteps: [
        'Step 1: Calculate modulation index: β = Δf / f_m = 75 kHz / 15 kHz = 5.',
        'Step 2: Apply Carson\'s rule: BW = 2 × (Δf + f_m).',
        'Step 3: Substitute: BW = 2 × (75 kHz + 15 kHz) = 2 × 90 kHz = 180 kHz.',
        'Step 4: Standard commercial FM channels are allocated 200 kHz slots (including 20 kHz guard bands) to prevent adjacent-channel interference.'
      ],
      result: 'Required Bandwidth = 180 kHz (Allocated: 200 kHz)'
    },
    practicalApplications: [
      'Commercial broadcast radio (VHF band 88 - 108 MHz)',
      'Aviation VHF voice communications (AM used to prevent capture effect in emergency overlaps)',
      'Analog telemetry downlinks in sounding rockets and marine buoys'
    ],
    quickQuiz: {
      question: 'Why does FM offer significantly higher audio fidelity and noise immunity compared to AM?',
      options: [
        'FM uses shorter wires in antennas',
        'Noise primarily corrupts amplitude, which FM limiters easily remove',
        'FM requires zero bandwidth',
        'AM only operates at nighttime'
      ],
      correctIndex: 1,
      explanation: 'Atmospheric and electrical noise manifests as random amplitude spikes. Since FM carries information solely in frequency variations, receiver limiter circuits strip away amplitude fluctuations without losing any audio signal.'
    },
    xpReward: 70
  },
  {
    id: 'fourier-transform-dsp',
    title: 'Discrete Fourier Transform (DFT & FFT)',
    category: 'signal-processing',
    categoryLabel: 'Digital Signal Processing',
    difficulty: 'Advanced',
    durationMinutes: 28,
    description: 'Transform time-domain sampled signals into frequency-domain spectrums to analyze harmonics, filter noise, and process telecommunication data.',
    learningObjectives: [
      'Understand time-frequency duality in continuous and discrete domains',
      'Analyze the Nyquist-Shannon sampling theorem ($f_s \\ge 2 f_{max}$)',
      'Understand the Fast Fourier Transform (FFT) Cooley-Tukey algorithm complexity reduction from $O(N^2)$ to $O(N \\log N)$',
      'Interpret magnitude and phase frequency spectrum plots'
    ],
    conceptExplanation: `Any real-world analog or digital signal—whether a speech recording, radar echo, or electrocardiogram—can be decomposed into an infinite sum of harmonically related sinusoidal components.

The **Discrete Fourier Transform (DFT)** maps $N$ evenly spaced samples of a discrete-time signal $x[n]$ into $N$ complex frequency coefficients $X[k]$:
$$X[k] = \\sum_{n=0}^{N-1} x[n] \\cdot e^{-j 2\\pi k n / N}$$

**Computational Revolution: Fast Fourier Transform (FFT)**
A naive direct calculation of the DFT requires $N^2$ complex multiplications. For $N = 1024$ samples, this requires over 1,000,000 multiplications!
The Cooley-Tukey FFT algorithm recursively splits even and odd indices (decimation-in-time), reducing complexity to $\\frac{N}{2} \\log_2 N$, requiring only ~5,120 multiplications—a 200x speedup that enables real-time 5G, Wi-Fi 6 OFDM, and MP3 compression.`,
    formula: {
      latex: 'X[k] = \\sum_{n=0}^{N-1} x[n] \\cdot W_N^{kn}, \\quad W_N = e^{-j\\frac{2\\pi}{N}}',
      explanation: 'Discrete Fourier Transform where W_N is the twiddle factor representing complex roots of unity.'
    },
    visualDiagramType: 'waveform-pwm',
    workedExample: {
      title: 'Nyquist Rate & Anti-Aliasing Filter',
      problem: 'An audio engineer wants to digitize acoustic music containing frequency components up to 22.05 kHz. What is the minimum theoretical sampling rate, and why does CD Audio use 44.1 kHz?',
      solutionSteps: [
        'Step 1: Apply Nyquist-Shannon criterion: f_s > 2 × f_max.',
        'Step 2: Calculate minimum sampling rate: f_s > 2 × 22,050 Hz = 44,100 Hz (44.1 kHz).',
        'Step 3: Why 44.1 kHz? It allows a small transition guard band (from 20 kHz to 22.05 kHz) for practical analog anti-aliasing low-pass filters to roll off without distorting the audible band.'
      ],
      result: 'Minimum Nyquist Sampling Rate: 44.1 kHz'
    },
    practicalApplications: [
      'OFDM subcarrier demodulation in 4G LTE, 5G NR, and Wi-Fi 6',
      'Digital speech recognition and acoustic acoustic noise cancellation',
      'Spectrum analyzers and RF software-defined radios (SDR)'
    ],
    quickQuiz: {
      question: 'What is the algorithmic computational complexity of an N-point Fast Fourier Transform (FFT)?',
      options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'],
      correctIndex: 1,
      explanation: 'Cooley-Tukey FFT algorithm divides the DFT problem recursively into sub-problems, achieving O(N log N) computational complexity compared to O(N²) for direct DFT.'
    },
    xpReward: 80
  },
  {
    id: 'mqtt-iot-protocols',
    title: 'MQTT & Wireless IoT Architectures',
    category: 'iot',
    categoryLabel: 'Internet of Things (IoT)',
    difficulty: 'Intermediate',
    durationMinutes: 20,
    description: 'Learn the lightweight publish/subscribe messaging protocol powering connected sensors, smart cities, and edge computing.',
    learningObjectives: [
      'Compare Publish/Subscribe model with traditional HTTP Request/Response',
      'Understand MQTT Brokers, Topics, Payloads, and Wildcards (+ and #)',
      'Analyze the three MQTT Quality of Service (QoS) levels: QoS 0, 1, and 2',
      'Implement battery-efficient Keep-Alive and Last Will and Testament (LWT) features'
    ],
    conceptExplanation: `Traditional web communication uses HTTP/HTTPS, which relies on a client-server request-response paradigm. For battery-constrained remote microcontrollers transmitting telemetry over lossy cellular or satellite links, HTTP introduces massive overhead (verbose headers, repeated TCP handshakes, polling latency).

**MQTT (Message Queuing Telemetry Transport)** is a lightweight binary publish-subscribe protocol created specifically for resource-constrained embedded nodes.

**Key Concepts:**
1. **MQTT Broker:** A central server (e.g. Mosquitto, EMQX, HiveMQ) that receives all messages and routes them to interested clients.
2. **Topics:** Hierarchical UTF-8 strings such as \`factory/line1/temp\` or \`home/kitchen/light\`.
3. **Publishers & Subscribers:** Nodes never connect directly to each other. Sensor nodes publish to a topic; dashboards subscribe to that topic.
4. **QoS Levels:**
   - **QoS 0 (At most once):** Fire-and-forget, zero packet confirmation. Fast, lowest overhead.
   - **QoS 1 (At least once):** Message is acknowledged; guarantees arrival but duplicates can occur.
   - **QoS 2 (Exactly once):** Four-step handshake ensuring neither loss nor duplicate delivery. Ideal for billing or safety triggers.`,
    formula: {
      latex: '\\text{Header Overhead: MQTT (2 bytes)} \\ll \\text{HTTP (approx 500+ bytes)}',
      explanation: 'MQTT fixed header is only 2 bytes, reducing cellular data costs by up to 90% for edge sensors.'
    },
    visualDiagramType: 'sensor-pinout',
    workedExample: {
      title: 'Topic Wildcard Subscription',
      problem: 'A smart city gateway wants to receive all temperature and humidity data from all sensors in Building 4. Design the MQTT topic filter.',
      solutionSteps: [
        'Step 1: Standard sensor publish path: building4/{floor}/{room}/{sensor_type}.',
        'Step 2: Single-level wildcard (+) matches one level. Multi-level wildcard (#) matches all child levels.',
        'Step 3: To listen to everything in building 4: "building4/#".',
        'Step 4: To listen to only temperature sensors across any floor and room: "building4/+/+/temperature".'
      ],
      result: 'Topic Filter: building4/+/+/temperature'
    },
    practicalApplications: [
      'Smart electrical grid smart meter automated reporting',
      'Connected vehicle telemetry (Tesla, BMW telematics)',
      'Agricultural soil moisture monitoring networks'
    ],
    quickQuiz: {
      question: 'Which MQTT Quality of Service (QoS) level guarantees that a message is delivered exactly once without duplicates?',
      options: ['QoS 0', 'QoS 1', 'QoS 2', 'QoS 3'],
      correctIndex: 2,
      explanation: 'QoS 2 provides the highest reliability using a 4-step handshake (PUBLISH, PUBREC, PUBREL, PUBCOMP) to guarantee exactly-once delivery.'
    },
    xpReward: 65
  },
  {
    id: 'tinyml-edge-ai',
    title: 'TinyML: Machine Learning on Microcontrollers',
    category: 'ai-ml',
    categoryLabel: 'AI & Machine Learning',
    difficulty: 'Advanced',
    durationMinutes: 26,
    description: 'Deploy quantized neural networks onto ultra-low-power ARM Cortex-M microcontrollers for real-time anomaly detection and voice recognition.',
    learningObjectives: [
      'Understand the edge computing paradigm vs cloud AI inference',
      'Analyze neural network model quantization (FP32 to INT8 weights)',
      'Learn how TensorFlow Lite for Microcontrollers (TFLM) runs without an OS',
      'Design vibration anomaly detection pipelines for predictive maintenance'
    ],
    conceptExplanation: `Cloud-based Artificial Intelligence models require broadband internet connectivity, introduce round-trip latency (100ms+), and consume significant power. 

**TinyML (Tiny Machine Learning)** enables machine learning models to run directly on microcontrollers consuming milliwatts of power with memory constraints as tight as 64KB RAM and 256KB Flash memory!

**Core Optimization Techniques:**
1. **Post-Training Quantization:** Floating point weights (32-bit floats) are converted to 8-bit integers (INT8). This reduces model storage by 75% and allows arithmetic to execute on rapid single-cycle integer DSP hardware instructions.
2. **Pruning:** Removing redundant synaptic weights whose magnitude is near zero without degrading model accuracy.
3. **Tensor Arena Memory Management:** All working scratch memory is pre-allocated in a single static memory buffer, preventing dynamic heap memory allocation (\`malloc\`) crashes on embedded silicon.`,
    formula: {
      latex: 'q = \\text{round}\\left(\\frac{r}{S}\\right) + Z',
      explanation: 'Quantization equation mapping continuous real value r to 8-bit integer q with scale S and zero-point Z.'
    },
    visualDiagramType: 'sensor-pinout',
    workedExample: {
      title: 'Model Memory Footprint Calculation',
      problem: 'A convolutional neural network for keyword spotting has 120,000 parameters. Compare its flash storage requirement in standard 32-bit floating point format versus 8-bit quantized format.',
      solutionSteps: [
        'Step 1: 32-bit float = 4 bytes per parameter.',
        'Step 2: Unquantized size = 120,000 × 4 bytes = 480,000 bytes = 480 kB.',
        'Step 3: 8-bit integer = 1 byte per parameter.',
        'Step 4: Quantized size = 120,000 × 1 byte = 120,000 bytes = 120 kB.',
        'Step 5: The quantized model now comfortably fits on an inexpensive ARM Cortex-M4 microcontroller with 256 kB Flash!'
      ],
      result: 'Storage reduced from 480 kB to 120 kB (75% savings)'
    },
    practicalApplications: [
      'Always-on voice keyword activation ("Hey Siri", "Ok Google") consuming < 1mW',
      'Industrial motor bearing vibration anomaly detection before catastrophic breakdown',
      'Wearable health trackers detecting cardiac arrhythmias in real time'
    ],
    quickQuiz: {
      question: 'What is the primary benefit of INT8 quantization in TinyML?',
      options: [
        'It increases the clock frequency of the CPU',
        'It reduces model size by ~75% and accelerates execution on microcontrollers',
        'It makes the model require an internet connection',
        'It doubles the precision of floating point math'
      ],
      correctIndex: 1,
      explanation: 'Quantization converts 32-bit float parameters to 8-bit integers, slashing memory requirements by 75% and allowing lightning-fast fixed-point execution on microcontrollers.'
    },
    xpReward: 85
  }
];

export const CATEGORIES_META: { id: SubjectCategory; label: string; icon: string; count: number; color: string }[] = [
  { id: 'digital-electronics', label: 'Digital Electronics', icon: 'Cpu', count: 1, color: 'from-cyan-500 to-blue-600' },
  { id: 'analog-electronics', label: 'Analog Electronics', icon: 'Activity', count: 1, color: 'from-emerald-500 to-teal-600' },
  { id: 'communication-systems', label: 'Communication Systems', icon: 'Radio', count: 1, color: 'from-blue-500 to-indigo-600' },
  { id: 'microcontrollers', label: 'Microcontrollers & Embedded', icon: 'Terminal', count: 1, color: 'from-violet-500 to-purple-600' },
  { id: 'sensors-instrumentation', label: 'Sensors & Instrumentation', icon: 'Thermometer', count: 1, color: 'from-amber-500 to-orange-600' },
  { id: 'signal-processing', label: 'Digital Signal Processing', icon: 'Sliders', count: 1, color: 'from-pink-500 to-rose-600' },
  { id: 'iot', label: 'Internet of Things (IoT)', icon: 'Wifi', count: 1, color: 'from-teal-500 to-emerald-600' },
  { id: 'ai-ml', label: 'AI & Machine Learning in ENTC', icon: 'Sparkles', count: 1, color: 'from-purple-500 to-cyan-500' }
];

