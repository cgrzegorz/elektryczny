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

