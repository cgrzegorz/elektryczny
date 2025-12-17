# ✅ NAPRAWIONE - PowerInputSection

## Problem był:
```
Uncaught ReferenceError: PowerInputSection is not defined
```

## Co zostało naprawione:

### 1. Dodano brakujące importy w Home.tsx
```typescript
import { PowerInputSection } from '../components/PowerInputSection'
import { calculateCurrentSinglePhase, calculateCurrentThreePhase } from '../logic/calculations'
import type { PhaseType, InputMode } from '../types/circuit'
```

### 2. Dodano nowe state'y
```typescript
const [inputMode, setInputMode] = useState<InputMode>('current')
const [phaseType, setPhaseType] = useState<PhaseType>('single')
const [powerKW, setPowerKW] = useState('')
const [currentA, setCurrentA] = useState('')
const [powerFactor, setPowerFactor] = useState('')
```

### 3. Zaktualizowano obliczanie IBValue
```typescript
const IBValue = inputMode === 'current' 
  ? parseFloat(currentA) || 0
  : inputMode === 'power' && powerKW
    ? phaseType === 'single'
      ? calculateCurrentSinglePhase(parseFloat(powerKW), 230, parseFloat(powerFactor) || 1.0)
      : calculateCurrentThreePhase(parseFloat(powerKW), 400, parseFloat(powerFactor) || 0.93)
    : 0
```

### 4. PowerInputSection jest teraz renderowany
```typescript
<PowerInputSection
  name={name}
  type={type}
  inputMode={inputMode}
  phaseType={phaseType}
  powerKW={powerKW}
  currentA={currentA}
  powerFactor={powerFactor}
  onNameChange={setName}
  onTypeChange={setType}
  onInputModeChange={setInputMode}
  onPhaseTypeChange={setPhaseType}
  onPowerKWChange={setPowerKW}
  onCurrentAChange={setCurrentA}
  onPowerFactorChange={setPowerFactor}
/>
```

## 🔧 Co musisz zrobić teraz:

### KROK 1: Zrestartuj serwer dev
```bash
# W terminalu gdzie działa npm run dev:
# 1. Zatrzymaj serwer: Ctrl+C
# 2. Uruchom ponownie:
npm run dev
```

### KROK 2: Wyczyść cache przeglądarki
- **Chrome/Edge**: Ctrl+Shift+R (hard reload)
- **Firefox**: Ctrl+Shift+R
- Lub otwórz DevTools (F12) → Network → Zaznacz "Disable cache"

### KROK 3: Odśwież stronę
- Po restarcie serwera odśwież stronę
- Powinien pojawić się nowy interfejs z przełącznikami

## ✅ Status plików:

- ✅ `/src/pages/Home.tsx` - zaktualizowany, wszystkie importy dodane
- ✅ `/src/components/PowerInputSection.tsx` - istnieje i jest poprawny
- ✅ `/src/types/circuit.ts` - typy PhaseType i InputMode są wyeksportowane
- ✅ `/src/logic/calculations.ts` - funkcje są wyeksportowane

## 🎯 Co zobaczysz po naprawie:

```
┌──────────────────────────────────────────┐
│ 📝 1. Dane obwodu                        │
├──────────────────────────────────────────┤
│ LEWA KOLUMNA        │ PRAWA KOLUMNA      │
│ ─────────────────  │ ───────────────── │
│ Nazwa obwodu        │ Wprowadź dane jako:│
│ Typ obwodu          │ [⚡ Moc] [🔌 Prąd] │
│                     │                    │
│ Typ zasilania:      │ Moc: ____ kW       │
│ [1-faz] [3-faz]     │ cosφ: ____        │
│                     │                    │
│                     │ 💡 IB = 9.3 A     │
└──────────────────────────────────────────┘
```

## ⚠️ Jeśli nadal nie działa:

1. **Sprawdź konsolę przeglądarki (F12)**
   - Czy są inne błędy?
   
2. **Sprawdź czy plik istnieje**
   ```bash
   ls -la src/components/PowerInputSection.tsx
   ```

3. **Usuń node_modules i przebuduj**
   ```bash
   rm -rf node_modules
   npm install
   npm run dev
   ```

4. **Sprawdź czy TypeScript się kompiluje**
   ```bash
   npm run build
   ```

## 📝 Wszystkie zmiany są w plikach:

- `/src/pages/Home.tsx` - główna zmiana
- `/src/components/PowerInputSection.tsx` - nowy komponent
- `/src/components/GoldenRuleVisualization.tsx` - wizualizacja
- `/src/types/circuit.ts` - nowe typy
- `/src/logic/calculations.ts` - funkcje przeliczania

---

**Problem powinien być rozwiązany po restarcie serwera dev!** 🚀

Jeśli masz dalsze problemy, daj znać co pokazuje konsola.

