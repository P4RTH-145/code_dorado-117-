import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Digital Electronics
  {
    id: 'quiz-de-1',
    subject: 'digital-electronics',
    subjectLabel: 'Digital Electronics',
    difficulty: 'Beginner',
    question: 'Which logic gate produces a LOW (0) output only when ALL its inputs are HIGH (1)?',
    options: ['NOR Gate', 'NAND Gate', 'XOR Gate', 'AND Gate'],
    correctIndex: 1,
    explanation: 'A NAND gate is an inverted AND gate. When both inputs are 1, an AND gate gives 1, so NAND inverts this to 0. For any other input combination, NAND outputs 1.',
    xpReward: 20
  },
  {
    id: 'quiz-de-2',
    subject: 'digital-electronics',
    subjectLabel: 'Digital Electronics',
    difficulty: 'Intermediate',
    question: 'How many 2-input NAND gates are required to construct an exclusive-OR (XOR) gate?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation: 'A standard minimal universal NAND implementation of an XOR gate (A ⊕ B) requires exactly 4 two-input NAND gates.',
    xpReward: 25
  },
  {
    id: 'quiz-de-3',
    subject: 'digital-electronics',
    subjectLabel: 'Digital Electronics',
    difficulty: 'Advanced',
    question: 'What is the primary condition that causes a race-around hazard in an edge-triggered or level-triggered J-K flip-flop?',
    options: [
      'Clock pulse width tp > propagation delay tpd while J = K = 1',
      'Clock pulse width tp < propagation delay tpd while J = 0, K = 0',
      'Power supply voltage drops below 3.3V',
      'J = 0 and K = 1 simultaneously'
    ],
    correctIndex: 0,
    explanation: 'Race-around condition occurs in level-triggered JK flip-flops when both inputs J=1 and K=1, and the clock pulse duration tp is greater than the gate propagation delay tpd. The output oscillates repeatedly during the clock period.',
    xpReward: 30
  },

  // Communication Systems
  {
    id: 'quiz-comm-1',
    subject: 'communication-systems',
    subjectLabel: 'Communication Systems',
    difficulty: 'Beginner',
    question: 'What is the theoretical maximum transmission bandwidth of standard Amplitude Modulation (AM) when modulated by a baseband frequency fm?',
    options: ['fm', '2 × fm', '4 × fm', 'fm / 2'],
    correctIndex: 1,
    explanation: 'Standard Double-Sideband Full Carrier (DSB-FC) AM contains the upper sideband (fc + fm) and lower sideband (fc - fm). Therefore, BW = (fc + fm) - (fc - fm) = 2 fm.',
    xpReward: 20
  },
  {
    id: 'quiz-comm-2',
    subject: 'communication-systems',
    subjectLabel: 'Communication Systems',
    difficulty: 'Intermediate',
    question: 'In digital telecommunications, what does the Shannon-Hartley theorem define?',
    options: [
      'The minimum sampling rate to prevent aliasing',
      'The theoretical maximum channel data capacity in the presence of noise',
      'The resonance frequency of an RF antenna',
      'The power dissipation of an RF power amplifier'
    ],
    correctIndex: 1,
    explanation: 'Shannon-Hartley theorem establishes C = B × log₂(1 + SNR), where C is the maximum channel capacity in bits/second, B is bandwidth in Hertz, and SNR is signal-to-noise power ratio.',
    xpReward: 25
  },
  {
    id: 'quiz-comm-3',
    subject: 'communication-systems',
    subjectLabel: 'Communication Systems',
    difficulty: 'Advanced',
    question: 'Why does Orthogonal Frequency Division Multiplexing (OFDM) in 4G LTE and 5G mitigate multipath delay spread?',
    options: [
      'It splits a high-speed data stream into many narrow parallel subcarriers with longer symbol duration and cyclic prefix',
      'It operates exclusively in the vacuum of space',
      'It increases carrier frequency to optical wavelengths',
      'It converts digital signals back to pure analog AM waves'
    ],
    correctIndex: 0,
    explanation: 'OFDM divides wideband channels into hundreds of narrow orthogonal subcarriers. The symbol duration on each subcarrier is much longer than the channel multipath delay spread, and cyclic prefixes eliminate inter-symbol interference (ISI).',
    xpReward: 30
  },

  // Microcontrollers and Embedded Systems
  {
    id: 'quiz-micro-1',
    subject: 'microcontrollers',
    subjectLabel: 'Microcontrollers & Embedded',
    difficulty: 'Beginner',
    question: 'In an embedded microcontroller, what is the role of an Interrupt Service Routine (ISR)?',
    options: [
      'To compile source code into machine binary',
      'To execute a prioritized handler immediately when an asynchronous hardware event occurs',
      'To regulate the 5V power supply rail',
      'To format the internal flash memory'
    ],
    correctIndex: 1,
    explanation: 'An ISR is a specialized routine invoked by microcontroller hardware upon an internal or external interrupt trigger. It pauses the main program, handles the urgent event, and resumes normal execution.',
    xpReward: 20
  },
  {
    id: 'quiz-micro-2',
    subject: 'microcontrollers',
    subjectLabel: 'Microcontrollers & Embedded',
    difficulty: 'Intermediate',
    question: 'What is the key functional difference between the SPI and I2C serial communication protocols?',
    options: [
      'SPI is full-duplex with separate MISO/MOSI wires; I2C is half-duplex using two wires (SDA/SCL) with device addressing',
      'I2C is faster than SPI in all implementations',
      'SPI requires open-drain pull-up resistors on all data lines',
      'I2C requires 4 wires per slave device'
    ],
    correctIndex: 0,
    explanation: 'SPI provides dedicated full-duplex lines (MOSI, MISO, SCK, CS) allowing speeds of 50MHz+, whereas I2C uses shared 2-wire open-drain lines (SDA, SCL) with 7-bit device addressing.',
    xpReward: 25
  },
  {
    id: 'quiz-micro-3',
    subject: 'microcontrollers',
    subjectLabel: 'Microcontrollers & Embedded',
    difficulty: 'Advanced',
    question: 'What is the purpose of a Hardware Watchdog Timer (WDT) in safety-critical embedded systems?',
    options: [
      'To measure ambient room temperature',
      'To automatically reset the microcontroller if firmware freezes or enters an infinite loop',
      'To boost the CPU clock speed during heavy workloads',
      'To encrypt wireless telemetry payloads'
    ],
    correctIndex: 1,
    explanation: 'The Watchdog Timer runs on an independent oscillator. If firmware fails to periodically "kick" or reset the watchdog within a timeout window (e.g., due to deadlock or glitch), the WDT triggers a system reset.',
    xpReward: 30
  },

  // Sensors & Instrumentation
  {
    id: 'quiz-sensor-1',
    subject: 'sensors-instrumentation',
    subjectLabel: 'Sensors & Instrumentation',
    difficulty: 'Beginner',
    question: 'An LM35 precision temperature sensor has a sensitivity of 10 mV/°C. What voltage appears at its output pin at 37°C (normal body temperature)?',
    options: ['0.037 V (37 mV)', '0.370 V (370 mV)', '3.700 V (3700 mV)', '1.370 V (1370 mV)'],
    correctIndex: 1,
    explanation: 'Vout = 37°C × 10 mV/°C = 370 mV = 0.370 Volts.',
    xpReward: 20
  },
  {
    id: 'quiz-sensor-2',
    subject: 'sensors-instrumentation',
    subjectLabel: 'Sensors & Instrumentation',
    difficulty: 'Intermediate',
    question: 'In an ultrasonic distance sensor (such as HC-SR04), the echo pin stays HIGH for 580 microseconds. Taking speed of sound as 340 m/s (29 µs/cm round-trip), what is the measured distance?',
    options: ['5 cm', '10 cm', '20 cm', '29 cm'],
    correctIndex: 1,
    explanation: 'Distance = (Time in microseconds) / (29 × 2) = 580 µs / 58 ≈ 10 cm. The ultrasound travels to the obstacle and returns back.',
    xpReward: 25
  },
  {
    id: 'quiz-sensor-3',
    subject: 'sensors-instrumentation',
    subjectLabel: 'Sensors & Instrumentation',
    difficulty: 'Advanced',
    question: 'Why is a Wheatstone Bridge circuit paired with an instrumentation amplifier for strain gauge measurements?',
    options: [
      'It converts fractional resistance changes (ΔR/R < 0.1%) into measurable differential voltages with common-mode noise rejection',
      'It generates radio frequency signals directly',
      'It eliminates the need for any DC power supply',
      'It prevents mechanical strain from reaching the sensor'
    ],
    correctIndex: 0,
    explanation: 'Strain gauges exhibit tiny fractional resistance changes when stressed. A balanced Wheatstone bridge converts this ΔR into millivolt differential signals, which an instrumentation amplifier boosts with high CMRR.',
    xpReward: 30
  },

  // Digital Signal Processing
  {
    id: 'quiz-dsp-1',
    subject: 'signal-processing',
    subjectLabel: 'Digital Signal Processing',
    difficulty: 'Beginner',
    question: 'According to the Nyquist-Shannon sampling theorem, what is the minimum sampling frequency required to digitize a 15 kHz speech signal without aliasing?',
    options: ['7.5 kHz', '15 kHz', '30 kHz', '60 kHz'],
    correctIndex: 2,
    explanation: 'Nyquist rate fs >= 2 × fmax. Therefore fs >= 2 × 15 kHz = 30 kHz.',
    xpReward: 20
  },
  {
    id: 'quiz-dsp-2',
    subject: 'signal-processing',
    subjectLabel: 'Digital Signal Processing',
    difficulty: 'Intermediate',
    question: 'What distinguishes a Finite Impulse Response (FIR) filter from an Infinite Impulse Response (IIR) filter?',
    options: [
      'FIR filters are inherently stable and have linear phase response because they use no recursive feedback',
      'IIR filters cannot be implemented in software',
      'FIR filters require analog inductors and capacitors',
      'IIR filters always have finite duration impulse responses'
    ],
    correctIndex: 0,
    explanation: 'FIR filters rely solely on present and past inputs (no feedback poles), guaranteeing unconditional stability and strictly linear phase response, which prevents waveform phase distortion.',
    xpReward: 25
  },
  {
    id: 'quiz-dsp-3',
    subject: 'signal-processing',
    subjectLabel: 'Digital Signal Processing',
    difficulty: 'Advanced',
    question: 'In the Z-transform domain, where must all poles of a discrete-time Linear Time-Invariant (LTI) system lie for the causal system to be BIBO stable?',
    options: [
      'Strictly inside the unit circle |z| < 1',
      'Strictly on the imaginary jω axis',
      'Strictly outside the unit circle |z| > 1',
      'In the right-half of the complex s-plane'
    ],
    correctIndex: 0,
    explanation: 'For a discrete-time causal LTI filter to be Bounded-Input Bounded-Output (BIBO) stable, all poles of its transfer function H(z) must strictly reside inside the unit circle in the complex z-plane (|z| < 1).',
    xpReward: 30
  },

  // IoT
  {
    id: 'quiz-iot-1',
    subject: 'iot',
    subjectLabel: 'Internet of Things (IoT)',
    difficulty: 'Intermediate',
    question: 'Which LPWAN (Low-Power Wide-Area Network) technology operates in unlicensed sub-GHz spectrum (868/915 MHz) using Chirp Spread Spectrum (CSS) modulation?',
    options: ['LoRaWAN', '5G mmWave', 'Bluetooth Low Energy 5.0', 'Zigbee Pro'],
    correctIndex: 0,
    explanation: 'LoRa (Long Range) uses proprietary Chirp Spread Spectrum modulation to provide wireless links over 10-15 km with multi-year battery life in unlicensed ISM bands.',
    xpReward: 25
  }
];

