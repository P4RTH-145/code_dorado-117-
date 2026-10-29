import { QuizQuestion } from '../types';

export const quizzesData: QuizQuestion[] = [
  // Digital Electronics
  {
    id: 'quiz-1',
    subject: 'Digital Electronics',
    difficulty: 'Beginner',
    question: 'What is the binary output of a 2-input XOR gate when both inputs are binary 1?',
    options: ['1', '0', 'High Impedance (Z)', 'Indeterminate'],
    correctIndex: 1,
    explanation: 'An XOR gate outputs 1 only when the inputs are different. When both inputs are identical (1 and 1, or 0 and 0), the output is 0.'
  },
  {
    id: 'quiz-2',
    subject: 'Digital Electronics',
    difficulty: 'Beginner',
    question: 'Which logic gate is universally known as the inverted form of an AND gate?',
    options: ['NOR', 'NAND', 'XNOR', 'BUFFER'],
    correctIndex: 1,
    explanation: 'NAND stands for "NOT AND". Its output is 0 only when all inputs are 1; otherwise, it outputs 1.'
  },
  {
    id: 'quiz-3',
    subject: 'Digital Electronics',
    difficulty: 'Intermediate',
    question: 'How many select lines are required for a 16-to-1 Multiplexer (MUX)?',
    options: ['2', '3', '4', '8'],
    correctIndex: 2,
    explanation: 'The number of select lines m for 2^m input channels is determined by 2^m = 16, which yields m = 4 lines.'
  },
  {
    id: 'quiz-4',
    subject: 'Digital Electronics',
    difficulty: 'Advanced',
    question: 'In a Master-Slave J-K flip-flop, what critical issue present in simple level-triggered latches is eliminated?',
    options: ['Setup time delay', 'Race-around condition', 'Propagation delay', 'Static power dissipation'],
    correctIndex: 1,
    explanation: 'The race-around condition occurs when J=1, K=1 and clock pulse width is longer than flip-flop propagation delay. The master-slave configuration isolates feedback during the clock cycle.'
  },

  // Communication Systems
  {
    id: 'quiz-5',
    subject: 'Communication Systems',
    difficulty: 'Beginner',
    question: 'In Amplitude Modulation (AM), what happens when the modulation index m exceeds 1.0 (m > 1)?',
    options: [
      'Bandwidth decreases to zero',
      'Overmodulation occurs, causing severe envelope distortion',
      'Carrier power becomes infinite',
      'Sideband frequencies disappear'
    ],
    correctIndex: 1,
    explanation: 'Overmodulation (m > 1) causes envelope zero-crossings and phase reversals that cannot be recovered by simple envelope diode detectors without distortion.'
  },
  {
    id: 'quiz-6',
    subject: 'Communication Systems',
    difficulty: 'Intermediate',
    question: 'According to the Nyquist Sampling Theorem, to faithfully reconstruct an analog audio signal with highest frequency f_max = 20 kHz, what must be the minimum sampling rate?',
    options: ['10 kHz', '20 kHz', '40 kHz', '80 kHz'],
    correctIndex: 2,
    explanation: 'Nyquist rate f_s >= 2 × f_max. Here f_s >= 2 × 20 kHz = 40 kHz (this is why standard CD audio is sampled at 44.1 kHz).'
  },
  {
    id: 'quiz-7',
    subject: 'Communication Systems',
    difficulty: 'Advanced',
    question: 'Which digital modulation scheme encodes 4 bits per symbol using both amplitude and phase shifts?',
    options: ['BPSK', 'QPSK', '16-QAM', 'FSK'],
    correctIndex: 2,
    explanation: '16-QAM (Quadrature Amplitude Modulation) uses 16 distinct constellation points. Since 2^4 = 16, each transmitted constellation symbol carries exactly 4 bits.'
  },

  // Microcontrollers & Embedded Systems
  {
    id: 'quiz-8',
    subject: 'Embedded Systems',
    difficulty: 'Beginner',
    question: 'Which serial communication protocol uses only two bidirectional lines: SDA (Data) and SCL (Clock)?',
    options: ['SPI', 'UART', 'I2C', 'CAN Bus'],
    correctIndex: 2,
    explanation: 'I2C (Inter-Integrated Circuit) uses two open-drain lines with pull-up resistors: Serial Data (SDA) and Serial Clock (SCL).'
  },
  {
    id: 'quiz-9',
    subject: 'Embedded Systems',
    difficulty: 'Intermediate',
    question: 'What is the primary function of a Watchdog Timer (WDT) in embedded microcontrollers?',
    options: [
      'To measure high-frequency external PWM pulses',
      'To reset the microcontroller if firmware freezes or enters an infinite loop',
      'To synchronize serial baud rates between chips',
      'To power off the device when battery drops below 1V'
    ],
    correctIndex: 1,
    explanation: 'A Watchdog Timer is a hardware countdown timer that automatically resets the MCU if normal program execution fails to periodically clear ("pet") the watchdog.'
  },
  {
    id: 'quiz-10',
    subject: 'Embedded Systems',
    difficulty: 'Advanced',
    question: 'In an interrupt service routine (ISR) on an ARM Cortex-M or AVR MCU, which operation must be strictly avoided?',
    options: [
      'Clearing the interrupt flag bit',
      'Setting a volatile state flag',
      'Calling blocking delays or time-consuming print statements',
      'Reading hardware register states'
    ],
    correctIndex: 2,
    explanation: 'ISRs must execute as quickly as possible. Calling blocking delays (like delay_ms()) or slow serial print operations blocks all lower-priority interrupts and starves the real-time scheduler.'
  },

  // Sensors & Instrumentation
  {
    id: 'quiz-11',
    subject: 'Sensors & Instrumentation',
    difficulty: 'Beginner',
    question: 'How does an NTC (Negative Temperature Coefficient) thermistor behave as ambient temperature increases?',
    options: [
      'Its electrical resistance decreases',
      'Its electrical resistance increases linearly',
      'Its output capacitance increases',
      'Its breakdown voltage doubles'
    ],
    correctIndex: 0,
    explanation: 'In NTC materials, thermal excitation frees additional valence electrons into the conduction band, causing electrical resistance to drop sharply as temperature rises.'
  },
  {
    id: 'quiz-12',
    subject: 'Sensors & Instrumentation',
    difficulty: 'Intermediate',
    question: 'What is the theoretical voltage resolution of a 10-bit Analog-to-Digital Converter (ADC) operating with a 5.0V reference?',
    options: ['1.22 mV', '4.88 mV', '9.77 mV', '19.53 mV'],
    correctIndex: 1,
    explanation: 'Step size LSB = V_ref / (2^10 - 1) = 5.0V / 1023 = 0.004887 V ≈ 4.88 mV.'
  },
  {
    id: 'quiz-13',
    subject: 'Sensors & Instrumentation',
    difficulty: 'Intermediate',
    question: 'Which sensor type relies on the Piezoelectric effect to generate a measurable electrical charge when subjected to mechanical strain?',
    options: ['Hall Effect Sensor', 'Strain Gauge / Accelerometer', 'LDR Photoresistor', 'PIR Motion Sensor'],
    correctIndex: 1,
    explanation: 'Piezoelectric quartz crystals and ceramics generate surface electrical charges proportional to applied mechanical mechanical stress, shock, or acceleration.'
  },

  // Digital Signal Processing
  {
    id: 'quiz-14',
    subject: 'Signal Processing',
    difficulty: 'Intermediate',
    question: 'What is the primary computational advantage of the Fast Fourier Transform (FFT) over the direct Discrete Fourier Transform (DFT)?',
    options: [
      'Reduces complexity from O(N²) to O(N log N)',
      'Eliminates all high-frequency noise automatically',
      'Doubles the analog dynamic range of the input signal',
      'Allows sampling below the Nyquist rate'
    ],
    correctIndex: 0,
    explanation: 'The Cooley-Tukey FFT algorithm leverages butterfly symmetry to reduce calculations from N² complex multiplications down to (N/2) log₂ N operations.'
  },
  {
    id: 'quiz-15',
    subject: 'Signal Processing',
    difficulty: 'Advanced',
    question: 'Which statement accurately describes an FIR (Finite Impulse Response) digital filter compared to an IIR filter?',
    options: [
      'FIR filters always have recursive feedback loops and can become unstable',
      'FIR filters can achieve strictly linear phase response and are unconditionally stable',
      'FIR filters require far fewer coefficients than IIR filters for sharp cutoff transitions',
      'FIR filters cannot be implemented using digital convolution'
    ],
    correctIndex: 1,
    explanation: 'Because FIR filters have no feedback (all poles are at the origin z=0), they are inherently unconditionally stable and can easily maintain exact linear phase without phase distortion.'
  },
  {
    id: 'quiz-16',
    subject: 'Signal Processing',
    difficulty: 'Beginner',
    question: 'What is the effect of aliasing in digital signal conversion?',
    options: [
      'High frequencies improperly fold back and appear as false lower frequencies',
      'Signal amplitude drops to zero volts',
      'Phase shifts by 360 degrees without frequency change',
      'The signal becomes an analog square wave'
    ],
    correctIndex: 0,
    explanation: 'When input frequencies exceed half the sampling rate (f_s/2), they fold into the baseband spectrum and corrupt lower valid frequency components (aliasing).'
  }
];
