/**
 * Plik zawierający czyste funkcje JS z wzorami elektrycznymi
 * Wszystkie funkcje są bez side-effects i łatwe do testowania
 */

/**
 * Oblicza prąd z mocy dla instalacji jednofazowej (230V)
 * Wzór: IB = P / U
 * @param powerKW - moc w kilowatach [kW]
 * @param voltage - napięcie [V] (domyślnie 230V)
 * @param powerFactor - współczynnik mocy cosφ (domyślnie 1.0)
 * @returns prąd obliczeniowy IB [A]
 */
export const calculateCurrentSinglePhase = (
  powerKW: number,
  voltage: number = 230,
  powerFactor: number = 1.0
): number => {
  if (powerKW <= 0 || voltage <= 0 || powerFactor <= 0) return 0
  const powerW = powerKW * 1000
  return powerW / (voltage * powerFactor)
}

/**
 * Oblicza prąd z mocy dla instalacji trójfazowej (400V)
 * Wzór: IB = P / (√3 × U × cosφ)
 * @param powerKW - moc w kilowatach [kW]
 * @param voltage - napięcie międzyfazowe [V] (domyślnie 400V)
 * @param powerFactor - współczynnik mocy cosφ (domyślnie 0.93)
 * @returns prąd obliczeniowy IB [A]
 */
export const calculateCurrentThreePhase = (
  powerKW: number,
  voltage: number = 400,
  powerFactor: number = 0.93
): number => {
  if (powerKW <= 0 || voltage <= 0 || powerFactor <= 0) return 0
  const powerW = powerKW * 1000
  const sqrt3 = Math.sqrt(3) // ≈ 1.732
  return powerW / (sqrt3 * voltage * powerFactor)
}

/**
 * Przykładowe funkcje obliczeń elektrycznych
 * (Do uzupełnienia konkretnymi wzorami z notatek)
 */

/**
 * Oblicza spadek napięcia
 * @param current - prąd obciążenia [A]
 * @param resistance - rezystancja przewodu [Ω]
 * @returns spadek napięcia [V]
 */
export const calculateVoltageDrop = (current: number, resistance: number): number => {
  return current * resistance
}

/**
 * Oblicza spadek napięcia procentowy dla instalacji jednofazowej
 * @param IB - prąd obliczeniowy [A]
 * @param length - długość przewodu [m]
 * @param crossSection - przekrój przewodu [mm²]
 * @param voltage - napięcie zasilania [V] (domyślnie 230V)
 * @param resistivity - rezystywność materiału [Ω·mm²/m] (miedź: 0.0175, aluminium: 0.0278)
 * @returns spadek napięcia [%]
 */
export const calculateVoltageDropPercent = (
  IB: number,
  length: number,
  crossSection: number,
  voltage: number = 230,
  resistivity: number = 0.0175 // miedź
): number => {
  if (crossSection === 0 || voltage === 0 || IB === 0 || length === 0) return 0
  if (IB < 0 || length < 0 || crossSection < 0) return 0

  // Dla jednofazowego: ΔU% = (2 × IB × ρ × L) / (S × U) × 100%
  // Mnożymy przez 2, bo prąd płynie tam i z powrotem
  const voltageDrop = (2 * IB * resistivity * length) / (crossSection * voltage) * 100

  // Zaokrąglij do 2 miejsc po przecinku
  return Math.round(voltageDrop * 100) / 100
}

/**
 * Oblicza moc czynną
 * @param voltage - napięcie [V]
 * @param current - prąd [A]
 * @param powerFactor - współczynnik mocy cosφ
 * @returns moc czynna [W]
 */
export const calculateActivePower = (
  voltage: number,
  current: number,
  powerFactor: number
): number => {
  return voltage * current * powerFactor
}

/**
 * Oblicza prąd na podstawie mocy i napięcia
 * @param power - moc [W]
 * @param voltage - napięcie [V]
 * @param powerFactor - współczynnik mocy cosφ
 * @returns prąd [A]
 */
export const calculateCurrent = (
  power: number,
  voltage: number,
  powerFactor: number = 1
): number => {
  return power / (voltage * powerFactor)
}

/**
 * Oblicza rezystancję przewodu
 * @param resistivity - rezystywność materiału [Ω·mm²/m]
 * @param length - długość przewodu [m]
 * @param crossSection - przekrój przewodu [mm²]
 * @returns rezystancja [Ω]
 */
export const calculateResistance = (
  resistivity: number,
  length: number,
  crossSection: number
): number => {
  return (resistivity * length) / crossSection
}

