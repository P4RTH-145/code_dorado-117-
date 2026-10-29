import { CustomSensor } from '../types';

export const INITIAL_CUSTOM_SENSORS: CustomSensor[] = [
  {
    id: 'sensor-mq2',
    name: 'MQ-2 Combustible Gas & Smoke Sensor',
    type: 'analog',
    unit: 'PPM',
    minVal: 100,
    maxVal: 5000,
    defaultVal: 350,
    alertThreshold: 1200,
    formula: 'V_out = 5.0 * (R_L / (R_s + R_L)) -> PPM = 10^(log(Rs/R0)*m + b)',
    description: 'Tin dioxide (SnO2) semiconductor sensor with variable conductivity proportional to flammable gas concentration.',
    pinNumber: 'A1',
    iconName: 'Flame',
    createdBy: 'System (ENTC Lab)'
  },
  {
    id: 'sensor-sound',
    name: 'Electret Microphone Sound Pressure Sensor',
    type: 'analog',
    unit: 'dB SPL',
    minVal: 30,
    maxVal: 120,
    defaultVal: 55,
    alertThreshold: 85,
    formula: 'V_peak = Mic_PreAmp_Gain * Sound_Pressure -> ADC Count',
    description: 'Measures ambient acoustic noise with integrated LM393 comparator and op-amp audio preamplifier.',
    pinNumber: 'A2',
    iconName: 'Mic',
    createdBy: 'System (ENTC Lab)'
  }
];
