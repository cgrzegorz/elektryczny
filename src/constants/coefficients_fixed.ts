/**
 * Stałe współczynniki i wartości używane w obliczeniach
 */

/**
 * Współczynniki korekcyjne (przykładowe wartości k)
 * Do uzupełnienia wartościami z notatek
 */
export const CORRECTION_FACTORS = {
  temperatureCorrection: {
    '30C': 1.0,
    '35C': 0.94,
    '40C': 0.87,
    '45C': 0.79,
    '50C': 0.71,
  },

  installationMethod: {
    A1: 1.0,
    A2: 0.95,
    B1: 0.95,
    B2: 0.90,
    C: 1.0,
    D: 0.95,
    E: 0.85,
  },

  groupingFactor: {
    1: 1.0,
    2: 0.8,
    3: 0.7,
    4: 0.65,
    5: 0.6,
    6: 0.57,
  },
} as const

/**
 * Rezystywność materiałów przewodzących
 */
export const RESISTIVITY = {
  copper: 0.0175, // Ω·mm²/m przy 20°C
  aluminum: 0.0283, // Ω·mm²/m przy 20°C
} as const

/**
 * Standardowe napięcia nominalne
 */
export const NOMINAL_VOLTAGES = {
  singlePhase: 230, // V
  threePhase: 400, // V
} as const


export const POWER_FACTORS = {
  lighting: 1.0,
  heating: 1.0,
  motors: 0.8,
  mixed: 0.85,
} as const

