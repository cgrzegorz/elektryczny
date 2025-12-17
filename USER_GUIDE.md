# 🚀 Jak Korzystać z Nowych Funkcji

## Nowe Funkcjonalności zgodne z PN-HD 60364

### 1️⃣ Automatyczny Dobór Obciążalności Iz

**Wcześniej:** Użytkownik wybierał przekrój i widział stałą wartość Iz dla miedzi.

**Teraz:**
1. Wybierz **Materiał żyły**: Miedź (Cu) lub Aluminium (Al)
2. Wybierz **Sposób ułożenia przewodu** z 9 opcji:
   - A1 - Przewody izolowane w rurze w ścianie
   - A2 - Kabel wielożyłowy w rurze w ścianie
   - B1 - Przewody izolowane w rurze na ścianie
   - B2 - Kabel wielożyłowy w rurze na ścianie
   - **C - Kabel wielożyłowy bezpośrednio na ścianie** (domyślny)
   - D - W kanale instalacyjnym
   - E - W powietrzu
   - F - Kabel jednożyłowy w powietrzu
   - G - W ziemi

3. Wybierz **Przekrój** - aplikacja automatycznie pokaże Iz dla wybranej konfiguracji

**Przykład:**
- Przekrój: 2.5 mm²
- Materiał: Cu
- Sposób: C (bezpośrednio na ścianie)
- **Wynik:** Iz = 26 A (automatycznie)

---

### 2️⃣ Weryfikacja Przeciążeniowa (Zasada 1.45)

**Nowa sekcja** w "2. Obliczenia i weryfikacja"

Aplikacja sprawdza DWA warunki:
1. **IB ≤ In** - obciążenie nie przekracza zabezpieczenia ✅
2. **I₂ ≤ 1.45 × Iz** - zabezpieczenie chroni przewód ✅

Gdzie **I₂ = 1.45 × In** (prąd próbny zadziałania)

**Co zobaczysz:**
- ✅ Zielony box = oba warunki OK
- ⚠️ Żółty box = uwaga, możliwe przeciążenia o małej wartości
- Szczegółowe wartości I₂ i limitu

---

### 3️⃣ Termika Zwarciowa

**Nowa sekcja** w "3. Bezpieczeństwo (SWZ i Termika)"

Aplikacja sprawdza czy **przewód wytrzyma energię zwarcia** zanim bezpiecznik zadziała.

**Warunek:** t ≤ (k² × S²) / I²

Gdzie:
- **Isc** - prąd zwarcia (obliczany z Zs)
- **t** - czas wyłączenia (z charakterystyki)
- **S** - przekrój przewodu
- **k** - współczynnik (Cu: 115, Al: 76)

**Co zobaczysz:**
- Prąd zwarcia Isc [A]
- Czas wyłączenia [ms/s]
- Wymagany minimalny przekrój
- ✅/❌ Czy przewód wytrzyma
- Zapas bezpieczeństwa w %

**Przykład:**
```
Isc = 1150 A
t = 40 ms
S = 2.5 mm²
k = 115

Warunek: 0.04s ≤ 0.086s ✅
Minimalny przekrój: 1.54 mm²
Zapas: 62%
```

---

### 4️⃣ Zaawansowany Spadek Napięcia

**Nowe wzory** uwzględniają:
- ✅ Współczynnik mocy **cosφ** (z sekcji 1)
- ✅ Materiał przewodu (Cu/Al)
- ✅ Przewodność przy **70°C** (realistyczne warunki)

**Wzory:**
```
1-fazowy:  ΔU% = (2 × L × IB × cosφ) / (γ × S × U) × 100%
3-fazowy:  ΔU% = (√3 × L × IB × cosφ) / (γ × S × U) × 100%
```

**Przewodność γ przy 70°C:**
- Miedź: 46 m/(Ω·mm²)
- Aluminium: 29 m/(Ω·mm²)

**Aktualizacja w locie:**
- Wpisz długość → spadek napięcia liczy się natychmiast
- Zmień przekrój → przeliczenie automatyczne
- Zmień materiał → nowa wartość γ

---

### 5️⃣ Blokada Nieprawidłowych Obwodów

**Przed:** Można było dodać obwód z In > Iz

**Teraz:**
- ❌ Przycisk "Dodaj obwód" jest **nieaktywny** gdy In > Iz
- 🔴 Komunikat: "Nie można dodać obwodu - złota zasada nie jest spełniona"
- ✅ Można dodać tylko poprawne obwody

---

## 📊 Tabela Raportów - Nowe Kolumny

1. **Przewód** - teraz pokazuje:
   - Przekrój i Iz
   - Materiał (Cu/Al)
   - Sposób ułożenia

2. **Przeciążenie** - nowa kolumna:
   - ✓ OK - zasada 1.45 spełniona
   - ⚠ Uwaga - może być problem

---

## 🎯 Przykładowy Workflow

### Krok 1: Podstawowe dane
```
Nazwa: Kuchnia - gniazda
Typ: Gniazda
Prąd IB: 15 A (lub Moc: 3.5 kW)
```

### Krok 2: Zabezpieczenie i przewód
```
In: 16 A
Charakterystyka: B
Materiał: Miedź (Cu)
Sposób ułożenia: C (na ścianie)
Przekrój: 2.5 mm²
→ Iz = 26 A (automatycznie)
```

### Krok 3: Weryfikacje
```
✅ Złota zasada: 15A ≤ 16A ≤ 26A
✅ Przeciążenie: I₂=23.2A ≤ 37.7A (1.45×26A)
```

### Krok 4: Spadek napięcia
```
Długość: 25 m
cosφ: 1.0
→ ΔU = 2.8% (limit 5%) ✅
```

### Krok 5: Bezpieczeństwo
```
Zs (źródło): 0.3 Ω
→ Zs całkowita: 0.48 Ω
→ Isc = 479 A
→ Termika: ✅ Przewód wytrzyma
```

### Krok 6: Dodaj do listy
```
✅ Wszystkie warunki OK
→ Kliknij "Dodaj obwód do listy"
```

---

## 🔍 Wskaźniki w Tabeli

| Symbol | Znaczenie |
|--------|-----------|
| ✓ OK | Warunek spełniony |
| ✗ Błąd | Warunek niespełniony - krytyczny |
| ⚠ Uwaga | Ostrzeżenie - wymaga uwagi |
| - | Nie dotyczy / brak danych |

---

## 📐 Zgodność z Normami

Wszystkie obliczenia zgodne z:
- **PN-HD 60364-4-43** - Ochrona przed przeciążeniem i zwarciami
- **PN-HD 60364-5-52** - Dobór i montaż instalacji, tabele obciążalności

---

## 💡 Wskazówki

1. **Zawsze wybieraj sposób ułożenia** - to wpływa na Iz
2. **Sprawdź termikę** jeśli masz długie przewody
3. **Uwaga na aluminium** - mniejsze Iz i γ niż miedź
4. **cosφ ma znaczenie** - wpływa na spadek napięcia
5. **Blokada to ochrona** - nie pozwoli dodać złego obwodu

---

**Pytania? Sprawdź IMPLEMENTATION_SUMMARY.md dla szczegółów technicznych.**

