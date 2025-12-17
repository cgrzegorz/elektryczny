# 🧪 Instrukcja Testowania - Dynamiczne Iz

## Szybki Test Funkcjonalności

### Test 1: Podstawowe Działanie ⚡

**Cel:** Sprawdzenie czy Iz aktualizuje się dynamicznie

1. Otwórz aplikację
2. W sekcji "2. Obliczenia i weryfikacja":
   - Wybierz przekrój: **2.5 mm²**
   - Materiał: **Miedź (Cu)**
   - Sposób ułożenia: **C**
   - Typ izolacji: **PVC**
   
3. Sprawdź wartości:
   - Temperatura: **30°C** (domyślna)
   - Liczba obwodów: **1** (domyślnie)

**Oczekiwany wynik:**
```
💡 Automatyczny dobór Iz:
Idd (bazowe): 26 A
Iz (skorygowane): 26.00 A
Współczynnik redukcji: 100%
```

✅ **PASS** jeśli Iz = Idd (brak redukcji dla warunków bazowych)

---

### Test 2: Wpływ Temperatury 🌡️

**Cel:** Sprawdzenie współczynnika temperaturowego

1. Ustaw temperaturę na **40°C**
2. Obserwuj zmianę Iz

**Oczekiwany wynik:**
```
Idd: 26 A
Iz: 22.62 A
Współczynnik redukcji: 87.0%
```

**Wzór:** 26 × 0.87 = 22.62 A

✅ **PASS** jeśli Iz = 22.62 A (±0.1)

3. Zmień temperaturę na **50°C**

**Oczekiwany wynik:**
```
Iz: 18.46 A
Współczynnik redukcji: 71.0%
```

✅ **PASS** jeśli Iz = 18.46 A (±0.1)

---

### Test 3: Wpływ Liczby Obwodów 👥

**Cel:** Sprawdzenie współczynnika grupowania

1. Wróć do temperatury **30°C**
2. Zmień "Liczba obwodów w wiązce" na **2**

**Oczekiwany wynik:**
```
Idd: 26 A
Iz: 20.80 A
Współczynnik redukcji: 80.0%
```

**Wzór:** 26 × 0.80 = 20.80 A

✅ **PASS** jeśli Iz = 20.80 A (±0.1)

3. Zmień na **5 obwodów**

**Oczekiwany wynik:**
```
Iz: 15.60 A
Współczynnik redukcji: 60.0%
```

✅ **PASS** jeśli Iz = 15.60 A (±0.1)

---

### Test 4: Łączne Efekty 🔥

**Cel:** Sprawdzenie kombinacji współczynników

1. Ustaw:
   - Temperatura: **40°C**
   - Liczba obwodów: **3**
   - Przekrój: **2.5 mm²**
   - Materiał: **Cu**
   - Sposób: **C**

**Oczekiwany wynik:**
```
Idd: 26 A
Iz: 15.83 A
Współczynnik redukcji: 60.9%
```

**Wzór:** 26 × 0.87 (temp) × 0.70 (grupowanie) = 15.834 A

✅ **PASS** jeśli Iz = 15.83 A (±0.1)

---

### Test 5: Walidacja Złotej Zasady 🛡️

**Cel:** Sprawdzenie blokady nieprawidłowych konfiguracji

1. Kontynuuj z poprzednich ustawień (Iz = 15.83 A)
2. W sekcji "1. Dane obwodu":
   - Wprowadź prąd: **10 A**
3. W sekcji "2. Obliczenia":
   - Wybierz zabezpieczenie: **16 A**

**Oczekiwany wynik:**
- Status złotej zasady: ❌ **BŁĄD**
- Komunikat: "⚠️ Nie można dodać obwodu - złota zasada nie jest spełniona (In > Iz)"
- Przycisk "Dodaj obwód" jest **zablokowany** (szary)

**Sprawdzenie:**
```
IB ≤ In ≤ Iz
10 ≤ 16 ≤ 15.83  ❌
```

✅ **PASS** jeśli przycisk jest zablokowany

4. Zmień zabezpieczenie na **10 A**

**Oczekiwany wynik:**
- Status: ✅ **OK**
- Przycisk "Dodaj obwód" jest **aktywny** (zielony)

```
10 ≤ 10 ≤ 15.83  ✅
```

✅ **PASS** jeśli można dodać obwód

---

### Test 6: Różne Przekroje 📏

**Cel:** Sprawdzenie poprawności dla różnych przekrojów

1. Ustaw warunki bazowe (T=30°C, n=1)
2. Testuj przekroje:

| Przekrój | Metoda | Material | Oczekiwane Idd | Oczekiwane Iz |
|----------|--------|----------|----------------|---------------|
| 1.5 mm² | C | Cu | 19 A | 19.00 A |
| 2.5 mm² | C | Cu | 26 A | 26.00 A |
| 4 mm² | C | Cu | 34 A | 34.00 A |
| 6 mm² | C | Cu | 43 A | 43.00 A |
| 10 mm² | C | Cu | 59 A | 59.00 A |

✅ **PASS** jeśli wszystkie wartości się zgadzają

---

### Test 7: Różne Materiały 🔶

**Cel:** Sprawdzenie różnicy Cu vs Al

1. Przekrój: **2.5 mm²**, Metoda: **C**, T=30°C, n=1

| Materiał | Oczekiwane Idd | Oczekiwane Iz |
|----------|----------------|---------------|
| Miedź (Cu) | 26 A | 26.00 A |
| Aluminium (Al) | 20 A | 20.00 A |

✅ **PASS** jeśli aluminium ma niższą wartość

---

### Test 8: Różne Sposoby Ułożenia 🔧

**Cel:** Sprawdzenie poprawności dla różnych metod instalacji

1. Przekrój: **2.5 mm²**, Cu, T=30°C, n=1

| Metoda | Opis | Oczekiwane Idd |
|--------|------|----------------|
| A1 | W rurze w ścianie | 18 A |
| B2 | W rurze na ścianie | 21 A |
| C | Na ścianie | 26 A |

✅ **PASS** jeśli wartości maleją: C > B2 > A1

---

### Test 9: Typ Izolacji (PVC vs XLPE) 🔥

**Cel:** Sprawdzenie różnicy między typami izolacji

1. Ustaw:
   - Przekrój: **2.5 mm²**, Cu, Metoda C
   - Temperatura: **50°C**
   - Liczba obwodów: **1**

2. Testuj typy izolacji:

| Izolacja | k_temp przy 50°C | Oczekiwane Iz |
|----------|------------------|---------------|
| PVC | 0.71 | 18.46 A |
| XLPE | 0.82 | 21.32 A |

**Wzór:**
- PVC: 26 × 0.71 = 18.46 A
- XLPE: 26 × 0.82 = 21.32 A

✅ **PASS** jeśli XLPE ma wyższą wartość (lepsze właściwości termiczne)

---

### Test 10: Zapis w Tabeli 📋

**Cel:** Sprawdzenie zapisu danych dynamicznych

1. Ustaw konfigurację:
   - Nazwa: "Test Dynamiczny"
   - Prąd: 12 A
   - In: 13 A
   - Przekrój: 2.5 mm²
   - Temperatura: 40°C
   - Liczba obwodów: 2
   - Izolacja: PVC

2. Dodaj obwód do listy

3. W sekcji "4. Raport" sprawdź wiersz z obwodem

**Oczekiwany wynik w kolumnie "Przewód":**
```
2.5 mm² (18.06A)
Cu / C
Idd: 26A | T: 40°C | n=2
```

**Obliczenie:** 26 × 0.87 × 0.80 = 18.096 ≈ 18.06 A

✅ **PASS** jeśli wszystkie dane się wyświetlają

---

## 🔍 Test Krawędziowy

### Test 11: Ekstremalne Warunki

1. **Bardzo gorąco + dużo kabli:**
   - T = 60°C
   - n = 10 obwodów
   - Przekrój = 2.5 mm²

**Oczekiwany wynik:**
- k_temp (60°C, PVC) = 0.50
- k_group (10) = 0.48
- Iz = 26 × 0.50 × 0.48 = 6.24 A 🔴

✅ **PASS** jeśli Iz jest znacznie zredukowane

2. **Bardzo zimno + pojedynczy kabel:**
   - T = 10°C
   - n = 1
   - Przekrój = 2.5 mm²

**Oczekiwany wynik:**
- k_temp (10°C, PVC) = 1.22
- k_group (1) = 1.00
- Iz = 26 × 1.22 × 1.00 = 31.72 A ✅

✅ **PASS** jeśli Iz jest większe niż Idd

---

## ✅ Checklist Akceptacji

Po wykonaniu wszystkich testów sprawdź:

- [ ] Test 1: Warunki bazowe (T=30°C, n=1) → Iz = Idd ✅
- [ ] Test 2: Wpływ temperatury → Iz maleje ze wzrostem T ✅
- [ ] Test 3: Wpływ liczby obwodów → Iz maleje ze wzrostem n ✅
- [ ] Test 4: Łączne efekty → Iz = Idd × k_temp × k_group ✅
- [ ] Test 5: Walidacja blokuje niepoprawne konfiguracje ✅
- [ ] Test 6: Różne przekroje działają poprawnie ✅
- [ ] Test 7: Aluminium < Miedź ✅
- [ ] Test 8: Metody instalacji dają różne Idd ✅
- [ ] Test 9: XLPE lepsze niż PVC w wysokiej temperaturze ✅
- [ ] Test 10: Dane zapisują się w tabeli ✅
- [ ] Test 11: Ekstremalne warunki dają sensowne wyniki ✅

---

## 🐛 Znane Problemy do Sprawdzenia

### Jeśli coś nie działa:

1. **Iz nie aktualizuje się:**
   - Sprawdź czy komponenty są poprawnie połączone
   - Sprawdź console.log czy są błędy

2. **Wartości się nie zgadzają:**
   - Sprawdź tabele współczynników
   - Sprawdź zaokrąglenia (do 2 miejsc)

3. **Przycisk nie blokuje się:**
   - Sprawdź warunek `!goldenRuleValid`
   - Sprawdź czy używane jest dynamiczne Iz

---

## 📊 Raport z Testów

Po wykonaniu testów wypełnij:

```
Data testów: _______________
Tester: _______________

Test 1: [ ] PASS  [ ] FAIL
Test 2: [ ] PASS  [ ] FAIL
Test 3: [ ] PASS  [ ] FAIL
Test 4: [ ] PASS  [ ] FAIL
Test 5: [ ] PASS  [ ] FAIL
Test 6: [ ] PASS  [ ] FAIL
Test 7: [ ] PASS  [ ] FAIL
Test 8: [ ] PASS  [ ] FAIL
Test 9: [ ] PASS  [ ] FAIL
Test 10: [ ] PASS  [ ] FAIL
Test 11: [ ] PASS  [ ] FAIL

Uwagi:
_________________________________
_________________________________
_________________________________
```

---

## ✅ Jeśli Wszystkie Testy PASS:

**GRATULACJE! Implementacja działa poprawnie.** 🎉

Aplikacja jest gotowa do użycia w rzeczywistych projektach instalacji elektrycznych.

