/**
 * Tabele wartości dopuszczalnych obciążeń prądowych (Iz)
 * Wartości przykładowe - do uzupełnienia danymi z norm/notatek
 */

export interface CableCapacity {
  crossSection: number // mm²
  copperIz: number // A
  aluminumIz?: number // A
}


export const CABLE_CAPACITY_A1: CableCapacity[] = [
  { crossSection: 1.5, copperIz: 13.5, aluminumIz: 10.5 },
  { crossSection: 2.5, copperIz: 18, aluminumIz: 14 },
  { crossSection: 4, copperIz: 24, aluminumIz: 19 },
  { crossSection: 6, copperIz: 31, aluminumIz: 24 },
  { crossSection: 10, copperIz: 42, aluminumIz: 33 },
  { crossSection: 16, copperIz: 56, aluminumIz: 43 },
  { crossSection: 25, copperIz: 73, aluminumIz: 57 },
  { crossSection: 35, copperIz: 89, aluminumIz: 70 },
  { crossSection: 50, copperIz: 110, aluminumIz: 86 },
  { crossSection: 70, copperIz: 139, aluminumIz: 109 },
  { crossSection: 95, copperIz: 167, aluminumIz: 131 },
  { crossSection: 120, copperIz: 192, aluminumIz: 151 },
]


export const CABLE_CAPACITY_B2: CableCapacity[] = [
  { crossSection: 1.5, copperIz: 15.5, aluminumIz: 12 },
  { crossSection: 2.5, copperIz: 21, aluminumIz: 16 },
  { crossSection: 4, copperIz: 28, aluminumIz: 22 },
  { crossSection: 6, copperIz: 36, aluminumIz: 28 },
  { crossSection: 10, copperIz: 50, aluminumIz: 39 },
  { crossSection: 16, copperIz: 68, aluminumIz: 53 },
  { crossSection: 25, copperIz: 89, aluminumIz: 69 },
  { crossSection: 35, copperIz: 110, aluminumIz: 85 },
  { crossSection: 50, copperIz: 134, aluminumIz: 104 },
  { crossSection: 70, copperIz: 171, aluminumIz: 133 },
  { crossSection: 95, copperIz: 207, aluminumIz: 161 },
  { crossSection: 120, copperIz: 239, aluminumIz: 186 },
]


export const CABLE_CAPACITY_C: CableCapacity[] = [
  { crossSection: 1.5, copperIz: 19, aluminumIz: 15 },
  { crossSection: 2.5, copperIz: 26, aluminumIz: 20 },
  { crossSection: 4, copperIz: 34, aluminumIz: 27 },
  { crossSection: 6, copperIz: 43, aluminumIz: 34 },
  { crossSection: 10, copperIz: 59, aluminumIz: 46 },
  { crossSection: 16, copperIz: 79, aluminumIz: 62 },
  { crossSection: 25, copperIz: 103, aluminumIz: 81 },
  { crossSection: 35, copperIz: 126, aluminumIz: 99 },
  { crossSection: 50, copperIz: 153, aluminumIz: 121 },
  { crossSection: 70, copperIz: 192, aluminumIz: 151 },
  { crossSection: 95, copperIz: 232, aluminumIz: 183 },
  { crossSection: 120, copperIz: 269, aluminumIz: 212 },
]


export const findCableCapacity = (
  crossSection: number,
  table: CableCapacity[],
  material: 'copper' | 'aluminum' = 'copper'
): number | undefined => {
  const entry = table.find(item => item.crossSection === crossSection)
  if (!entry) return undefined
  return material === 'copper' ? entry.copperIz : entry.aluminumIz
}

/**
 * Typ sposobu ułożenia przewodu zgodnie z PN-HD 60364-5-52
 */
export type InstallationMethod = 'A1' | 'A2' | 'B1' | 'B2' | 'C' | 'D' | 'E' | 'F' | 'G'

/**
 * Mapowanie sposobów ułożenia na tabele obciążalności
 */
export const INSTALLATION_METHOD_LABELS: Record<InstallationMethod, string> = {
  A1: 'A1 - Przewody izolowane w rurze w ścianie',
  A2: 'A2 - Kabel wielożyłowy w rurze w ścianie',
  B1: 'B1 - Przewody izolowane w rurze na ścianie lub w pustce',
  B2: 'B2 - Kabel wielożyłowy w rurze na ścianie lub w pustce',
  C: 'C - Kabel wielożyłowy bezpośrednio na ścianie lub suficie',
  D: 'D - Kabel wielożyłowy w kanale instalacyjnym',
  E: 'E - Kabel wielożyłowy w powietrzu',
  F: 'F - Kabel jednożyłowy w powietrzu na wspornikach',
  G: 'G - Kabel wielożyłowy w ziemi',
}

/**
 * Mapowanie sposobów ułożenia na odpowiednie tabele
 */
export const INSTALLATION_METHOD_TO_TABLE: Record<InstallationMethod, CableCapacity[]> = {
  A1: CABLE_CAPACITY_A1,
  A2: CABLE_CAPACITY_A1,
  B1: CABLE_CAPACITY_B2,
  B2: CABLE_CAPACITY_B2,
  C: CABLE_CAPACITY_C,
  D: CABLE_CAPACITY_C,
  E: CABLE_CAPACITY_C,
  F: CABLE_CAPACITY_C,
  G: CABLE_CAPACITY_C,
}

/**
 * Pobiera obciążalność przewodu w zależności od sposobu ułożenia
 */
export const getCableCapacityByInstallation = (
  crossSection: number,
  method: InstallationMethod,
  material: 'copper' | 'aluminum' = 'copper'
): number | undefined => {
  const table = INSTALLATION_METHOD_TO_TABLE[method]
  return findCableCapacity(crossSection, table, material)
}

/**
 * Pobiera obciążalność przewodu z uwzględnieniem współczynników poprawkowych
 * Wzór: Iz = Idd × k_temp × k_group
 *
 * @param crossSection - przekrój przewodu [mm²]
 * @param method - sposób ułożenia
 * @param material - materiał przewodu
 * @param temperature - temperatura otoczenia [°C] (domyślnie 30°C)
 * @param numberOfCircuits - liczba obwodów w wiązce (domyślnie 1)
 * @param insulationType - typ izolacji (domyślnie 'PVC')
 * @returns Iz - dopuszczalna obciążalność długotrwała [A] lub undefined
 */
export const getCableCapacityByInstallationDynamic = (
  crossSection: number,
  method: InstallationMethod,
  material: 'copper' | 'aluminum' = 'copper',
  temperature: number = 30,
  numberOfCircuits: number = 1,
  insulationType: 'PVC' | 'XLPE' = 'PVC'
): number | undefined => {
  // Pobierz obciążalność bazową Idd
  const Idd = getCableCapacityByInstallation(crossSection, method, material)

  if (!Idd) {
    return undefined
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
    const keys = Object.keys(GROUPING_CORRECTION_FACTOR).map(Number).sort((a, b) => a - b)
    for (let i = keys.length - 1; i >= 0; i--) {
      if (numberOfCircuits >= keys[i]) {
        k_group = GROUPING_CORRECTION_FACTOR[keys[i]]
        break
      }
    }
  }

  // Oblicz Iz = Idd × k_temp × k_group
  const Iz = Idd * k_temp * k_group

  // Zaokrąglij do 2 miejsc po przecinku
  return Math.round(Iz * 100) / 100
}

// Współczynniki poprawkowe - zdefiniowane lokalnie
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
