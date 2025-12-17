/**
 * Typy danych dla obwodów elektrycznych
 */

export type CircuitType = 'lighting' | 'sockets' | 'other'
export type ProtectionCharacteristic = 'B' | 'C' | 'D'
export type CableMaterial = 'copper' | 'aluminum'

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
    reason: 'Standardowy obwód oświetleniowy'
  },
  sockets: {
    crossSection: 2.5,
    In: 16,
    characteristic: 'B',
    reason: 'Standardowy obwód gniazd wtykowych'
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

