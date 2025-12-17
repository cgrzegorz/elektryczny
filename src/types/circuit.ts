/**
 * Typy danych dla obwodów elektrycznych
 */

export type CircuitType = 'lighting' | 'sockets' | 'other' | 'motor'
export type ProtectionCharacteristic = 'B' | 'C' | 'D'
export type CableMaterial = 'copper' | 'aluminum'
export type PhaseType = 'single' | 'three' // 1-fazowy lub 3-fazowy
export type InputMode = 'current' | 'power'

export interface Circuit {
  id: string
  name: string
  type: CircuitType
  IB: number
  In: number
  characteristic: ProtectionCharacteristic
  crossSection: number
  material: CableMaterial
  Iz: number // obciążalność długotrwała [A]
  phaseType?: PhaseType // typ faz
  powerKW?: number // moc w kW (jeśli wprowadzono przez moc)
  powerFactor?: number // współczynnik mocy cosφ
  length?: number // długość przewodu [m]
  Zs?: number // impedancja pętli zwarcia [Ω]
  voltageDrop?: number // spadek napięcia [%]
  swzValid?: boolean // warunek SWZ spełniony
  goldenRuleValid?: boolean // złota zasada spełniona
}

export interface CircuitSuggestion {
  crossSection: number
  In: number
  characteristic: ProtectionCharacteristic
  reason: string
}

/**
 * Sugestie standardowych konfiguracji dla typów obwodów
 */
export const CIRCUIT_SUGGESTIONS: Record<CircuitType, CircuitSuggestion> = {
  lighting: {
    crossSection: 1.5,
    In: 10,
    characteristic: 'B',
    reason: 'Standardowy obwód oświetleniowy (1-fazowy)'
  },
  sockets: {
    crossSection: 2.5,
    In: 16,
    characteristic: 'B',
    reason: 'Standardowy obwód gniazd wtykowych (1-fazowy)'
  },
  motor: {
    crossSection: 2.5,
    In: 20,
    characteristic: 'C',
    reason: 'Obwód silnikowy (często 3-fazowy)'
  },
  wlz: {
    crossSection: 10,
    In: 63,
    characteristic: 'C',
    reason: 'Wejście Linii Zasilającej (3-fazowe, główny kabel budynku)'
  },
  other: {
    crossSection: 2.5,
    In: 16,
    characteristic: 'C',
    reason: 'Uniwersalny obwód'
  }
}

/**
 * Etykiety dla typów obwodów
 */
export const CIRCUIT_TYPE_LABELS: Record<CircuitType, string> = {
  lighting: 'Oświetlenie',
  sockets: 'Gniazda',
  motor: 'Silniki / Urządzenia 3-faz',
  wlz: 'WLZ (Wejście Linii Zasilającej)',
  other: 'Inne'
}

/**
 * Etykiety dla charakterystyk
 */
export const CHARACTERISTIC_LABELS: Record<ProtectionCharacteristic, string> = {
  B: 'B (5×In) - Instalacje mieszkaniowe',
  C: 'C (10×In) - Instalacje przemysłowe',
  D: 'D (20×In) - Silniki, transformatory'
}

/**
 * Etykiety dla typów faz
 */
export const PHASE_TYPE_LABELS: Record<PhaseType, string> = {
  single: '1-fazowy (230V)',
  three: '3-fazowy (400V)'
}
