import { Category, Lesson } from '../types';

export const categoriesData: Category[] = [
  {
    id: 'digital-electronics',
    title: 'Digital Electronics',
    description: 'Boolean logic, combinational & sequential circuit design, flip-flops, and counters.',
    icon: 'Cpu',
    color: '#00F0FF',
    lessonCount: 6,
    completedCount: 2
  },
  {
    id: 'analog-electronics',
    title: 'Analog Electronics',
    description: 'BJT, MOSFET amplifiers, Operational Amplifiers (Op-Amps), filters, and oscillators.',
    icon: 'Activity',
    color: '#3B82F6',
    lessonCount: 5,
    completedCount: 1
  },
  {
    id: 'communication-systems',
    title: 'Communication Systems',
    description: 'AM/FM Modulation, Digital modulation (QPSK, QAM), RF transmission, and Antennas.',
    icon: 'Radio',
    color: '#8B5CF6',
    lessonCount: 6,
    completedCount: 0
  },
  {
    id: 'embedded-systems',
    title: 'Microcontrollers & Embedded',
    description: 'ARM Cortex, Arduino, ESP32, Timers, Interrupts, I2C, SPI, and UART protocols.',
    icon: 'Binary',
    color: '#EC4899',
    lessonCount: 7,
    completedCount: 1
  },
  {
    id: 'sensors-instrumentation',
    title: 'Sensors & Instrumentation',
    description: 'Transducers, Signal Conditioning, ADC/DAC converters, and industrial measurement.',
    icon: 'Gauge',
    color: '#10B981',
    lessonCount: 5,
    completedCount: 1
  },
  {
    id: 'dsp',
    title: 'Digital Signal Processing',
    description: 'Discrete Fourier Transform (DFT/FFT), FIR/IIR filter design, and spectral analysis.',
    icon: 'Waveform',
    color: '#F59E0B',
    lessonCount: 5,
    completedCount: 0
  },
  {
    id: 'iot',
    title: 'Internet of Things (IoT)',
    description: 'MQTT, CoAP protocols, cloud integration, smart telemetry, and wireless sensor networks.',
    icon: 'Wifi',
    color: '#06B6D4',
    lessonCount: 4,
    completedCount: 0
  },
  {
    id: 'ai-ml-hardware',
    title: 'AI & Edge Machine Learning',
    description: 'TinyML on microcontrollers, neural network inference acceleration on Edge TPU/FPGA.',
    icon: 'Sparkles',
    color: '#A855F7',
    lessonCount: 4,
    completedCount: 0
  }
];

export const lessonsData: Lesson[] = [
  {
    id: 'lesson-logic-gates',
    categoryId: 'digital-electronics',
    title: 'Logic Gates and Truth Tables',
    difficulty: 'Beginner',
    durationMinutes: 20,
    overview: 'Logic gates form the foundational elementary building blocks of all digital computing systems and integrated circuits. This lesson explores fundamental Boolean operators, truth tables, and physical gate behavior.',
    objectives: [
      'Understand the fundamental behavior of AND, OR, NOT, NAND, NOR, XOR, and XNOR gates.',
      'Construct and analyze Boolean truth tables for combinational systems.',
      'Explain universal logic gates and de Morgan theorems.',
      'Implement binary decision circuits in practical digital hardware.'
    ],
    formulas: [
      {
        label: 'AND Operation',
        formula: 'Y = A · B',
        description: 'Output is HIGH (1) if and only if both inputs A and B are HIGH.'
      },
      {
        label: 'OR Operation',
        formula: 'Y = A + B',
        description: 'Output is HIGH if at least one input (A or B) is HIGH.'
      },
      {
        label: 'XOR (Exclusive OR)',
        formula: 'Y = A ⊕ B = A·B̄ + Ā·B',
        description: 'Output is HIGH when inputs differ; essential for binary adders.'
      },
      {
        label: "De Morgan's First Law",
        formula: '¬(A · B) = ¬A + ¬B',
        description: 'The complement of a product of variables equals the sum of their individual complements.'
      }
    ],
    workedExample: {
      problem: 'A security system activates an alarm (Output Y = 1) if a window sensor (W = 1) AND a motion detector (M = 1) trigger simultaneously, OR if an emergency manual toggle (E = 1) is pressed. Write the Boolean equation and find the output when W = 1, M = 0, and E = 1.',
      solution: '1. Formulate the Boolean expression: Y = (W · M) + E\n2. Substitute the given values: Y = (1 · 0) + 1\n3. Calculate inner AND: 1 · 0 = 0\n4. Calculate final OR: 0 + 1 = 1\nResult: The alarm will activate (Y = 1) because the manual emergency override is HIGH.'
    },
    diagramType: 'logic',
    contentSections: [
      {
        title: '1. What are Digital Logic Gates?',
        body: 'A logic gate is an idealized or physical electronic device implementing a Boolean function; that is, it performs a logical operation on one or more binary inputs and produces a single binary output. In CMOS logic, voltages near 0V represent binary 0 (LOW), while voltages near 3.3V or 5V represent binary 1 (HIGH).'
      },
      {
        title: '2. The Universal Gates: NAND and NOR',
        body: 'NAND and NOR gates are termed universal gates because any combinational logic function (including AND, OR, Inverters, Multiplexers, and Adders) can be realized entirely using only NAND or only NOR gates. This makes CMOS fabrication significantly more cost-efficient and standardized.'
      },
      {
        title: '3. Propagation Delay & Fan-Out',
        body: 'In real-world semiconductor devices, gates do not switch instantaneously. Propagation delay (tpd) represents the nanosecond latency between an input transition and the corresponding output transition. Designers must account for clock skew and race conditions in high-frequency circuits.'
      }
    ],
    practicalApplications: [
      'Microprocessor Arithmetic Logic Units (ALUs) and hardware adders.',
      'Safety interlock systems in industrial robotic arms and power grids.',
      'Parity bit generators and error detection checkers in telecommunication modems.',
      'Address decoding in microcontroller memory buses.'
    ],
    knowledgeCheck: {
      question: 'Which of the following gates outputs a binary 1 ONLY when an odd number of inputs are 1?',
      options: ['AND Gate', 'NAND Gate', 'XOR Gate', 'NOR Gate'],
      correctIndex: 2,
      explanation: 'The Exclusive OR (XOR) gate produces a HIGH (1) output when the number of true inputs is odd (for 2 inputs: (0,1) and (1,0)).'
    },
    completed: true
  },
  {
    id: 'lesson-pwm',
    categoryId: 'embedded-systems',
    title: 'Pulse Width Modulation (PWM)',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    overview: 'Pulse Width Modulation is a powerful technique for controlling analog circuits and actuators using a digital output pin. It allows microcontrollers to control motor speed, LED brightness, and power converters with extreme efficiency.',
    objectives: [
      'Differentiate between digital ON/OFF signals and effective analog average voltages.',
      'Calculate Duty Cycle and average DC output voltage.',
      'Understand PWM carrier frequency and its impact on inductive motor loads.',
      'Write timer-based PWM control code for microcontrollers like ATmega328P and ESP32.'
    ],
    formulas: [
      {
        label: 'Duty Cycle Equation',
        formula: 'D = (T_on / T_period) × 100%',
        description: 'Ratio of signal ON time to total cycle period expressed as a percentage.'
      },
      {
        label: 'Effective Average Voltage',
        formula: 'V_avg = D × V_peak',
        description: 'The average voltage delivered to the load proportional to duty cycle.'
      },
      {
        label: 'PWM Frequency',
        formula: 'f_pwm = 1 / T_period',
        description: 'Number of full modulation cycles completed per second.'
      }
    ],
    workedExample: {
      problem: 'An Arduino UNO running at 5V generates a PWM signal with an 8-bit timer register set to OCR0A = 64 (out of 255). Calculate the Duty Cycle percentage and the effective average output voltage delivered to a DC motor.',
      solution: '1. Calculate Duty Cycle: D = (64 / 255) ≈ 0.2509 (25.1%)\n2. Calculate Average Output Voltage: V_avg = D × V_peak\n3. V_avg = 0.251 × 5.0V = 1.255 Volts\nResult: The motor receives an effective 1.25V, causing it to spin at approximately 25% of its maximum rated speed.'
    },
    diagramType: 'pwm',
    contentSections: [
      {
        title: '1. Why Modulate Pulse Widths?',
        body: 'Linear regulation (like using a variable resistor or linear voltage regulator) drops excess voltage as wasted thermal heat. PWM switches transistors fully ON (near-zero resistance) or fully OFF (zero current), yielding efficiency ratings often above 92%.'
      },
      {
        title: '2. Low-Pass Filtering for True Analog Waveforms',
        body: 'By passing a high-frequency PWM signal through an RC low-pass filter (resistor + capacitor), the high-frequency switching harmonics are smoothed out, producing a smooth, true DC analog voltage without needing expensive DAC chips.'
      },
      {
        title: '3. Choosing Carrier Frequency',
        body: 'For audio amplifiers (Class-D), PWM frequencies exceed 200 kHz to prevent audible buzzing. For DC motor drives, frequencies between 10 kHz and 25 kHz are standard to reduce acoustic motor noise while minimizing MOSFET switching losses.'
      }
    ],
    practicalApplications: [
      'Variable speed control for electric vehicle (EV) brushless DC traction motors.',
      'High-efficiency LED lighting and smartphone display brightness backlight controllers.',
      'Buck and Boost switched-mode power supplies (SMPS) for computer motherboards.',
      'Class-D high-fidelity audio power amplifiers.'
    ],
    knowledgeCheck: {
      question: 'If a 12V supply is driven with a PWM signal having a 40% duty cycle, what is the theoretical average DC voltage across the load?',
      options: ['2.4 V', '4.8 V', '6.0 V', '9.6 V'],
      correctIndex: 1,
      explanation: 'V_avg = Duty Cycle × V_peak = 0.40 × 12V = 4.8 Volts.'
    },
    completed: true
  },
  {
    id: 'lesson-temp-sensors',
    categoryId: 'sensors-instrumentation',
    title: 'Temperature Sensors & Microcontrollers',
    difficulty: 'Intermediate',
    durationMinutes: 30,
    overview: 'Learn how physical thermal phenomena are converted into electrical quantities and digitized through Analog-to-Digital Converters (ADCs). Compares NTC thermistors, RTDs, thermocouples, and precision ICs.',
    objectives: [
      'Compare thermistors (NTC/PTC), RTDs (PT100), thermocouples, and semiconductor sensors (LM35/DS18B20).',
      'Understand voltage divider signal conditioning circuits for resistive sensors.',
      'Calculate ADC resolution, quantization step size (LSB), and voltage-to-temperature conversion.',
      'Implement calibration curves and threshold alerting logic in firmware.'
    ],
    formulas: [
      {
        label: 'ADC Quantization Step (LSB)',
        formula: 'V_LSB = V_ref / (2^N - 1)',
        description: 'Smallest detectable voltage change for an N-bit analog-to-digital converter.'
      },
      {
        label: 'Voltage Divider Output',
        formula: 'V_out = V_in × (R_fixed / (R_thermistor + R_fixed))',
        description: 'Converts thermistor resistance change into a readable voltage level.'
      },
      {
        label: 'LM35 Linear Scale Factor',
        formula: 'V_out = 10 mV / °C',
        description: 'Linear temperature transducer where 25°C produces exactly 250mV.'
      }
    ],
    workedExample: {
      problem: 'An analog sensor LM35 is connected to an Arduino ADC with a 10-bit resolution (0-1023) and 5.0V reference. If the ADC reads a digital value of 61, what is the measured temperature in degrees Celsius?',
      solution: '1. Find voltage per ADC count: Step = 5.0V / 1023 ≈ 0.004887 V/count (4.887 mV/count)\n2. Calculate measured voltage: V_in = 61 × 4.887 mV = 298.1 mV\n3. Convert to Temperature using LM35 scale (10 mV/°C):\n   Temp = 298.1 mV / (10 mV/°C) = 29.81 °C\nResult: The measured ambient temperature is approximately 29.8 °C.'
    },
    diagramType: 'sensor',
    contentSections: [
      {
        title: '1. Types of Temperature Transducers',
        body: 'Negative Temperature Coefficient (NTC) thermistors decrease in resistance as temperature rises according to the Steinhart-Hart equation. Semiconductor IC sensors (such as LM35 and TMP36) integrate precision diode junctions with onboard amplifiers to deliver direct, calibrated millivolt-per-degree linear output.'
      },
      {
        title: '2. Avoiding Self-Heating Errors',
        body: 'When electric current passes through a resistive thermistor, Joule heating (I²R) occurs inside the sensor body. If excitation current is too large, the sensor measures its own heat rather than ambient temperature. Signal conditioning circuits use high-impedance buffer amplifiers and low excitation currents.'
      },
      {
        title: '3. Noise Filtering and Moving Averages',
        body: 'Industrial environments suffer from 50Hz/60Hz electromagnetic interference (EMI) radiated from motors and mains transformers. Good firmware applies exponential moving average (EMA) filters and hardware RC bypass capacitors across ADC analog input channels.'
      }
    ],
    practicalApplications: [
      'Lithium-ion battery thermal runway monitoring in smart electric vehicles.',
      'Precision incubator and cryogenic vaccine storage refrigeration units.',
      'Over-temperature shutdown protection in high-power semiconductor inverters.',
      'Smart HVAC thermostats and home automation weather stations.'
    ],
    knowledgeCheck: {
      question: 'An LM35 sensor outputs 350 mV. What is the corresponding temperature?',
      options: ['3.5 °C', '35.0 °C', '70.0 °C', '0.35 °C'],
      correctIndex: 1,
      explanation: 'Since LM35 produces 10 mV per 1.0 °C: 350 mV / 10 mV/°C = 35.0 °C.'
    },
    completed: true
  },
  {
    id: 'lesson-opamps',
    categoryId: 'analog-electronics',
    title: 'Operational Amplifiers and Negative Feedback',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    overview: 'Master the fundamental operational amplifier (Op-Amp) building blocks, the golden rules of negative feedback, and inverting vs non-inverting configurations.',
    objectives: [
      'Apply the two ideal Op-Amp golden rules to calculate circuit voltages.',
      'Derive closed-loop voltage gain for Inverting and Non-Inverting topologies.',
      'Explain common-mode rejection ratio (CMRR) and slew rate limits.'
    ],
    formulas: [
      {
        label: 'Inverting Amplifier Gain',
        formula: 'A_v = - (R_f / R_in)',
        description: 'Negative sign indicates a 180° phase inversion between input and output.'
      },
      {
        label: 'Non-Inverting Amplifier Gain',
        formula: 'A_v = 1 + (R_f / R_1)',
        description: 'Produces an in-phase amplified output with extremely high input impedance.'
      }
    ],
    diagramType: 'generic',
    contentSections: [
      {
        title: 'The Golden Rules of Ideal Op-Amps',
        body: '1. No current enters either input terminal (Infinite Input Impedance).\n2. With negative feedback present, the Op-Amp drives its output to keep the inverting and non-inverting input terminal voltages equal (Virtual Ground concept).'
      }
    ],
    practicalApplications: [
      'Medical ECG signal preamplification and bio-potential electrodes.',
      'Active audio graphic equalizers and crossover frequency filters.',
      'Instrumentation amplifiers for strain-gauge bridge sensors.'
    ],
    knowledgeCheck: {
      question: 'In an inverting op-amp circuit with Rin = 10kΩ and Rf = 100kΩ, what is the voltage gain?',
      options: ['+10', '-10', '+11', '-0.1'],
      correctIndex: 1,
      explanation: 'A_v = -Rf / Rin = -100k / 10k = -10.'
    },
    completed: false
  }
];
