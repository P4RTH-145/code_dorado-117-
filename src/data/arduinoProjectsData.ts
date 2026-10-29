import { ArduinoProject } from '../types';

export const INITIAL_ARDUINO_PROJECTS: ArduinoProject[] = [
  {
    id: 'arduino-smart-thermostat',
    title: 'Arduino LM35 Automatic Cooling Fan Controller',
    description: 'Reads analog temperature from Pin A0, computes degrees Celsius, and activates cooling fan on Digital Pin 9 when exceeding threshold with Serial Telemetry.',
    category: 'Sensors & Actuators',
    connectedPin: 9,
    actuatorType: 'motor',
    sensorInputType: 'analog-temp',
    sketchCode: `// Arduino UNO: Smart Industrial Thermostat Controller
const int SENSOR_PIN = A0;   // LM35 connected to Analog Pin 0
const int FAN_PWM_PIN = 9;   // DC Blower Fan MOSFET gate on Pin 9
const float THRESHOLD_C = 45.0; // Trigger threshold in Celsius

void setup() {
  Serial.begin(115200);
  pinMode(FAN_PWM_PIN, OUTPUT);
  Serial.println("System Initialized: Thermal Core Supervisor Online");
}

void loop() {
  int rawADC = analogRead(SENSOR_PIN);
  // LM35 transfer: 10mV/°C, 5V reference: V = raw * 5.0 / 1023
  float voltage = (rawADC * 5.0) / 1023.0;
  float tempC = voltage * 100.0;

  Serial.print("Sensor Read: ");
  Serial.print(tempC, 1);
  Serial.print(" °C | Raw ADC: ");
  Serial.println(rawADC);

  if (tempC >= THRESHOLD_C) {
    int fanSpeed = map((int)tempC, 45, 80, 150, 255);
    fanSpeed = constrain(fanSpeed, 150, 255);
    analogWrite(FAN_PWM_PIN, fanSpeed);
    Serial.print(">>> ALERT: Cooling Active at PWM Speed: ");
    Serial.println(fanSpeed);
  } else {
    analogWrite(FAN_PWM_PIN, 0);
    Serial.println("Status: Thermal Core Normal (Fan Idle)");
  }

  delay(500);
}`
  },
  {
    id: 'arduino-ldr-twilight',
    title: 'Arduino LDR Twilight Streetlight Relay Switch',
    description: 'Reads ambient illuminance from photoresistor divider on Pin A1 and switches high-power 220V lamp relay on Digital Pin 8 at dusk.',
    category: 'Optoelectronics & Relays',
    connectedPin: 8,
    actuatorType: 'relay',
    sensorInputType: 'potentiometer',
    sketchCode: `// Arduino UNO: Automatic Twilight Streetlight Controller
const int LDR_PIN = A1;       // LDR voltage divider on Analog Pin 1
const int RELAY_PIN = 8;      // Active-LOW 5V Relay module on Pin 8
const int DARK_THRESHOLD = 300; // ADC threshold for sunset

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Turn off relay initially (Active-LOW)
  Serial.println("Smart Photocell Streetlight Relay Ready");
}

void loop() {
  int ldrReading = analogRead(LDR_PIN);
  Serial.print("LDR Illuminance Reading: ");
  Serial.println(ldrReading);

  if (ldrReading < DARK_THRESHOLD) {
    digitalWrite(RELAY_PIN, LOW); // Energize relay coil
    Serial.println("Status: DUSK DETECTED -> Streetlight RELAY CLOSED (ON)");
  } else {
    digitalWrite(RELAY_PIN, HIGH); // De-energize relay
    Serial.println("Status: DAYLIGHT DETECTED -> Streetlight RELAY OPEN (OFF)");
  }

  delay(1000);
}`
  },
  {
    id: 'arduino-proximity-buzzer',
    title: 'Arduino Sonar Parking Radar with Pulsing Buzzer',
    description: 'Measures obstacle distance via ultrasonic echo pulses and varies buzzer chirp frequency inversely proportional to obstacle distance.',
    category: 'Acoustic Sonar',
    connectedPin: 6,
    actuatorType: 'buzzer',
    sensorInputType: 'potentiometer',
    sketchCode: `// Arduino UNO: Ultrasonic Distance Parking Assist
const int TRIG_PIN = 7;
const int ECHO_PIN = 5;
const int BUZZER_PIN = 6;

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.println("Automotive Sonar Distance Assist Active");
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  float distance = duration / 58.2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  if (distance > 0 && distance < 20.0) {
    // Proximity alert: fast chirp
    tone(BUZZER_PIN, 2400, 50);
    delay((int)(distance * 15));
  } else {
    noTone(BUZZER_PIN);
    delay(200);
  }
}`
  }
];
