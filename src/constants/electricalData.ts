/**
 * Definicja stałych technicznych dla obliczeń elektrycznych
 * Dane pochodzą z notatek i norm elektrycznych
 */

/**
 * Wartości znamionowe prądów zabezpieczeń nadprądowych In [A]
 */
export const NOMINAL_CURRENTS = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63] as const

/**
 * Krotności wyzwalania zabezpieczeń w zależności od charakterystyki
 * B - instalacje mieszkaniowe
 * C - instalacje przemysłowe (standard)
 * D - silniki, transformatory (duże prądy rozruchowe)
 */
export const TRIP_MULTIPLIERS = {
  B: 5,
  C: 10,
  D: 20,
} as const

/**
 * Współczynnik k dla różnych typów przewodów i izolacji
 * k = 115 dla przewodów miedzianych z izolacją PVC
 */
export const K_COEFFICIENTS = {
  copperPVC: 115,
  copperXLPE: 143,
  aluminumPVC: 76,
  aluminumXLPE: 94,
} as const

/**
 * Domyślny współczynnik k (miedź + PVC)
 */
export const K_DEFAULT = 115

/**
 * Przewodność właściwa (γ) dla różnych materiałów [m/(Ω·mm²)]
 * Przy 20°C
 */
export const CONDUCTIVITY_20C = {
  copper: 56, // m/(Ω·mm²)
  aluminum: 35, // m/(Ω·mm²)
} as const

/**
 * Przewodność właściwa (γ) dla różnych materiałów przy 70°C
 */
export const CONDUCTIVITY_70C = {
  copper: 46, // m/(Ω·mm²)
  aluminum: 29, // m/(Ω·mm²)
} as const

/**
 * Rezystywność (ρ) dla różnych materiałów [Ω·mm²/m]
 * ρ = 1/γ
 */
export const RESISTIVITY_20C = {
  copper: 1 / 56, // ≈ 0.01786 Ω·mm²/m
  aluminum: 1 / 35, // ≈ 0.02857 Ω·mm²/m
} as const

export const RESISTIVITY_70C = {
  copper: 1 / 46, // ≈ 0.02174 Ω·mm²/m
  aluminum: 1 / 29, // ≈ 0.03448 Ω·mm²/m
} as const

/**
 * Dopuszczalne limity spadków napięcia [wartość względna, np. 0.03 = 3%]
 * Zgodnie z normami elektrycznymi
 */
export const VOLTAGE_DROP_LIMITS = {
  /** Obwody oświetleniowe - max 3% */
  lighting: 0.03,

  /** Obwody gniazd wtykowych - max 5% */
  sockets: 0.05,

  /** Obwody silnikowe - max 5% */
  motor: 0.05,

  /** WLZ (Wejście Linii Zasilającej) - max 1% (dobra praktyka dla głównego zasilania) */
  wlz: 0.01,

  /** Inne obwody - max 5% */
  other: 0.05,
} as const


/**
 * Typy obiektów dla TypeScript
 */
export type TripCharacteristic = keyof typeof TRIP_MULTIPLIERS
export type CircuitType = keyof typeof VOLTAGE_DROP_LIMITS
export type CableType = keyof typeof K_COEFFICIENTS

/**
 * Pomocnicza funkcja do pobrania krotności wyzwalania
 */
export const getTripMultiplier = (characteristic: TripCharacteristic): number => {
  return TRIP_MULTIPLIERS[characteristic]
}

/**
 * Pomocnicza funkcja do pobrania limitu spadku napięcia
 */
export const getVoltageDrop = (circuitType: CircuitType): number => {
  return VOLTAGE_DROP_LIMITS[circuitType]
}

/**
 * Pomocnicza funkcja do pobrania współczynnika k
 */
export const getKCoefficient = (cableType: CableType): number => {
  return K_COEFFICIENTS[cableType]
}


export const POWER_FACTOR_PRESETS = {
  RESISTIVE: 1.0,        // Grzałki, piece, bojlery
  LED_ELECTRONICS: 0.95,  // Nowoczesna elektronika, LED
  MOTOR_MODERN: 0.9,     // Nowoczesne silniki z kompensacją
  MOTOR_OLD: 0.7,        // Stare silniki bez kompensacji
  FLUORESCENT: 0.5,      // Świetlówki bez kompensacji
  TYPICAL_SINGLE: 1.0,   // Typowe dla instalacji 1-fazowej
  TYPICAL_THREE: 0.93,   // Typowe dla instalacji 3-fazowej
  WLZ: 0.95,   // Typowe dla instalacji 3-fazowej
} as const


export const POWER_FACTOR_LABELS: Record<keyof typeof POWER_FACTOR_PRESETS, string> = {
  RESISTIVE: 'Obciążenie rezystancyjne (grzałki, bojlery) - 1.0',
  LED_ELECTRONICS: 'Elektronika, LED - 0.95',
  MOTOR_MODERN: 'Silniki nowoczesne - 0.9',
  MOTOR_OLD: 'Silniki stare - 0.7',
  FLUORESCENT: 'Świetlówki bez kompensacji - 0.5',
  TYPICAL_SINGLE: 'Typowe 1-fazowe - 1.0',
  TYPICAL_THREE: 'Typowe 3-fazowe - 0.93',
  WLZ: 'WLZ',
}

/**
 * Typ dla presetów współczynnika mocy
 */
export type PowerFactorPreset = keyof typeof POWER_FACTOR_PRESETS

/**
 * Funkcja pomocnicza do pobrania wartości cosφ z presetu
 */
export const getPowerFactor = (preset: PowerFactorPreset): number => {
  return POWER_FACTOR_PRESETS[preset]
}

/**
 * Walidacja współczynnika mocy
 * @param cosPhi - wartość współczynnika mocy
 * @returns true jeśli wartość jest poprawna
 */
export const validatePowerFactor = (cosPhi: number): boolean => {
  return cosPhi > 0 && cosPhi <= 1.0
}

/**
 * Współczynniki poprawkowe temperaturowe (k_temp) dla izolacji PVC
 * Wartości bazowe dla 30°C
 * Zgodnie z PN-HD 60364-5-52 Tabela B.52.14
 */
export const TEMPERATURE_CORRECTION_PVC: Record<number, number> = {
  10: 1.22,
  15: 1.17,
  20: 1.12,
  25: 1.06,
  30: 1.00, // temperatura bazowa
  35: 0.94,
  40: 0.87,
  45: 0.79,
  50: 0.71,
  55: 0.61,
  60: 0.50,
} as const

/**
 * Współczynniki poprawkowe temperaturowe (k_temp) dla izolacji XLPE/EPR
 * Wartości bazowe dla 30°C
 * Zgodnie z PN-HD 60364-5-52 Tabela B.52.15
 */
export const TEMPERATURE_CORRECTION_XLPE: Record<number, number> = {
  10: 1.15,
  15: 1.12,
  20: 1.08,
  25: 1.04,
  30: 1.00, // temperatura bazowa
  35: 0.96,
  40: 0.91,
  45: 0.87,
  50: 0.82,
  55: 0.76,
  60: 0.71,
  65: 0.65,
  70: 0.58,
  75: 0.50,
  80: 0.41,
} as const

/**
 * Współczynniki redukcji dla wiązek kabli (k_group)
 * Zgodnie z PN-HD 60364-5-52 Tabela B.52.17
 * Liczba obwodów wielożyłowych lub grup kabli jednożyłowych
 */
export const GROUPING_CORRECTION_FACTOR: Record<number, number> = {
  1: 1.00,
  2: 0.80,
  3: 0.70,
  4: 0.65,
  5: 0.60,
  6: 0.57,
  7: 0.54,
  8: 0.52,
  9: 0.50,
  10: 0.48,
  12: 0.45,
  14: 0.43,
  16: 0.41,
  18: 0.40,
  20: 0.38,
} as const

/**
 * Funkcja pomocnicza do uzyskania współczynnika temperaturowego
 * @param temperature - temperatura otoczenia [°C]
 * @param insulationType - typ izolacji ('PVC' | 'XLPE')
 * @returns współczynnik k_temp
 */
export const getTemperatureCorrectionFactor = (
  temperature: number,
  insulationType: 'PVC' | 'XLPE' = 'PVC'
): number => {
  const table = insulationType === 'PVC' ? TEMPERATURE_CORRECTION_PVC : TEMPERATURE_CORRECTION_XLPE

  // Jeśli temperatura jest w tabeli, zwróć wartość
  if (temperature in table) {
    return table[temperature]
  }

  // W przeciwnym razie interpoluj liniowo
  const temps = Object.keys(table).map(Number).sort((a, b) => a - b)

  // Jeśli temperatura poniżej minimalnej, użyj minimalnej
  if (temperature <= temps[0]) {
    return table[temps[0]]
  }

  // Jeśli temperatura powyżej maksymalnej, użyj maksymalnej
  if (temperature >= temps[temps.length - 1]) {
    return table[temps[temps.length - 1]]
  }

  // Interpolacja liniowa
  for (let i = 0; i < temps.length - 1; i++) {
    const t1 = temps[i]
    const t2 = temps[i + 1]

    if (temperature >= t1 && temperature <= t2) {
      const k1 = table[t1]
      const k2 = table[t2]
      const ratio = (temperature - t1) / (t2 - t1)
      return k1 + ratio * (k2 - k1)
    }
  }

  return 1.0 // fallback
}

/**
 * Funkcja pomocnicza do uzyskania współczynnika grupowania
 * @param numberOfCircuits - liczba obwodów w wiązce
 * @returns współczynnik k_group
 */
export const getGroupingCorrectionFactor = (numberOfCircuits: number): number => {
  // Jeśli liczba obwodów jest w tabeli, zwróć wartość
  if (numberOfCircuits in GROUPING_CORRECTION_FACTOR) {
    return GROUPING_CORRECTION_FACTOR[numberOfCircuits]
  }

  // Dla wartości większych niż 20, użyj współczynnika dla 20
  if (numberOfCircuits > 20) {
    return GROUPING_CORRECTION_FACTOR[20]
  }

  // Dla wartości mniejszych niż 1, zwróć 1.0
  if (numberOfCircuits < 1) {
    return 1.0
  }

  // Dla wartości pośrednich, znajdź najbliższą niższą wartość
  const keys = Object.keys(GROUPING_CORRECTION_FACTOR).map(Number).sort((a, b) => a - b)
  for (let i = keys.length - 1; i >= 0; i--) {
    if (numberOfCircuits >= keys[i]) {
      return GROUPING_CORRECTION_FACTOR[keys[i]]
    }
  }

  return 1.0 // fallback
}

