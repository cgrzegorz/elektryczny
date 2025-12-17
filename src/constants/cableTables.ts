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

