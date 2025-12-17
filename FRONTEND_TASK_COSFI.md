# 🎨 [FE] Zadanie: Dropdown Współczynnika Mocy (cosφ) z Podpowiedziami

## 📋 Kontekst

Backend został rozbudowany o obsługę współczynnika mocy (cosφ) w obliczeniach prądu obciążenia I<sub>B</sub>. Frontend musi zapewnić wygodny interfejs do wyboru lub wprowadzenia wartości cosφ z podpowiedziami dla typowych odbiorników.

---

## 🎯 Cel Zadania

Zaimplementować w komponencie `PowerInputSection` rozbudowany interfejs do wprowadzania współczynnika mocy z:
- Dropdown z predefiniowanymi wartościami dla typowych odbiorników
- Możliwością wprowadzenia własnej wartości
- Walidacją w czasie rzeczywistym
- Wyświetlaniem obliczonego I<sub>B</sub> na podstawie mocy i cosφ

---

## 📐 Specyfikacja UI/UX

### Sekcja 1: Dropdown z Presetami

**Lokalizacja:** PowerInputSection → Tryb "Moc [kW]"

**Nowe pole:**
```
Label: "Współczynnik mocy (cosφ) - preset"
Type: <select> dropdown
```

**Opcje w dropdown:**

| Wartość | Etykieta | cosφ |
|---------|----------|------|
| `custom` | Własna wartość... | - |
| `RESISTIVE` | Obciążenie rezystancyjne (grzałki, bojlery) - 1.0 | 1.0 |
| `LED_ELECTRONICS` | Elektronika, LED - 0.95 | 0.95 |
| `MOTOR_MODERN` | Silniki nowoczesne - 0.9 | 0.9 |
| `MOTOR_OLD` | Silniki stare - 0.7 | 0.7 |
| `FLUORESCENT` | Świetlówki bez kompensacji - 0.5 | 0.5 |
| `TYPICAL_SINGLE` | Typowe 1-fazowe - 1.0 | 1.0 |
| `TYPICAL_THREE` | Typowe 3-fazowe - 0.93 | 0.93 |

---

### Sekcja 2: Pole Manualnego Wprowadzenia

**Po dropdownie:**
```
Label: "Współczynnik mocy (cosφ) - wartość"
Type: number
Placeholder: "1.0" (dla 1-faz) lub "0.93" (dla 3-faz)
Range: 0.1 - 1.0
```

**Logika:**
- Gdy użytkownik wybierze preset z dropdown → wartość wpisuje się automatycznie
- Użytkownik może nadpisać wartość własną
- Pole jest zawsze edytowalne (nie blokujemy)

---

### Sekcja 3: Walidacja w Czasie Rzeczywistym

**Warunek:** cosφ ∈ (0, 1]

**Komunikat błędu (gdy cosφ ≤ 0 lub cosφ > 1):**
```
┌────────────────────────────────────────────┐
│ ⚠️ Nieprawidłowa wartość cosφ!            │
│ Współczynnik mocy musi być w zakresie (0,1]│
└────────────────────────────────────────────┘
Kolor: Czerwony border + tło (#FEE2E2)
```

---

### Sekcja 4: Wyświetlanie Obliczonego I<sub>B</sub>

**Lokalizacja:** Pod polem cosφ

**Warunek wyświetlenia:** Gdy powerKW > 0 i cosφ prawidłowe

**Layout:**
```
┌────────────────────────────────────────────┐
│ 💡 Obliczony prąd IB = 19.02 A            │
│ IB = (3.5 × 1000) / (230 × 0.8)           │
└────────────────────────────────────────────┘
Kolor: Zielony border + tło (#D1FAE5)
```

**Wzory do wyświetlenia:**
- **1-fazowy:** `I_B = (P × 1000) / (230 × cosφ)`
- **3-fazowy:** `I_B = (P × 1000) / (√3 × 400 × cosφ)`

---

## 🔧 Stałe (Constants)

**Plik:** `src/constants/electricalData.ts`

```typescript
export const POWER_FACTOR_PRESETS = {
  RESISTIVE: 1.0,
  LED_ELECTRONICS: 0.95,
  MOTOR_MODERN: 0.9,
  MOTOR_OLD: 0.7,
  FLUORESCENT: 0.5,
  TYPICAL_SINGLE: 1.0,
  TYPICAL_THREE: 0.93,
} as const

export const POWER_FACTOR_LABELS: Record<keyof typeof POWER_FACTOR_PRESETS, string> = {
  RESISTIVE: 'Obciążenie rezystancyjne (grzałki, bojlery) - 1.0',
  LED_ELECTRONICS: 'Elektronika, LED - 0.95',
  MOTOR_MODERN: 'Silniki nowoczesne - 0.9',
  MOTOR_OLD: 'Silniki stare - 0.7',
  FLUORESCENT: 'Świetlówki bez kompensacji - 0.5',
  TYPICAL_SINGLE: 'Typowe 1-fazowe - 1.0',
  TYPICAL_THREE: 'Typowe 3-fazowe - 0.93',
}
```

---

## 🎨 Przykładowy Kod Komponentu

```tsx
import { POWER_FACTOR_PRESETS, POWER_FACTOR_LABELS } from '../constants/electricalData'

// W komponencie PowerInputSection:

{/* Dropdown z presetami cosφ */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Współczynnik mocy (cosφ) - preset
  </label>
  <select
    onChange={(e) => {
      const preset = e.target.value as keyof typeof POWER_FACTOR_PRESETS
      if (preset && preset !== 'custom') {
        onPowerFactorChange(POWER_FACTOR_PRESETS[preset].toString())
      }
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="custom">Własna wartość...</option>
    {Object.entries(POWER_FACTOR_LABELS).map(([key, label]) => (
      <option key={key} value={key}>
        {label}
      </option>
    ))}
  </select>
</div>

{/* Input manualny */}
<Input
  label="Współczynnik mocy (cosφ) - wartość"
  value={powerFactor}
  onChange={onPowerFactorChange}
  type="number"
  placeholder={phaseType === 'single' ? '1.0' : '0.93'}
/>

{/* Walidacja */}
{powerFactor && (parseFloat(powerFactor) <= 0 || parseFloat(powerFactor) > 1.0) && (
  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
    <p className="text-sm font-medium text-red-800">
      ⚠️ Nieprawidłowa wartość cosφ!
    </p>
    <p className="text-xs text-red-600 mt-1">
      Współczynnik mocy musi być w zakresie (0, 1]
    </p>
  </div>
)}

{/* Wynik obliczeń */}
{calculatedIB > 0 && (
  <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
    <p className="text-sm font-medium text-green-800">
      💡 Obliczony prąd I<sub>B</sub> = <strong>{calculatedIB.toFixed(2)} A</strong>
    </p>
    <p className="text-xs text-green-600 mt-1">
      {phaseType === 'single'
        ? `I_B = (${powerKW} × 1000) / (230 × ${powerFactor || 1.0})`
        : `I_B = (${powerKW} × 1000) / (√3 × 400 × ${powerFactor || 0.93})`
      }
    </p>
  </div>
)}
```

---

## 🧪 Kryteria Akceptacji (Definition of Done)

### Funkcjonalne:
- [ ] Dropdown wyświetla 7 predefiniowanych opcji + "Własna wartość"
- [ ] Wybór presetu automatycznie wypełnia pole wartości
- [ ] Pole wartości można edytować niezależnie od presetu
- [ ] Walidacja pokazuje błąd gdy cosφ ≤ 0 lub cosφ > 1
- [ ] Obliczony I<sub>B</sub> wyświetla się tylko gdy dane są prawidłowe
- [ ] Wzór w podpowiedzi zmienia się w zależności od typu faz

### Wizualne:
- [ ] Dropdown ma styl zgodny z resztą formularza (Tailwind)
- [ ] Komunikat błędu ma czerwone tło i border
- [ ] Wynik obliczeń ma zielone tło i border
- [ ] Wszystko jest responsywne (mobile + desktop)

### Integracja:
- [ ] Zmiana cosφ → przelicza I<sub>B</sub> natychmiast
- [ ] Obliczony I<sub>B</sub> przekazywany do sekcji 2 (Weryfikacja I<sub>B</sub> ≤ I<sub>n</sub> ≤ I<sub>z</sub>)
- [ ] Wartość cosφ zapisuje się w obiekcie Circuit
- [ ] Export/Import JSON zachowuje cosφ

---

## 📊 Przypadki Testowe

### Test 1: Preset "Grzałki"
```
Akcja: Wybór "Obciążenie rezystancyjne"
Oczekiwany wynik: cosφ = 1.0 w polu wartości
```

### Test 2: Preset "Silniki stare"
```
Akcja: Wybór "Silniki stare - 0.7"
Oczekiwany wynik: cosφ = 0.7 w polu wartości
```

### Test 3: Własna wartość
```
Akcja: Wpisz ręcznie 0.85
Oczekiwany wynik: Walidacja OK, obliczony I_B
```

### Test 4: Wartość nieprawidłowa (0)
```
Akcja: Wpisz 0
Oczekiwany wynik: Czerwony komunikat błędu
```

### Test 5: Wartość nieprawidłowa (1.5)
```
Akcja: Wpisz 1.5
Oczekiwany wynik: Czerwony komunikat błędu
```

### Test 6: Obliczenia 1-fazowe
```
Dane: P=3.5kW, cosφ=0.8, 1-faza
Oczekiwany wynik: I_B = 19.02 A
Wzór: "I_B = (3.5 × 1000) / (230 × 0.8)"
```

### Test 7: Obliczenia 3-fazowe
```
Dane: P=11kW, cosφ=0.85, 3-fazy
Oczekiwany wynik: I_B = 18.68 A
Wzór: "I_B = (11 × 1000) / (√3 × 400 × 0.85)"
```

---

## 🎯 User Stories

**US-1:** Jako elektryk projektujący obwód dla grzałki, chcę szybko wybrać cosφ=1.0 z listy, aby nie musieć wpisywać wartości ręcznie.

**US-2:** Jako użytkownik projektujący obwód dla starego silnika, chcę wybrać "Silniki stare - 0.7", aby system automatycznie użył prawidłowej wartości cosφ.

**US-3:** Jako użytkownik wprowadzający niestandardową wartość cosφ, chcę zobaczyć walidację w czasie rzeczywistym, aby uniknąć błędów obliczeniowych.

**US-4:** Jako użytkownik, chcę widzieć obliczony prąd I<sub>B</sub> wraz ze wzorem, aby móc zweryfikować poprawność obliczeń.

---

## 📚 Dodatkowe Materiały

### Dokumentacja Backend:
- Plik: `src/logic/calculations.ts`
- Funkcje: `calculateCurrentSinglePhase()`, `calculateCurrentThreePhase()`
- Walidacja: cosφ musi być w (0, 1]
- Zwraca: I<sub>B</sub> zaokrąglone do 2 miejsc po przecinku

### Wzory Matematyczne:

**1-fazowy (230V):**
$$I_B = \frac{P_{kW} \times 1000}{U \times \cos\phi} = \frac{P_{kW} \times 1000}{230 \times \cos\phi}$$

**3-fazowy (400V):**
$$I_B = \frac{P_{kW} \times 1000}{\sqrt{3} \times U \times \cos\phi} = \frac{P_{kW} \times 1000}{1.732 \times 400 \times \cos\phi}$$

---

## ✅ Zmiana Nazwy "Złota Zasada"

### Wymaganie:
Zamień wszystkie wystąpienia tekstu **"Złota zasada"** na wzór matematyczny **I<sub>B</sub> ≤ I<sub>n</sub> ≤ I<sub>z</sub>**

### Pliki do zmiany:

1. **CalculationSection.tsx**
   ```tsx
   // BYŁO:
   <h3>Złota zasada: IB ≤ In ≤ Iz</h3>
   
   // MA BYĆ:
   <h3>Weryfikacja: I<sub>B</sub> ≤ I<sub>n</sub> ≤ I<sub>z</sub></h3>
   ```

2. **ReportSection.tsx**
   ```tsx
   // BYŁO:
   header: 'Złota zasada'
   
   // MA BYĆ:
   header: (<span>I<sub>B</sub> ≤ I<sub>n</sub> ≤ I<sub>z</sub></span>)
   ```

3. **GoldenRuleVisualization.tsx** (jeśli istnieje)
   - Zamień tytuły i opisy

---

## 🚀 Gotowe do Implementacji!

Backend jest już zaimplementowany ✅  
Testy jednostkowe napisane ✅  
Stałe dodane ✅  
Pozostaje tylko Frontend UI ✅

**Szacowany czas:** 2-3 godziny  
**Priorytet:** Wysoki  
**Blokery:** Brak

---

**Pytania? Sprawdź:**
- `IMPLEMENTATION_SUMMARY.md` - szczegóły techniczne
- `src/logic/calculations.test.ts` - przykłady testów
- `src/constants/electricalData.ts` - wszystkie stałe

**Powodzenia! 🎉**

