/**
 * Testy jednostkowe dla funkcji obliczania prądu obciążenia IB
 * Weryfikacja zgodności z wymaganiami zadania
 */

import { calculateCurrentSinglePhase, calculateCurrentThreePhase } from './calculations'

/**
 * Test 1: Obciążenie 3.5 kW, cosφ = 0.8, 1-faza
 * Oczekiwany wynik: ~19.02 A
 */
export const testCase1 = () => {
  const result = calculateCurrentSinglePhase(3.5, 230, 0.8)
  const expected = 19.02
  console.log('Test 1: 3.5kW, cosφ=0.8, 1-faza')
  console.log(`  Obliczony: ${result}A`)
  console.log(`  Oczekiwany: ${expected}A`)
  console.log(`  Status: ${Math.abs(result - expected) < 0.01 ? '✅ PASS' : '❌ FAIL'}`)
  return Math.abs(result - expected) < 0.01
}

/**
 * Test 2: Obciążenie 11 kW, cosφ = 0.85, 3-fazy
 * Oczekiwany wynik: ~18.68 A
 */
export const testCase2 = () => {
  const result = calculateCurrentThreePhase(11, 400, 0.85)
  const expected = 18.68
  console.log('Test 2: 11kW, cosφ=0.85, 3-fazy')
  console.log(`  Obliczony: ${result}A`)
  console.log(`  Oczekiwany: ${expected}A`)
  console.log(`  Status: ${Math.abs(result - expected) < 0.01 ? '✅ PASS' : '❌ FAIL'}`)
  return Math.abs(result - expected) < 0.01
}

/**
 * Test 3: Walidacja cosφ = 0 (powinno zwrócić 0 i błąd)
 */
export const testCase3 = () => {
  const result = calculateCurrentSinglePhase(3.5, 230, 0)
  console.log('Test 3: Walidacja cosφ=0')
  console.log(`  Wynik: ${result}A`)
  console.log(`  Status: ${result === 0 ? '✅ PASS (zwrócono 0)' : '❌ FAIL'}`)
  return result === 0
}

/**
 * Test 4: Walidacja cosφ > 1.0 (powinno zwrócić 0 i błąd)
 */
export const testCase4 = () => {
  const result = calculateCurrentSinglePhase(3.5, 230, 1.5)
  console.log('Test 4: Walidacja cosφ=1.5 (>1.0)')
  console.log(`  Wynik: ${result}A`)
  console.log(`  Status: ${result === 0 ? '✅ PASS (zwrócono 0)' : '❌ FAIL'}`)
  return result === 0
}

/**
 * Test 5: Domyślny cosφ = 1.0 dla 1-fazy
 */
export const testCase5 = () => {
  const result = calculateCurrentSinglePhase(2.3, 230)
  const expected = 10.0 // 2300W / 230V = 10A
  console.log('Test 5: Domyślny cosφ=1.0')
  console.log(`  Obliczony: ${result}A`)
  console.log(`  Oczekiwany: ${expected}A`)
  console.log(`  Status: ${Math.abs(result - expected) < 0.01 ? '✅ PASS' : '❌ FAIL'}`)
  return Math.abs(result - expected) < 0.01
}

/**
 * Test 6: Domyślny cosφ = 0.93 dla 3-faz
 */
export const testCase6 = () => {
  const result = calculateCurrentThreePhase(6.45, 400) // 6.45kW przy cosφ=0.93 → ~10A
  const expected = 10.0
  console.log('Test 6: Domyślny cosφ=0.93 dla 3-faz')
  console.log(`  Obliczony: ${result}A`)
  console.log(`  Oczekiwany: ~${expected}A`)
  console.log(`  Status: ${Math.abs(result - expected) < 0.1 ? '✅ PASS' : '❌ FAIL'}`)
  return Math.abs(result - expected) < 0.1
}

/**
 * Test 7: Zaokrąglenie do 2 miejsc po przecinku
 */
export const testCase7 = () => {
  const result = calculateCurrentSinglePhase(3.333, 230, 0.777)
  const decimalPlaces = (result.toString().split('.')[1] || '').length
  console.log('Test 7: Zaokrąglenie do 2 miejsc')
  console.log(`  Wynik: ${result}A`)
  console.log(`  Liczba miejsc: ${decimalPlaces}`)
  console.log(`  Status: ${decimalPlaces <= 2 ? '✅ PASS' : '❌ FAIL'}`)
  return decimalPlaces <= 2
}

/**
 * Uruchom wszystkie testy
 */
export const runAllTests = () => {
  console.log('\n=== TESTY FUNKCJI OBLICZANIA PRĄDU IB ===\n')

  const results = [
    testCase1(),
    testCase2(),
    testCase3(),
    testCase4(),
    testCase5(),
    testCase6(),
    testCase7(),
  ]

  const passed = results.filter(r => r).length
  const total = results.length

  console.log(`\n=== PODSUMOWANIE ===`)
  console.log(`Testy przeszło: ${passed}/${total}`)
  console.log(`Status: ${passed === total ? '✅ WSZYSTKIE PRZESZŁY' : '❌ NIEKTÓRE NIE PRZESZŁY'}`)

  return passed === total
}

// Możliwość uruchomienia testów w konsoli
if (typeof window !== 'undefined') {
  (window as any).runCalculationTests = runAllTests
  console.log('💡 Aby uruchomić testy, wpisz w konsoli: runCalculationTests()')
}

