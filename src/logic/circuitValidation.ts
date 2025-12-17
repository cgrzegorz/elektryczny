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
  return IB <= In && In <= Iz
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

