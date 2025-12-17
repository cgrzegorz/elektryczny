/**
 * Typy danych dla obwodów elektrycznych
 */

export type CircuitType = 'lighting' | 'sockets' | 'other' | 'motor' | 'wlz'
export type ProtectionCharacteristic = 'B' | 'C' | 'D'
export type CableMaterial = 'copper' | 'aluminum'
export type PhaseType = 'single' | 'three' // 1-fazowy lub 3-fazowy
export type InputMode = 'current' | 'power'
export type InstallationMethod = 'A1' | 'A2' | 'B1' | 'B2' | 'C' | 'D' | 'E' | 'F' | 'G'
export type ConductivityTemp = '20C' | '70C' // Temperatura dla przewodności
export type InsulationType = 'PVC' | 'XLPE' // Typ izolacji przewodu

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
  installationMethod?: InstallationMethod // sposób ułożenia
  conductivityTemp?: ConductivityTemp // temperatura dla obliczeń przewodności
  overloadProtectionValid?: boolean // warunek przeciążeniowy (zasada 1.45)
  thermalWithstandValid?: boolean // wytrzymałość cieplna
  // Nowe pola dla dynamicznego Iz
  ambientTemperature?: number // temperatura otoczenia [°C] (domyślnie 30°C)
  numberOfCircuitsInBundle?: number // liczba obwodów w wiązce (domyślnie 1)
  insulationType?: InsulationType // typ izolacji (domyślnie PVC)
  Idd?: number // obciążalność bazowa z tabeli [A]
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
    In: 32,
    characteristic: 'C',
    reason: 'Wejście Linii Zasilającej (3-fazowe, dla przyłącza ~17-20kW)'
  },
  other: {
    crossSection: 2.5,
    In: 16,
    characteristic: 'C',
    reason: 'Uniwersalny obwód'
  }
}


export const CIRCUIT_TYPE_LABELS: Record<CircuitType, string> = {
  lighting: 'Oświetlenie',
  sockets: 'Gniazda',
  motor: 'Silniki / Urządzenia 3-faz',
  wlz: 'WLZ (Wejście Linii Zasilającej)',
  other: 'Inne'
}


export const CHARACTERISTIC_LABELS: Record<ProtectionCharacteristic, string> = {
  B: 'B (5×In) - Instalacje mieszkaniowe',
  C: 'C (10×In) - Instalacje przemysłowe',
  D: 'D (20×In) - Silniki, transformatory'
}

export const PHASE_TYPE_LABELS: Record<PhaseType, string> = {
  single: '1-fazowy (230V)',
  three: '3-fazowy (400V)'
}
