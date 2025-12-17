# 🚀 Nowe Funkcjonalności - UX/UI Improvements

## ✨ Co zostało dodane:

### 1. **Przelicznik kW → Ampery** (1-faza i 3-fazy)

#### Nowe funkcje w `calculations.ts`:
- `calculateCurrentSinglePhase(powerKW, voltage, powerFactor)` 
  - Wzór: `IB = P / (U × cosφ)`
  - Dla 1-fazy (230V)
  
- `calculateCurrentThreePhase(powerKW, voltage, powerFactor)`
  - Wzór: `IB = P / (√3 × U × cosφ)`
  - Dla 3-faz (400V)
  - Domyślny cosφ = 0.93

#### Przykłady:
- **Pompa ciepła 6kW (3-faz)**: IB ≈ 9.3A
- **Oświetlenie 2kW (1-faz)**: IB ≈ 8.7A

---

### 2. **PowerInputSection - Nowa sekcja wejściowa**

#### Funkcje:
✅ Przełącznik **1-faza / 3-fazy**
✅ Tryb wprowadzania: **Moc [kW]** lub **Prąd [A]**
✅ Pole współczynnika mocy (cosφ)
✅ Automatyczne obliczanie IB z mocy
✅ Podział na dwie kolumny (lewo: dane, prawo: moc/prąd)

#### UI:
- Duże przyciski przełączające (czytelne)
- Kolor zielony dla aktywnego trybu
- Automatyczne podpowiedzi dla cosφ (1.0 dla 1-fazy, 0.93 dla 3-faz)
- Live calculation - wynik IB pokazywany natychmiast

---

### 3. **GoldenRuleVisualization - Wizualizacja na osi liczbowej**

Zamiast paska procentowego - **oś liczbowa** pokazująca:
- 🔵 **IB** (prąd obliczeniowy)
- 🟢 **In** (zabezpieczenie)
- 🟣 **Iz** (obciążalność przewodu)

#### Korzyści:
- Od razu widać relację między wartościami
- Zielona strefa między In a Iz (zakres poprawny)
- Skala automatycznie dostosowana do wartości

---

### 4. **Rozszerzone typy danych**

#### Nowe typy w `circuit.ts`:
```typescript
export type PhaseType = 'single' | 'three'
export type InputMode = 'current' | 'power'
export type CircuitType = '...' | 'motor' // dodano typ silnikowy
```

#### Rozszerzone Circuit interface:
```typescript
{
  phaseType?: PhaseType
  powerKW?: number
  powerFactor?: number
  // ...existing fields
}
```

---

### 5. **Walidacja w locie** (do implementacji w następnym kroku)

Plan:
- Czerwone podświetlenie gdy In > Iz
- Żółte ostrzeżenie gdy zapas < 5%
- Sugestie naprawcze w czasie rzeczywistym

---

## 📊 Struktura nowych plików:

```
src/
├── components/
│   ├── PowerInputSection.tsx         ← NOWE (przełącznik faz/mocy)
│   ├── GoldenRuleVisualization.tsx   ← NOWE (oś liczbowa)
│   └── ... (existing)
│
├── logic/
│   └── calculations.ts               ← ROZSZERZONE (kW→A)
│
├── types/
│   └── circuit.ts                    ← ROZSZERZONE (PhaseType, InputMode)
```

---

## 🎯 Następne kroki (do zaimplementowania):

### Krok 6: Integracja w Home.tsx
- Zamienić CircuitInputSection na PowerInputSection
- Dodać GoldenRuleVisualization do CalculationSection
- Obsłużyć nowy state (phaseType, inputMode, powerKW, powerFactor)

### Krok 7: Dashboard z widgetami
- Górny panel z ikonami
- Moc całkowita [kW]
- Liczba obwodów
- Sumaryczny prąd [A]

### Krok 8: Karty statusów ("sygnalizacja świetlna")
- Zielone tło: wszystko OK
- Żółte tło: ostrzeżenie (zapas < 5%)
- Czerwone tło: błąd (warunek niespełniony)

### Krok 9: Layout dwukolumnowy
- Lewa kolumna: WEJŚCIE (wszystkie pola input)
- Prawa kolumna: WYNIKI (live preview wyników)
- Brak przewijania - wszystko widoczne na jednym ekranie

---

## 🧪 Testowanie:

### Test 1: Pompa ciepła (3-faz, 6kW)
```
Input:
- Typ: Silniki/Urządzenia 3-faz
- Fazy: 3-fazowy
- Moc: 6 kW
- cosφ: 0.93

Oczekiwany wynik:
- IB ≈ 9.3A
- Sugestia: B20, 2.5mm²
```

### Test 2: Oświetlenie (1-faz, 2kW)
```
Input:
- Typ: Oświetlenie
- Fazy: 1-fazowy
- Moc: 2 kW
- cosφ: 1.0

Oczekiwany wynik:
- IB ≈ 8.7A
- Sugestia: B10, 1.5mm²
```

---

## ⚠️ Uwagi:

1. **TypeScript cache**: Jeśli IDE pokazuje błędy z PhaseType/InputMode - zrestartuj TypeScript Server (Ctrl+Shift+P → "TypeScript: Restart TS Server")

2. **Kompatybilność wsteczna**: Stare obwody bez phaseType/powerKW będą nadal działać (opcjonalne pola)

3. **Walidacja cosφ**: Należy sprawdzać czy 0 < cosφ ≤ 1.0

---

## 📝 Do zrobienia w kolejnym commicie:

- [ ] Integracja PowerInputSection w Home.tsx
- [ ] Dodanie GoldenRuleVisualization do CalculationSection
- [ ] Obsługa state dla nowych pól
- [ ] Dashboard z widgetami na górze
- [ ] Karty statusów z kolorami (zielony/żółty/czerwony)
- [ ] Layout dwukolumnowy (wejście | wyniki)
- [ ] Walidacja w locie (czerwone podświetlenie gdy In > Iz)

---

Wszystkie nowe komponenty są gotowe do użycia! 🎉

