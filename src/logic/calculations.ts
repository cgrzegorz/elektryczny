/**
 * Plik zawierający czyste funkcje JS z wzorami elektrycznymi
 * Wszystkie funkcje są bez side-effects i łatwe do testowania
 */

/**
 * Oblicza prąd z mocy dla instalacji jednofazowej (230V)
 * Wzór: IB = P / (U × cosφ)
 * @param powerKW - moc w kilowatach [kW]
 * @param voltage - napięcie [V] (domyślnie 230V)
 * @param powerFactor - współczynnik mocy cosφ (domyślnie 1.0)
 * @returns prąd obliczeniowy IB [A] zaokrąglony do 2 miejsc po przecinku
 * @throws Error gdy powerFactor = 0 (dzielenie przez zero)
 */
export const calculateCurrentSinglePhase = (
  powerKW: number,
  voltage: number = 230,
  powerFactor: number = 1.0
): number => {
  // Walidacja parametrów wejściowych
  if (powerKW <= 0 || voltage <= 0) return 0

  // Walidacja współczynnika mocy - nie może być 0 (dzielenie przez zero)
  if (powerFactor <= 0 || powerFactor > 1.0) {
    console.error(`Nieprawidłowy współczynnik mocy: ${powerFactor}. Musi być w zakresie (0, 1]`)
    return 0
  }

  // Konwersja kW na W
  const powerW = powerKW * 1000

  // Obliczenie prądu: IB = P / (U × cosφ)
  const current = powerW / (voltage * powerFactor)

  // Zaokrąglenie do 2 miejsc po przecinku
  return Math.round(current * 100) / 100
}

/**
 * Oblicza prąd z mocy dla instalacji trójfazowej (400V)
 * Wzór: IB = P / (√3 × U × cosφ)
 * @param powerKW - moc w kilowatach [kW]
 * @param voltage - napięcie międzyfazowe [V] (domyślnie 400V)
 * @param powerFactor - współczynnik mocy cosφ (domyślnie 0.93)
 * @returns prąd obliczeniowy IB [A] zaokrąglony do 2 miejsc po przecinku
 * @throws Error gdy powerFactor = 0 (dzielenie przez zero)
 */
export const calculateCurrentThreePhase = (
  powerKW: number,
  voltage: number = 400,
  powerFactor: number = 0.93
): number => {
  // Walidacja parametrów wejściowych
  if (powerKW <= 0 || voltage <= 0) return 0

  // Walidacja współczynnika mocy - nie może być 0 (dzielenie przez zero)
  if (powerFactor <= 0 || powerFactor > 1.0) {
    console.error(`Nieprawidłowy współczynnik mocy: ${powerFactor}. Musi być w zakresie (0, 1]`)
    return 0
  }

  // Konwersja kW na W
  const powerW = powerKW * 1000

  // √3 ≈ 1.732
  const sqrt3 = Math.sqrt(3)

  // Obliczenie prądu: IB = P / (√3 × U × cosφ)
  const current = powerW / (sqrt3 * voltage * powerFactor)

  // Zaokrąglenie do 2 miejsc po przecinku
  return Math.round(current * 100) / 100
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
 * @param resistivity - rezystywność materiału [Ω·mm²/m] (miedź: 0.0175)
 * @param powerFactor - współczynnik mocy cosφ (domyślnie 1.0)
 * @returns spadek napięcia [%]
 */
export const calculateVoltageDropPercentSinglePhase = (
  IB: number,
  length: number,
  crossSection: number,
  voltage: number = 230,
  resistivity: number = 0.0175,
  powerFactor: number = 1.0
): number => {
  if (crossSection === 0 || voltage === 0 || IB === 0 || length === 0) return 0
  if (IB < 0 || length < 0 || crossSection < 0) return 0

  // Dla 1-fazy: ΔU% = (2 × IB × ρ × L × cosφ) / (S × U) × 100%
  // Mnożymy przez 2, bo prąd płynie tam i z powrotem (faza + neutral)
  const voltageDrop = (2 * IB * resistivity * length * powerFactor) / (crossSection * voltage) * 100

  return Math.round(voltageDrop * 100) / 100
}

/**
 * Oblicza spadek napięcia procentowy dla instalacji jednofazowej z użyciem przewodności
 * Wzór: ΔU% = (2 × L × IB × cosφ) / (γ × S × U) × 100%
 * @param IB - prąd obliczeniowy [A]
 * @param length - długość przewodu [m]
 * @param crossSection - przekrój przewodu [mm²]
 * @param voltage - napięcie zasilania [V] (domyślnie 230V)
 * @param conductivity - przewodność właściwa γ [m/(Ω·mm²)] (Cu 20°C: 56, Cu 70°C: 46)
 * @param powerFactor - współczynnik mocy cosφ (domyślnie 1.0)
 * @returns spadek napięcia [%]
 */
export const calculateVoltageDropPercentSinglePhaseByConductivity = (
  IB: number,
  length: number,
  crossSection: number,
  voltage: number = 230,
  conductivity: number = 56,
  powerFactor: number = 1.0
): number => {
  if (crossSection === 0 || voltage === 0 || IB === 0 || length === 0 || conductivity === 0) return 0
  if (IB < 0 || length < 0 || crossSection < 0) return 0

  // ΔU% = (2 × L × IB × cosφ) / (γ × S × U) × 100%
  const voltageDrop = (2 * length * IB * powerFactor) / (conductivity * crossSection * voltage) * 100

  return Math.round(voltageDrop * 100) / 100
}

/**
 * Oblicza spadek napięcia procentowy dla instalacji trójfazowej
 * @param IB - prąd obliczeniowy [A]
 * @param length - długość przewodu [m]
 * @param crossSection - przekrój przewodu [mm²]
 * @param voltage - napięcie międzyfazowe [V] (domyślnie 400V)
 * @param resistivity - rezystywność materiału [Ω·mm²/m] (miedź: 0.0175)
 * @param powerFactor - współczynnik mocy cosφ (domyślnie 0.93)
 * @returns spadek napięcia [%]
 */
export const calculateVoltageDropPercentThreePhase = (
  IB: number,
  length: number,
  crossSection: number,
  voltage: number = 400,
  resistivity: number = 0.0175,
  powerFactor: number = 0.93
): number => {
  if (crossSection === 0 || voltage === 0 || IB === 0 || length === 0) return 0
  if (IB < 0 || length < 0 || crossSection < 0) return 0

  // Dla 3-faz: ΔU% = (√3 × IB × ρ × L × cosφ) / (S × U) × 100%
  // √3 ≈ 1.732 (NIE mnożymy przez 2!)
  // W układzie 3-fazowym symetrycznym prądy w neutralu się znoszą
  const sqrt3 = Math.sqrt(3)
  const voltageDrop = (sqrt3 * IB * resistivity * length * powerFactor) / (crossSection * voltage) * 100

  return Math.round(voltageDrop * 100) / 100
}

/**
 * Oblicza spadek napięcia procentowy dla instalacji trójfazowej z użyciem przewodności
 * Wzór: ΔU% = (√3 × L × IB × cosφ) / (γ × S × U) × 100%
 * @param IB - prąd obliczeniowy [A]
 * @param length - długość przewodu [m]
 * @param crossSection - przekrój przewodu [mm²]
 * @param voltage - napięcie międzyfazowe [V] (domyślnie 400V)
 * @param conductivity - przewodność właściwa γ [m/(Ω·mm²)] (Cu 20°C: 56, Cu 70°C: 46)
 * @param powerFactor - współczynnik mocy cosφ (domyślnie 0.93)
 * @returns spadek napięcia [%]
 */
export const calculateVoltageDropPercentThreePhaseByConductivity = (
  IB: number,
  length: number,
  crossSection: number,
  voltage: number = 400,
  conductivity: number = 56,
  powerFactor: number = 0.93
): number => {
  if (crossSection === 0 || voltage === 0 || IB === 0 || length === 0 || conductivity === 0) return 0
  if (IB < 0 || length < 0 || crossSection < 0) return 0

  // ΔU% = (√3 × L × IB × cosφ) / (γ × S × U) × 100%
  const sqrt3 = Math.sqrt(3)
  const voltageDrop = (sqrt3 * length * IB * powerFactor) / (conductivity * crossSection * voltage) * 100

  return Math.round(voltageDrop * 100) / 100
}

/**
 * PRZESTARZAŁA - użyj calculateVoltageDropPercentSinglePhase lub calculateVoltageDropPercentThreePhase
 * @deprecated
 */
export const calculateVoltageDropPercent = calculateVoltageDropPercentSinglePhase

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

/**
 * Oblicza dynamiczną obciążalność długotrwałą przewodu Iz
 * zgodnie z normą PN-HD 60364-5-52
 *
 * Wzór: Iz = Idd × k_temp × k_group
 *
 * @param Idd - obciążalność bazowa z tabeli normy [A]
 * @param temperature - temperatura otoczenia [°C] (domyślnie 30°C - temperatura bazowa)
 * @param numberOfCircuits - liczba obwodów w wiązce (domyślnie 1)
 * @param insulationType - typ izolacji ('PVC' | 'XLPE') (domyślnie 'PVC')
 * @returns Iz - dopuszczalna obciążalność długotrwała przewodu [A]
 */
export const calculateDynamicCableCapacity = (
  Idd: number,
  temperature: number = 30,
  numberOfCircuits: number = 1,
  insulationType: 'PVC' | 'XLPE' = 'PVC'
): number => {
  // Import funkcji z electricalData - będzie działać dzięki bundlerowi
  // W przypadku problemów z importem cyklicznym, te funkcje można przenieść tutaj

  // Walidacja Idd
  if (Idd <= 0) {
    console.error('Nieprawidłowa wartość Idd (obciążalność bazowa)')
    return 0
  }

  // Oblicz współczynnik temperaturowy k_temp
  let k_temp = 1.0
  const tempTable = insulationType === 'PVC'
    ? TEMPERATURE_CORRECTION_PVC
    : TEMPERATURE_CORRECTION_XLPE

  if (temperature in tempTable) {
    k_temp = tempTable[temperature]
  } else {
    // Interpolacja liniowa
    const temps = Object.keys(tempTable).map(Number).sort((a, b) => a - b)

    if (temperature <= temps[0]) {
      k_temp = tempTable[temps[0]]
    } else if (temperature >= temps[temps.length - 1]) {
      k_temp = tempTable[temps[temps.length - 1]]
    } else {
      for (let i = 0; i < temps.length - 1; i++) {
        const t1 = temps[i]
        const t2 = temps[i + 1]

        if (temperature >= t1 && temperature <= t2) {
          const k1 = tempTable[t1]
          const k2 = tempTable[t2]
          const ratio = (temperature - t1) / (t2 - t1)
          k_temp = k1 + ratio * (k2 - k1)
          break
        }
      }
    }
  }

  // Oblicz współczynnik grupowania k_group
  let k_group = 1.0
  if (numberOfCircuits in GROUPING_CORRECTION_FACTOR) {
    k_group = GROUPING_CORRECTION_FACTOR[numberOfCircuits]
  } else if (numberOfCircuits > 20) {
    k_group = GROUPING_CORRECTION_FACTOR[20]
  } else if (numberOfCircuits >= 1) {
    // Znajdź najbliższą niższą wartość
    const keys = Object.keys(GROUPING_CORRECTION_FACTOR).map(Number).sort((a, b) => a - b)
    for (let i = keys.length - 1; i >= 0; i--) {
      if (numberOfCircuits >= keys[i]) {
        k_group = GROUPING_CORRECTION_FACTOR[keys[i]]
        break
      }
    }
  }

  // Oblicz Iz
  const Iz = Idd * k_temp * k_group

  // Zaokrąglij do 2 miejsc po przecinku
  return Math.round(Iz * 100) / 100
}

// Tabele współczynników - tymczasowo zdefiniowane tutaj, aby uniknąć importów cyklicznych
// W produkcji powinny być importowane z electricalData.ts
const TEMPERATURE_CORRECTION_PVC: Record<number, number> = {
  10: 1.22,
  15: 1.17,
  20: 1.12,
  25: 1.06,
  30: 1.00,
  35: 0.94,
  40: 0.87,
  45: 0.79,
  50: 0.71,
  55: 0.61,
  60: 0.50,
}

const TEMPERATURE_CORRECTION_XLPE: Record<number, number> = {
  10: 1.15,
  15: 1.12,
  20: 1.08,
  25: 1.04,
  30: 1.00,
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
}

const GROUPING_CORRECTION_FACTOR: Record<number, number> = {
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
}
