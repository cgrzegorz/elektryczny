/**
 * Dodatkowe funkcje obliczeniowe dla walidacji obwodów
 */

/**
 * Sprawdza czy spełniona jest złota zasada: IB ≤ In ≤ Iz
 * @param IB - prąd obliczeniowy obciążenia [A]
 * @param In - prąd znamionowy zabezpieczenia [A]
 * @param Iz - obciążalność długotrwała przewodu [A]
 * @returns true jeśli warunek spełniony
 */
export const checkGoldenRule = (IB: number, In: number, Iz: number): boolean => {
  // Warunek nie może być sprawdzony jeśli IB = 0
  if (IB === 0) return false
  return IB <= In && In <= Iz
}

/**
 * Sprawdza warunek przeciążeniowy (drugi stopień zabezpieczenia)
 * Warunek: I₂ ≤ 1.45 × Iz
 * Dla wyłączników nadprądowych: I₂ = 1.45 × In
 * Po uproszczeniu: In ≤ Iz (to samo co część złotej zasady)
 *
 * @param In - prąd znamionowy zabezpieczenia [A]
 * @param Iz - obciążalność długotrwała przewodu [A]
 * @returns true jeśli warunek spełniony
 */
export const checkOverloadProtection = (In: number, Iz: number): boolean => {
  // I₂ = 1.45 × In (prąd zadziałania w czasie umownym)
  const I2 = 1.45 * In
  // Warunek: I₂ ≤ 1.45 × Iz
  const maxAllowed = 1.45 * Iz
  return I2 <= maxAllowed
  // Po uproszczeniu: 1.45 × In ≤ 1.45 × Iz → In ≤ Iz
  // Czyli jest to zawarte w złotej zasadzie
}

/**
 * Oblicza prąd próbny zadziałania zabezpieczenia I₂
 * Dla wyłączników nadmiarowoprądowych (MCB): I₂ = 1.45 × In
 * @param In - prąd znamionowy zabezpieczenia [A]
 * @returns prąd próbny I₂ [A]
 */
export const calculateI2Current = (In: number): number => {
  return 1.45 * In
}

/**
 * Sprawdza warunek przeciążeniowy według normy (Zasada 1.45)
 * Warunek 1: IB ≤ In (obciążenie nie przekracza zabezpieczenia)
 * Warunek 2: I₂ ≤ 1.45 × Iz (zabezpieczenie chroni przewód)
 * @param IB - prąd obliczeniowy obciążenia [A]
 * @param In - prąd znamionowy zabezpieczenia [A]
 * @param Iz - obciążalność długotrwała przewodu [A]
 * @returns obiekt z wynikami weryfikacji
 */
export const checkOverloadProtectionFull = (
  IB: number,
  In: number,
  Iz: number
): {
  condition1: boolean // IB ≤ In
  condition2: boolean // I₂ ≤ 1.45 × Iz
  isValid: boolean // oba warunki spełnione
  I2: number
} => {
  const I2 = calculateI2Current(In)
  const condition1 = IB <= In
  const condition2 = I2 <= 1.45 * Iz

  return {
    condition1,
    condition2,
    isValid: condition1 && condition2,
    I2,
  }
}

/**
 * Oblicza prąd wyzwalający Ia na podstawie charakterystyki
 * @param In - prąd znamionowy zabezpieczenia [A]
 * @param multiplier - krotność dla charakterystyki
 * @returns prąd wyzwalający [A]
 */
export const calculateTripCurrent = (In: number, multiplier: number): number => {
  return In * multiplier
}

/**
 * Sprawdza warunek skuteczności wyłączenia zwarcia: Zs ≤ U0/Ia
 * @param Zs - impedancja pętli zwarcia [Ω]
 * @param U0 - napięcie fazowe [V] (230V dla sieci 230/400V)
 * @param Ia - prąd wyzwalający zabezpieczenia [A]
 * @returns true jeśli warunek spełniony
 */
export const checkShortCircuitProtection = (Zs: number, U0: number, Ia: number): boolean => {
  const maxZs = U0 / Ia
  return Zs <= maxZs
}

/**
 * Oblicza maksymalną dopuszczalną impedancję pętli zwarcia
 * @param U0 - napięcie fazowe [V]
 * @param Ia - prąd wyzwalający [A]
 * @returns maksymalna Zs [Ω]
 */
export const calculateMaxZs = (U0: number, Ia: number): number => {
  return U0 / Ia
}

/**
 * Oblicza spadek napięcia w przewodzie
 * @param current - prąd obciążenia [A]
 * @param resistance - rezystancja przewodu [Ω]
 * @returns spadek napięcia [V]
 */
export const calculateVoltageDropValue = (current: number, resistance: number): number => {
  return current * resistance
}

/**
 * Oblicza spadek napięcia procentowy
 * @param voltageDrop - spadek napięcia [V]
 * @param nominalVoltage - napięcie nominalne [V]
 * @returns spadek napięcia [%]
 */
export const calculateVoltageDropPercent = (voltageDrop: number, nominalVoltage: number): number => {
  return (voltageDrop / nominalVoltage) * 100
}

/**
 * Sprawdza minimalny przekrój ze względu na wytrzymałość zwarciową
 * @param Ik - prąd zwarciowy [A]
 * @param t - czas wyłączenia [s]
 * @param k - współczynnik materiału i izolacji
 * @returns minimalny przekrój [mm²]
 */
export const calculateMinCrossSection = (Ik: number, t: number, k: number): number => {
  return (Ik * Math.sqrt(t)) / k
}

/**
 * Sprawdza wytrzymałość cieplną przewodu (termika zwarciowa)
 * Warunek: t ≤ (k² × S²) / I²
 * lub alternatywnie: S ≥ (I × √t) / k
 *
 * @param Isc - prąd zwarcia [A]
 * @param t - czas wyłączenia [s]
 * @param S - przekrój przewodu [mm²]
 * @param k - współczynnik materiału i izolacji (115 dla Cu PVC)
 * @returns obiekt z wynikami weryfikacji
 */
export const checkThermalWithstand = (
  Isc: number,
  t: number,
  S: number,
  k: number
): {
  isValid: boolean
  maxTime: number // maksymalny dopuszczalny czas [s]
  minCrossSection: number // minimalny wymagany przekrój [mm²]
  energyLetThrough: number // energia przepuszczana I²t
} => {
  // Maksymalny dopuszczalny czas wyłączenia dla danego przekroju
  const maxTime = (k * k * S * S) / (Isc * Isc)

  // Minimalny wymagany przekrój dla danego czasu
  const minCrossSection = (Isc * Math.sqrt(t)) / k

  // Energia przepuszczana (I²t)
  const energyLetThrough = Isc * Isc * t

  return {
    isValid: t <= maxTime,
    maxTime,
    minCrossSection,
    energyLetThrough,
  }
}

/**
 * Oblicza prąd zwarcia z impedancji pętli zwarcia
 * @param Zs - impedancja pętli zwarcia [Ω]
 * @param U0 - napięcie fazowe [V]
 * @returns prąd zwarcia [A]
 */
export const calculateShortCircuitCurrent = (Zs: number, U0: number): number => {
  if (Zs === 0) return 0
  return U0 / Zs
}

/**
 * Szacuje czas wyłączenia na podstawie charakterystyki wyłącznika
 * Wartości przykładowe dla różnych krotności prądu
 * @param Isc - prąd zwarcia [A]
 * @param In - prąd znamionowy zabezpieczenia [A]
 * @param characteristic - charakterystyka wyłącznika
 * @returns szacowany czas wyłączenia [s]
 */
export const estimateDisconnectionTime = (
  Isc: number,
  In: number,
  characteristic: 'B' | 'C' | 'D'
): number => {
  const ratio = Isc / In

  // Uproszczone czasy wyłączenia (z charakterystyk czasowo-prądowych)
  // Dla wysokich krotności (zwarcie) czas jest bardzo krótki
  if (ratio >= 100) return 0.01 // 10ms
  if (ratio >= 50) return 0.02 // 20ms
  if (ratio >= 20) return 0.04 // 40ms
  if (ratio >= 10) return 0.1 // 100ms
  if (ratio >= 5) {
    // Strefa zadziałania magnetycznego
    if (characteristic === 'B') return 0.1
    if (characteristic === 'C') return 0.2
    return 0.4
  }

  // Poniżej granicy zadziałania magnetycznego - strefa termiczna
  return 5.0 // 5s (czas umowny)
}

