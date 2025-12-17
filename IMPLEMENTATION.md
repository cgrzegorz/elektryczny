# 📊 Dashboard Projektowania Obwodów - Dokumentacja Implementacji

## ✅ Zrealizowane Wymagania

### 🏗️ Architektura UI - Dashboard (Single Page View)

Aplikacja została zbudowana jako **jeden widok Dashboard** zamiast oddzielnych podstron.

---

## 1️⃣ Sekcja Wejściowa (Obwód)

### Cel
Określenie parametrów projektowanego obwodu elektrycznego.

### Implementacja
**Komponent**: `CircuitInputSection.tsx`

**Pola:**
- Nazwa obwodu (Input text)
- Typ obwodu (Select: Oświetlenie/Gniazda/Inne)
- Prąd obliczeniowy IB [A] (Input number)

### Logika Automatycznych Sugestii
System automatycznie podpowiada standardowe konfiguracje:

```typescript
CIRCUIT_SUGGESTIONS = {
  lighting: { crossSection: 1.5, In: 10, characteristic: 'B' },
  sockets: { crossSection: 2.5, In: 16, characteristic: 'B' },
  other: { crossSection: 2.5, In: 16, characteristic: 'C' }
}
```

**Przykład:**
- Wybór "Gniazda" → System sugeruje: 2.5mm² + B16
- Wybór "Oświetlenie" → System sugeruje: 1.5mm² + B10

---

## 2️⃣ Sekcja Obliczeniowa (Złota Zasada i Przeciążenia)

### Cel
Dynamiczna weryfikacja nierówności: **IB ≤ In ≤ Iz**

### Implementacja
**Komponent**: `CalculationSection.tsx`

**Pola:**
- Prąd znamionowy zabezpieczenia In [A] (Select: 6, 10, 13, 16, 20, 25, 32...)
- Charakterystyka (Select: B, C, D)
- Przekrój przewodu [mm²] (Select z automatycznym pokazaniem Iz)

### Wizualizacja

#### Pasek Postępu
Pokazuje wykorzystanie przewodu względem jego obciążalności Iz:
- **Niebieski** - prąd obciążenia IB
- **Pomarańczowy** - prąd zabezpieczenia In
- Procentowe wykorzystanie w czasie rzeczywistym

#### Walidacja w Czasie Rzeczywistym
```typescript
const isValid = checkGoldenRule(IB, In, Iz)
// isValid = (IB <= In) && (In <= Iz)
```

**Przykład błędu:**
- Przewód 1.5mm² → Iz ≈ 13.5A
- Zabezpieczenie B16 → In = 16A
- **Wynik: ❌ BŁĄD** (16A > 13.5A)
- Sekcja **zaświeca się na czerwono**

**Przykład poprawny:**
- Przewód 2.5mm² → Iz = 18A
- Zabezpieczenie B16 → In = 16A
- IB = 12A
- **Wynik: ✅ OK** (12 ≤ 16 ≤ 18)
- Sekcja **zaświeca się na zielono**

---

## 3️⃣ Sekcja Bezpieczeństwa (SWZ i Termika)

### Cel
Sprawdzenie warunków skuteczności wyłączenia zwarcia.

### Implementacja
**Komponent**: `SafetySection.tsx`

**Pola:**
- Impedancja pętli zwarcia Zs [Ω] (Input number)
- Obliczony prąd wyzwalający Ia (Wyświetlany automatycznie)

### Warunek SWZ
**Wzór**: `Zs ≤ U₀/Ia`

Gdzie:
- U₀ = 230V (napięcie fazowe)
- Ia = In × krotność (np. B16 → 16A × 5 = 80A)

### Działanie
1. Użytkownik wprowadza zmierzoną wartość Zs
2. System oblicza maksymalną dopuszczalną Zs: `maxZs = 230V / Ia`
3. Porównanie: `Zs <= maxZs`

### Sugestie przy Niespełnieniu Warunku

Jeśli `Zs > maxZs`, system wyświetla sugestie:
- ✅ Zwiększ przekrój przewodu (mniejsza rezystancja)
- ✅ Zmień charakterystykę z C na B (mniejszy Ia → większy dozwolony Zs)
- ✅ Sprawdź połączenie ochronne PE
- ✅ Rozważ zastosowanie wyłącznika różnicowoprądowego

**Przykład:**
- Zmierzone Zs = 2.5 Ω
- Zabezpieczenie B16 → Ia = 80A
- maxZs = 230V / 80A = 2.875 Ω
- **Wynik: ✅ OK** (2.5 < 2.875)

**Przykład błędu:**
- Zmierzone Zs = 3.0 Ω
- Zabezpieczenie C16 → Ia = 160A
- maxZs = 230V / 160A = 1.438 Ω
- **Wynik: ❌ BŁĄD** (3.0 > 1.438)
- **Sugestia**: Zmień C16 na B16 lub zwiększ przekrój

---

## 4️⃣ Sekcja Raportu (Tabela Dokumentacyjna)

### Cel
Wygenerowanie finalnej dokumentacji zaprojektowanych obwodów.

### Implementacja
**Komponent**: `ReportSection.tsx`

### Widok Tabeli
Kolumny:
1. **Nazwa** - nazwa obwodu
2. **Typ** - Oświetlenie/Gniazda/Inne
3. **IB [A]** - prąd obliczeniowy
4. **Przewód** - przekrój [mm²] i Iz [A]
5. **Zabezpieczenie** - charakterystyka + In (np. B16)
6. **Złota zasada** - badge ✓ OK / ✗ Błąd
7. **SWZ** - badge ✓ OK / ✗ Błąd / -
8. **Spadek U [%]** - spadek napięcia (TODO)
9. **Zs [Ω]** - impedancja pętli zwarcia
10. **Akcje** - przycisk Usuń

### Funkcje

#### Przycisk "Dodaj do listy"
Zapisuje aktualnie skonfigurowany obwód do tabeli zbiorczej.
Walidacja: wymaga wypełnienia nazwy, IB, In i przekroju.

#### Eksport Danych
- **💾 JSON** - zaimplementowane (download)
- **📄 PDF** - TODO
- **📊 Excel** - TODO

#### Statystyki
Dolny panel pokazuje:
- 📊 Łącznie obwodów
- ✅ Poprawnych (złota zasada + SWZ OK)
- ❌ Z błędami
- ⚡ Suma IB [A]

---

## 🧮 Logika i Funkcje Obliczeniowe

### Plik: `circuitValidation.ts`

#### Funkcje Zaimplementowane:

1. **checkGoldenRule(IB, In, Iz)** → boolean
   - Sprawdza: IB ≤ In ≤ Iz

2. **calculateTripCurrent(In, multiplier)** → number
   - Oblicza: Ia = In × krotność

3. **checkShortCircuitProtection(Zs, U0, Ia)** → boolean
   - Sprawdza: Zs ≤ U₀/Ia

4. **calculateMaxZs(U0, Ia)** → number
   - Oblicza maksymalną dopuszczalną Zs

5. **calculateVoltageDropValue(current, resistance)** → number
   - Oblicza spadek napięcia [V]

6. **calculateVoltageDropPercent(voltageDrop, nominalVoltage)** → number
   - Oblicza spadek napięcia [%]

7. **calculateMinCrossSection(Ik, t, k)** → number
   - Oblicza minimalny przekrój ze względu na zwarcie

---

## 📁 Struktura Plików

```
src/
├── components/
│   ├── CircuitInputSection.tsx      # Sekcja 1
│   ├── CalculationSection.tsx       # Sekcja 2
│   ├── SafetySection.tsx            # Sekcja 3
│   ├── ReportSection.tsx            # Sekcja 4
│   ├── Input.tsx                    # Komponent UI
│   ├── Badge.tsx                    # Komponent UI
│   ├── Table.tsx                    # Komponent UI
│   └── Navigation.tsx               # Nawigacja
│
├── logic/
│   ├── circuitValidation.ts         # Funkcje walidacji
│   └── calculations.ts              # Funkcje obliczeniowe
│
├── constants/
│   ├── electricalData.ts            # Stałe (In, krotności, k, limity)
│   ├── cableTables.ts               # Tabele Iz
│   └── coefficients.ts              # Współczynniki
│
├── types/
│   └── circuit.ts                   # TypeScript types
│
└── pages/
    ├── Home.tsx                     # Dashboard (główny widok)
    ├── ElectricalData.tsx           # Strona z danymi
    └── About.tsx                    # O aplikacji
```

---

## 🎨 Kolorystyka i UX

### Złota Zasada
- ✅ **Zielony** - warunek spełniony
- ❌ **Czerwony** - warunek niespełniony

### SWZ
- ✅ **Zielony** - Zs ≤ maxZs
- ❌ **Czerwony** - Zs > maxZs
- ⏳ **Szary** - brak danych Zs

### Badge'e
- **Success** (zielony) - OK
- **Error** (czerwony) - Błąd
- **Warning** (żółty) - Ostrzeżenie
- **Info** (niebieski) - Informacja

---

## 🚀 Jak Używać

1. **Wprowadź dane obwodu** (Sekcja 1)
   - Nazwa, typ, prąd IB

2. **Dobierz zabezpieczenie i przewód** (Sekcja 2)
   - System waliduje złotą zasadę na bieżąco
   - Paski postępu pokazują wykorzystanie

3. **Sprawdź bezpieczeństwo** (Sekcja 3)
   - Wprowadź Zs
   - System sprawdza warunek SWZ

4. **Dodaj do listy** (Przycisk)
   - Obwód trafia do tabeli dokumentacyjnej

5. **Eksportuj raport** (Sekcja 4)
   - JSON, PDF (TODO), Excel (TODO)

---

## 📝 TODO - Przyszłe Rozszerzenia

- [ ] Obliczanie spadku napięcia
- [ ] Eksport do PDF
- [ ] Eksport do Excel
- [ ] Zapisywanie projektów w localStorage
- [ ] Wydruk raportu
- [ ] Walidacja termiczna przewodów
- [ ] Dobór przekroju ze względu na spadek napięcia
- [ ] Kalkulator mocy całkowitej

---

## 🎯 Zgodność z Wymaganiami

✅ Układ Dashboard (jeden widok, nie podstrony)
✅ Sekcja 1: Dane obwodu + automatyczne sugestie
✅ Sekcja 2: Złota zasada + pasek postępu + walidacja na czerwono
✅ Sekcja 3: SWZ + sugestie przy błędach
✅ Sekcja 4: Tabela dokumentacyjna + eksport
✅ TypeScript + cziste funkcje w logic/
✅ Stałe w constants/ (In, krotności, k=115, limity spadków)
✅ Responsywny design z TailwindCSS

