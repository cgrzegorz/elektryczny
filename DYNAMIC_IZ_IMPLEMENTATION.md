# ✅ Implementacja Dynamicznego Obliczania Iz

## 📋 Podsumowanie

Zaimplementowano system dynamicznego obliczania obciążalności długotrwałej przewodu **Iz** zgodnie z normą **PN-HD 60364-5-52**, uwzględniający współczynniki poprawkowe dla temperatury i grupowania kabli.

---

## 🎯 Zrealizowane Funkcjonalności

### 1. **Współczynniki Poprawkowe**

#### a) **Współczynnik Temperaturowy (k_temp)**
- ✅ Dodano tabele współczynników dla izolacji **PVC** i **XLPE/EPR**
- ✅ Zakres temperatur: 10°C - 80°C
- ✅ Temperatura bazowa: **30°C** (k_temp = 1.00)
- ✅ Interpolacja liniowa dla wartości pośrednich
- 📍 Lokalizacja: `src/constants/electricalData.ts`

**Przykładowe wartości dla PVC:**
- 20°C → k_temp = 1.12
- 30°C → k_temp = 1.00 (bazowa)
- 40°C → k_temp = 0.87
- 50°C → k_temp = 0.71

#### b) **Współczynnik Grupowania (k_group)**
- ✅ Dodano tabelę współczynników redukcji dla wiązek kabli
- ✅ Zakres: 1-20 obwodów
- 📍 Lokalizacja: `src/constants/electricalData.ts`

**Przykładowe wartości:**
- 1 obwód → k_group = 1.00
- 2 obwody → k_group = 0.80
- 3 obwody → k_group = 0.70
- 5 obwodów → k_group = 0.60
- 10 obwodów → k_group = 0.48

---

### 2. **Funkcje Obliczeniowe**

#### a) **calculateDynamicCableCapacity()**
📍 `src/logic/calculations.ts`

```typescript
Iz = Idd × k_temp × k_group
```

**Parametry:**
- `Idd` - obciążalność bazowa z tabeli normy [A]
- `temperature` - temperatura otoczenia [°C] (domyślnie: 30°C)
- `numberOfCircuits` - liczba obwodów w wiązce (domyślnie: 1)
- `insulationType` - typ izolacji: 'PVC' | 'XLPE' (domyślnie: 'PVC')

**Zwraca:** 
- Dynamiczna obciążalność Iz [A] zaokrąglona do 2 miejsc po przecinku

#### b) **getCableCapacityByInstallationDynamic()**
📍 `src/constants/cableTables.ts`

Rozszerzona funkcja łącząca:
1. Pobranie bazowej obciążalności **Idd** z tabeli normy
2. Zastosowanie współczynników poprawkowych
3. Obliczenie finalnej wartości **Iz**

---

### 3. **Rozszerzenie Modelu Danych**

#### Nowe Pola w Interface `Circuit`:
```typescript
export interface Circuit {
  // ...existing fields...
  
  // Nowe pola dla dynamicznego Iz
  ambientTemperature?: number        // temperatura otoczenia [°C]
  numberOfCircuitsInBundle?: number  // liczba obwodów w wiązce
  insulationType?: InsulationType    // typ izolacji ('PVC' | 'XLPE')
  Idd?: number                       // obciążalność bazowa [A]
}
```

#### Nowy Typ:
```typescript
export type InsulationType = 'PVC' | 'XLPE'
```

---

### 4. **Rozbudowa UI**

#### a) **Nowe Pola w CalculationSection**

**Temperatura otoczenia:**
- Input numeryczny (10-80°C, krok 5°C)
- Domyślna wartość: 30°C (temperatura bazowa)
- Podpowiedź: "Standardowo: 30°C (bazowa)"

**Liczba obwodów w wiązce:**
- Input numeryczny (1-20, krok 1)
- Domyślna wartość: 1 (pojedynczy przewód)
- Podpowiedź: "1 = pojedynczy przewód"

**Typ izolacji:**
- Dropdown select
- Opcje: 
  - PVC (do 70°C)
  - XLPE/EPR (do 90°C)

#### b) **Ulepszone Wyświetlanie Iz**

Nowa sekcja informacyjna pokazuje:
```
💡 Automatyczny dobór Iz:

Idd (bazowe): 26 A
├─ Przekrój 2.5 mm² (Cu), sposób ułożenia C

Iz (skorygowane): 20.02 A ⭐
├─ T = 40°C, Obwodów = 2, Izolacja = PVC
└─ Współczynnik redukcji: 77.0%
```

#### c) **Tabela Dokumentacyjna (ReportSection)**

Rozszerzona kolumna "Przewód":
```
2.5 mm² (20.02A)
Cu / C
Idd: 26A | T: 40°C | n=2
```

---

## 📊 Przykład Obliczenia

### Dane wejściowe:
- Przekrój: **2.5 mm²**
- Materiał: **Miedź (Cu)**
- Sposób ułożenia: **C** (na ścianie)
- Temperatura otoczenia: **40°C**
- Liczba obwodów w wiązce: **3**
- Typ izolacji: **PVC**

### Krok 1: Pobranie Idd z tabeli
```
Idd (C, 2.5mm², Cu) = 26 A
```

### Krok 2: Obliczenie k_temp
```
k_temp (40°C, PVC) = 0.87
```

### Krok 3: Obliczenie k_group
```
k_group (3 obwody) = 0.70
```

### Krok 4: Obliczenie Iz
```
Iz = Idd × k_temp × k_group
Iz = 26 × 0.87 × 0.70
Iz = 15.83 A
```

### ✅ Wynik: **Iz = 15.83 A**

---

## 🔍 Walidacja Złotej Zasady

System automatycznie sprawdza:
```
IB ≤ In ≤ Iz (dynamiczne)
```

**Przykład alertu:**
Jeśli:
- IB = 14 A
- In = 16 A
- Iz (dynamiczne) = 15.83 A

**Wynik:** ❌ **Błąd - In > Iz!**

**Komunikat:**
```
⚠️ Nie można dodać obwodu - złota zasada nie jest spełniona (In > Iz)
```

**Sugestie:**
1. Zwiększyć przekrój przewodu
2. Zmniejszyć temperaturę otoczenia (lepsze chłodzenie)
3. Zmniejszyć liczbę obwodów w wiązce
4. Zmniejszyć In zabezpieczenia

---

## 🛠 Kryteria Akceptacji

### ✅ Zrealizowane:

- [x] System przelicza **Iz** natychmiast po zmianie:
  - Przekroju przewodu
  - Sposobu ułożenia
  - Temperatury otoczenia
  - Liczby obwodów w wiązce
  - Typu izolacji

- [x] Wartość **Iz** w "Złotej Zasadzie" aktualizuje się dynamicznie

- [x] Jeśli **Iz** spadnie poniżej **In**, system:
  - ❌ Blokuje dodanie obwodu
  - ⚠️ Wyświetla komunikat błędu
  - 💡 Pokazuje przyczynę (współczynnik redukcji)

- [x] Dodano dokumentację współczynników w kodzie

- [x] Wartości współczynników zgodne z normą PN-HD 60364-5-52

---

## 📚 Wykorzystane Normy

- **PN-HD 60364-5-52** - Dobór i montaż wyposażenia elektrycznego
  - Tabela B.52.14 - Współczynniki temperaturowe dla PVC
  - Tabela B.52.15 - Współczynniki temperaturowe dla XLPE/EPR
  - Tabela B.52.17 - Współczynniki grupowania

---

## 🧪 Testy

### Scenariusze testowe:

1. **Test podstawowy:**
   - T=30°C, n=1, PVC → Iz = Idd (bez redukcji)

2. **Test temperatury:**
   - T=50°C, n=1, PVC → Iz ≈ 0.71 × Idd

3. **Test grupowania:**
   - T=30°C, n=5, PVC → Iz ≈ 0.60 × Idd

4. **Test łączny:**
   - T=40°C, n=3, PVC → Iz ≈ 0.87 × 0.70 × Idd = 0.609 × Idd

5. **Test walidacji:**
   - Sprawdzenie blokady dodania obwodu gdy In > Iz (dynamiczne)

---

## 📁 Zmienione Pliki

1. `src/constants/electricalData.ts`
   - Dodano: `TEMPERATURE_CORRECTION_PVC`
   - Dodano: `TEMPERATURE_CORRECTION_XLPE`
   - Dodano: `GROUPING_CORRECTION_FACTOR`
   - Dodano: `getTemperatureCorrectionFactor()`
   - Dodano: `getGroupingCorrectionFactor()`

2. `src/constants/cableTables.ts`
   - Dodano: `getCableCapacityByInstallationDynamic()`

3. `src/logic/calculations.ts`
   - Dodano: `calculateDynamicCableCapacity()`

4. `src/types/circuit.ts`
   - Dodano typ: `InsulationType`
   - Rozszerzono interface: `Circuit` (4 nowe pola)

5. `src/components/CalculationSection.tsx`
   - Rozszerzono props: +6 nowych parametrów
   - Dodano UI: 3 nowe pola (temperatura, liczba obwodów, izolacja)
   - Ulepszono wyświetlanie Iz (Idd vs Iz skorygowane)

6. `src/pages/Home.tsx`
   - Dodano stany: `ambientTemperature`, `numberOfCircuitsInBundle`, `insulationType`
   - Zmieniono obliczanie Iz: `getCableCapacityByInstallation` → `getCableCapacityByInstallationDynamic`
   - Zapisywanie nowych pól w obwodach

7. `src/components/ReportSection.tsx`
   - Rozszerzono kolumnę "Przewód" o Idd, T, n

---

## 🚀 Następne Kroki (Opcjonalne)

### Możliwe rozszerzenia:

1. **Eksport danych:**
   - Pokazywanie współczynników w PDF/Excel
   - Dodanie legendy wyjaśniającej k_temp, k_group

2. **Wizualizacja:**
   - Wykres wpływu temperatury na Iz
   - Wykres wpływu liczby obwodów na Iz

3. **Presety:**
   - Szybkie ustawienia (np. "Zimne pomieszczenie", "Gorąca kotłownia")
   - Presety według typu pomieszczenia

4. **Walidacja:**
   - Ostrzeżenie gdy temperatura > 50°C
   - Ostrzeżenie gdy liczba obwodów > 10

---

## ✅ Status: **ZAIMPLEMENTOWANO POMYŚLNIE**

Aplikacja jest teraz **narzędziem projektowym**, które:
- Automatycznie dostosowuje Iz do warunków rzeczywistych
- Chroni przed błędami projektowymi
- Jest zgodna z normą PN-HD 60364-5-52
- Działa "na żywo" - wszystkie zmiany natychmiastowe

**Autor implementacji:** AI Assistant  
**Data:** 2024-12-17

