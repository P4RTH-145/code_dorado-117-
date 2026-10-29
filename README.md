# ENTC Innovate Lab — AI-Powered Smart Learning & Innovation Platform

[![React](https://img.shields.io/badge/React-19.3-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff.svg)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

**ENTC Innovate Lab** is a modern, responsive web application engineered specifically for **Electronics and Telecommunication Engineering (ENTC)** students, educators, and makers. It bridges the gap between theoretical engineering education and practical experimentation through interactive browser-based circuit simulations, AI tutoring, gamification, and real-world IoT scenarios.

---

## 🌟 Key Features & Functional Modules

### 1. Interactive Student Dashboard (`/`)
- **Student Profile Overview:** Academic profile, enrollment branch, semester, and target role.
- **5 Core Metrics Cards:** Real-time Learning Points (XP), Modules Completed, Quiz Accuracy %, Lab Experiments Simulated, and Active Learning Streak.
- **Weekly Learning Activity Chart:** Visual telemetry powered by Recharts showing 7-day study velocity.
- **Subject-Wise Mastery Breakdown:** Bar graph tracking curriculum coverage across 6 core disciplines.
- **Daily Engineering Challenge:** Fast access to the daily embedded firmware algorithm challenge.
- **Recent Activity Stream:** Chronological feed recording completed lessons, simulations, and quiz scores.
- **Sample Data Transparency:** Clear distinction between simulated sample data and real student activity with one-click reset to a blank slate.

### 2. Structured ENTC Learning Modules (`/learn` & `/learn/:lessonId`)
Curriculum across 8 technical domains:
1. **Digital Electronics:** Logic Gates & Truth Tables (Boolean algebra, universal gates, XOR parity).
2. **Microcontrollers & Embedded Systems:** Pulse Width Modulation (PWM) duty cycle, timers, motor speed control.
3. **Sensors & Instrumentation:** LM35 precision Celsius sensor, ADC quantization, noise filtering.
4. **Analog Electronics:** Operational Amplifiers (Op-Amps), inverting/non-inverting gains, virtual ground.
5. **Communication Systems:** Analog Modulation (AM vs FM), Carson's Rule, noise immunity.
6. **Digital Signal Processing (DSP):** Discrete Fourier Transform (DFT), Nyquist sampling, Cooley-Tukey FFT.
7. **Internet of Things (IoT):** MQTT lightweight telemetry architecture, topics, QoS levels.
8. **TinyML & Edge AI:** INT8 quantization, TensorFlow Lite on microcontrollers, vibration anomaly detection.

*Each lesson contains learning objectives, derivations, formulas, worked engineering examples with step-by-step solutions, practical applications, interactive knowledge checks, and prev/next navigation.*

### 3. Virtual Electronics Lab (`/lab`)
- **A. Logic Gate Simulator:**
  - Interactive SVG diagrams for **AND, OR, NOT, NAND, NOR, XOR, and XNOR** gates.
  - Clickable binary input switches (0 and 1) with real-time glowing cyan wires (+5V) and dim wires (0V).
  - Dynamic Truth Table with live-highlighted active row.
  - Real-time step-by-step logic explanation explaining *why* the output is 0 or 1.
- **B. Ohm's Law LED Circuit Demonstration:**
  - Adjustable DC Power Supply slider (0V to 12V).
  - Single Pole Single Throw (SPST) switch (toggles circuit ON/OFF).
  - Selectable current limiting resistors ($100\Omega, 220\Omega, 330\Omega, 470\Omega, 1000\Omega$).
  - Color-selectable LEDs (Red, Green, Blue) with modeled forward voltages ($V_f \in [2.0\text{V}, 3.1\text{V}]$).
  - Virtual Multimeter measuring loop current ($I = \frac{V_{in} - V_f}{R}\text{ mA}$) and LED voltage drop.
  - Safe, dim, and burn-out warning states (triggers if current exceeds 35 mA).
- **C. Multi-Sensor Simulator:**
  - **LM35 Temperature Sensor:** Slider from -10°C to 110°C with millivolt output ($10\text{ mV}/^{\circ}\text{C}$) and 10-bit ADC calculation ($0-1023$).
  - **LDR Light Sensor:** Photoresistor lux slider with voltage divider output calculation.
  - **HC-SR04 Ultrasonic Distance Sensor:** Distance slider from 2 cm to 400 cm with pulse echo round-trip calculation ($t = \frac{2d}{343\text{ m/s}}$).
  - User-configurable alarm threshold triggers with audio-visual alerts.

### 4. Dedicated AI Learning Assistant (`/ai-tutor`)
- **Tutor Persona Switcher:**
  - *Explain Like I'm a Beginner:* Intuitive analogies and clear explanations.
  - *Step-by-Step Derivation:* Mathematical derivations and formula breakdowns.
  - *Hardware Troubleshooting:* Diagnostics for floating pins, bypass capacitors, ground bounce, and component ratings.
  - *Embedded C++ / Code:* Production-ready firmware routines.
- **Dual Engine Architecture:**
  - **Live Google Gemini API:** Direct connection via user's API key (stored locally in browser, never exposed).
  - **ENTC Knowledge Engine Demo:** Comprehensive built-in engineering responses for 20+ electronics topics when no key is entered, clearly marked with a `Demo Engine` pill.
- One-click copy answer, follow-up suggestion chips, and chat reset.

### 5. Coding Challenge Arena (`/coding`)
- Embedded firmware challenges:
  1. *Blink an LED State Toggle:* Non-blocking timestamp logic.
  2. *Read Switch with Active-Low Debounce:* Noise window filtering.
  3. *Temperature Safety Relay Controller:* Deadband hysteresis cooling controller.
  4. *Universal Logic Gate Evaluator:* Boolean calculation across all gate types.
  5. *ADC Sensor to Percentage Scaler:* 10-bit ADC clamping and telemetry mapping.
- In-browser code editor with evaluation engine executing sandboxed test suites with timing, console logs, and XP rewards.

### 6. Quiz Zone & Mini-Games (`/quizzes`)
- **16 Technical Multiple-Choice Questions** across 6 subjects.
- Filter by Subject and Difficulty (Beginner, Intermediate, Advanced).
- Optional **Timed Mode** with a 30-second animated countdown timer.
- Immediate feedback with correct answer explanations, score percentages, and XP awards.
- Detailed review drawer for incorrect answers and replay options.
- **Gate Master Mini-Game:** High-speed prediction game where students predict the binary output (0 or 1) of randomized gates and inputs to build streaks.

### 7. Connected IoT Real-World Simulations (`/iot`)
- **Scenario A: Smart Home Automation:** PIR motion sensor, light level sensor, automatic and manual lighting modes, animated room visualization, and live event telemetry.
- **Scenario B: Industrial Temperature Safety Monitoring:** Core temperature slider (-10°C to 120°C), trip threshold, emergency cooling fan speed animation (RPM), and live alarm logs.
- **Scenario C: Smart Agriculture Irrigation:** Capacitive soil moisture slider (0-100%), threshold controller, submersible water pump with animated flow, and dry/optimal/saturated status logs.

### 8. Progress, Streaks & Achievement Badges (`/progress`)
- 7 Mastery Tiers from *Novice Tinkerer* (Level 1) to *Master Telecom Architect* (Level 7).
- 6 Unlockable Achievement Badges with criteria tracking (*First Spark, Logic Virtuoso, Embedded Hacker, Quiz Champion, IoT Pioneer, Streak Titan*).
- Interactive Confetti celebration on badge unlocks.

### 9. Profile & Settings (`/settings`)
- Student profile customization (Name, Email, Branch, Semester, College, Target Role).
- Theme toggle: Midnight Dark Navy & Clean Engineering Light.
- Google Gemini API key configuration and model selection (`gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`).
- Data backup: One-click JSON export, import, and factory reset.

---

## 🏗️ Project Architecture

```
my/
├── public/
│   └── favicon.svg              # Circuit chip brand icon
├── src/
│   ├── components/
│   │   ├── ai-tutor/
│   │   │   └── TutorChat.tsx    # Dual-mode AI chat assistant
│   │   ├── circuit/
│   │   │   ├── LogicGateSimulator.tsx  # SVG logic gates & truth tables
│   │   │   ├── LedCircuitSimulator.tsx # Ohm's Law circuit simulation
│   │   │   └── SensorSimulator.tsx     # LM35, LDR, HC-SR04 simulation
│   │   ├── coding/
│   │   │   └── CodingArena.tsx  # Code editor and test runner
│   │   ├── dashboard/
│   │   │   └── DashboardOverview.tsx # Metrics, charts, recommendations
│   │   ├── iot/
│   │   │   └── IotScenarios.tsx # 3 Interactive IoT simulations
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── MainLayout.tsx   # Responsive wrapper & badge modal
│   │   │   ├── Navbar.tsx       # Header with XP, streak & theme toggle
│   │   │   └── Sidebar.tsx      # 9-page responsive navigation drawer
│   │   └── quizzes/
│   │       ├── LogicGateMiniGame.tsx # Fast-paced prediction mini-game
│   │       └── QuizPlayer.tsx   # 16-question quiz engine
│   ├── context/
│   │   └── AppContext.tsx       # Global state for XP, badges, streaks
│   ├── data/
│   │   ├── badgesData.ts        # Achievement definitions & level tiers
│   │   ├── challengesData.ts    # Coding challenges & test cases
│   │   ├── lessonsData.ts       # 8 Comprehensive ENTC lessons
│   │   ├── quizzesData.ts       # 16 Technical MCQ questions
│   │   └── sampleStatsData.ts   # Initial demo profile & stats
│   ├── pages/
│   │   ├── AiTutorPage.tsx
│   │   ├── CodingArenaPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── IotSimulationsPage.tsx
│   │   ├── LearnPage.tsx
│   │   ├── LessonDetailPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ProgressPage.tsx
│   │   ├── QuizZonePage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── VirtualLabPage.tsx
│   ├── services/
│   │   ├── aiTutorService.ts    # Gemini API client & ENTC knowledge base
│   │   ├── codeRunnerService.ts # Sandboxed JS execution harness
│   │   └── storageService.ts    # LocalStorage persistence & backup
│   ├── types/
│   │   └── index.ts             # Complete TypeScript interfaces
│   ├── App.tsx                  # React Router root configuration
│   ├── index.css                # Tailwind CSS v4 styling & animations
│   └── main.tsx
├── index.html                   # HTML template with dark theme
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts               # Vite configuration with Tailwind plugin
└── README.md
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on Node v26)
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone <your-github-repo-url>
cd my
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:5173` to explore ENTC Innovate Lab.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔑 AI Tutor Configuration (Optional)

The application works 100% out of the box with the built-in **ENTC Knowledge Engine Demo Mode**.

To connect live generative Gemini AI reasoning:
1. Visit [Google AI Studio](https://aistudio.google.com).
2. Click **Get API Key** and generate a free API key.
3. In ENTC Innovate Lab, navigate to **Profile & Settings** (`/settings`) or click **Setup Gemini API** inside the AI Tutor chat.
4. Paste your key into the **Gemini API Key** field and save.
5. All chats will now use live Gemini models with zero server overhead.

---

## 🛡️ Security & Privacy
- **Client-Side Persistence:** All progress, XP, and settings are saved exclusively in your browser's `localStorage`.
- **API Key Safety:** Keys are never transmitted to external servers or logged in public code repositories.
- **Sandboxed Execution:** The coding challenge evaluation uses safe function encapsulation with deep equality checks and isolated console capture.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE). Built for Electronics and Telecommunication Engineering students worldwide.
