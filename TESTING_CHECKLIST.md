# ✅ Checklist Testowania - Nowe Funkcjonalności

## 🎯 1. Weryfikacja Warunku Przeciążeniowego (Zasada 1.45)

### Test 1: Warunek spełniony
- [ ] Ustaw IB = 15A, In = 16A, Iz = 26A
- [ ] W sekcji "Weryfikacja przeciążeniowa" powinno być:
  - [ ] ✅ Warunek 1: 15.0A ≤ 16A (zielony)
  - [ ] ✅ Warunek 2: I₂=23.2A ≤ 37.7A (zielony)
  - [ ] Zielony box z napisem "warunek spełniony"

### Test 2: Warunek niespełniony
- [ ] Ustaw IB = 15A, In = 25A, Iz = 26A
- [ ] W sekcji "Weryfikacja przeciążeniowa" powinno być:
  - [ ] ✅ Warunek 1: 15.0A ≤ 25A
  - [ ] ❌ Warunek 2: I₂=36.3A > 37.7A (czerwony/żółty)
  - [ ] Żółty box z ostrzeżeniem
  - [ ] Sugestie rozwiązań

---

## 🔥 2. Termika Zwarciowa

### Test 3: Podstawowa weryfikacja
- [ ] Wybierz In = 16A, charakterystyka B
- [ ] Ustaw przekrój S = 2.5 mm², materiał = Cu
- [ ] Wprowadź Zs (źródło) = 0.3 Ω
- [ ] Wprowadź długość = 25m
- [ ] Sekcja "Weryfikacja termiczna zwarcia" powinna się pojawić
- [ ] Powinna pokazywać:
  - [ ] Prąd zwarcia Isc (wartość w amperach)
  - [ ] Czas wyłączenia t (ms lub s)
  - [ ] Przekrój S = 2.5 mm²
  - [ ] Współczynnik k = 115 (dla Cu)

### Test 4: Weryfikacja obliczeń
- [ ] Sprawdź czy warunek jest spełniony/niespełniony
- [ ] Sprawdź minimalny wymagany przekrój S_min
- [ ] Sprawdź czy S >= S_min oznacza ✅
- [ ] Sprawdź czy S < S_min oznacza ❌
- [ ] Sprawdź zapas bezpieczeństwa w % (jeśli spełniony)

### Test 5: Materiał aluminium
- [ ] Zmień materiał na Al
- [ ] Sprawdź czy k zmienia się na 76
- [ ] Sprawdź czy wymagany S_min się zwiększa

---

## 📐 3. Automatyczny Dobór Iz

### Test 6: Wybór sposobu ułożenia
- [ ] Materiał: Cu, Przekrój: 2.5 mm²
- [ ] Sposób A1 - sprawdź Iz (powinno być ~18A)
- [ ] Sposób B2 - sprawdź Iz (powinno być ~21A)
- [ ] Sposób C - sprawdź Iz (powinno być ~26A)
- [ ] Info box powinien pokazywać wybraną konfigurację

### Test 7: Zmiana materiału
- [ ] Przekrój: 2.5 mm², Sposób: C
- [ ] Materiał Cu - sprawdź Iz (~26A)
- [ ] Zmień na Al - sprawdź Iz (~20A)
- [ ] Wartość Iz powinna się aktualizować automatycznie

### Test 8: Różne przekroje
- [ ] Sposób: C, Materiał: Cu
- [ ] Przetestuj przekroje: 1.5, 2.5, 4, 6, 10 mm²
- [ ] Iz powinno rosnąć wraz z przekrojem
- [ ] Wartości w dropdownie "Przekrój" powinny pokazywać aktualne Iz

---

## 📏 4. Zaawansowany Spadek Napięcia

### Test 9: Współczynnik mocy - 1-fazowy
- [ ] Typ: 1-fazowy, IB = 15A, S = 2.5mm², L = 25m
- [ ] Materiał: Cu, cosφ = 1.0
- [ ] Spadek napięcia powinien być obliczony
- [ ] Zmień cosφ na 0.8 - spadek powinien się zmniejszyć
- [ ] Formuła w info box: zawiera cosφ i γ

### Test 10: Współczynnik mocy - 3-fazowy
- [ ] Typ: 3-fazowy, IB = 15A, S = 2.5mm², L = 25m
- [ ] Materiał: Cu, cosφ = 0.93
- [ ] Spadek napięcia powinien być mniejszy niż dla 1-faz
- [ ] Formuła: zawiera √3

### Test 11: Aktualizacja "w locie"
- [ ] Ustaw podstawowe dane (IB, przekrój)
- [ ] Stopniowo zwiększaj długość: 10m → 20m → 30m
- [ ] Spadek napięcia powinien rosnąć proporcjonalnie
- [ ] Brak opóźnień, natychmiastowa aktualizacja

### Test 12: Zmiana materiału
- [ ] Ustaw długość 25m, IB 15A, S 2.5mm²
- [ ] Materiał Cu - zapisz wartość spadku
- [ ] Zmień na Al - spadek powinien się zwiększyć (~30% więcej)
- [ ] Wynika to z mniejszej przewodności Al

---

## 🛡️ 5. Blokada Nieprawidłowych Obwodów

### Test 13: Blokada gdy In > Iz
- [ ] Ustaw IB = 15A, In = 32A, Iz = 26A (In > Iz)
- [ ] Przycisk "Dodaj obwód" powinien być nieaktywny (szary)
- [ ] Powinien pojawić się czerwony komunikat:
  - [ ] "Nie można dodać obwodu - złota zasada nie jest spełniona"
- [ ] Hover nad przyciskiem - kursor "not-allowed"

### Test 14: Odblokowanie po poprawie
- [ ] Z poprzedniego testu (In=32A, Iz=26A)
- [ ] Zmień przekrój na 10mm² (Iz wzrośnie do ~59A)
- [ ] Przycisk powinien się odblokować (zielony)
- [ ] Komunikat ostrzegawczy powinien zniknąć
- [ ] Można dodać obwód

### Test 15: Warunki początkowe
- [ ] Przed wprowadzeniem IB (IB=0)
- [ ] Przycisk powinien być aktywny (jeszcze nie blokowany)
- [ ] Po wprowadzeniu IB i wyborze In > Iz - blokada

---

## 📊 6. Raport - Nowe Kolumny

### Test 16: Kolumna "Przeciążenie"
- [ ] Dodaj obwód ze spełnionym warunkiem przeciążeniowym
- [ ] Kolumna "Przeciążenie" powinna pokazywać: ✓ OK (zielony badge)
- [ ] Dodaj obwód z ostrzeżeniem
- [ ] Kolumna powinna pokazywać: ⚠ Uwaga (żółty badge)

### Test 17: Kolumna "Przewód" - rozszerzona
- [ ] Dodaj obwód z Cu, sposób C
- [ ] Kolumna "Przewód" powinna pokazywać:
  - [ ] Linia 1: "2.5 mm² (26A)" - pogrubione
  - [ ] Linia 2: "Cu / C" - mniejsze, szare
- [ ] Dodaj obwód z Al, sposób A1
- [ ] Powinno być: "Al / A1"

### Test 18: Eksport i import
- [ ] Dodaj obwód z nowymi polami
- [ ] Eksportuj do JSON
- [ ] Otwórz plik - sprawdź czy zawiera:
  - [ ] `material: "copper"`
  - [ ] `installationMethod: "C"`
  - [ ] `overloadProtectionValid: true`
- [ ] Importuj z powrotem - wszystkie dane powinny się zachować

---

## 🎨 7. Testy Wizualne

### Test 19: Responsywność
- [ ] Otwórz na desktop - wszystkie sekcje w grid
- [ ] Zmniejsz okno do mobile - powinno przejść na kolumny
- [ ] Tabela powinna mieć scroll poziomy na mobile

### Test 20: Kolory i ikony
- [ ] ✅ Zielone boxy = warunki spełnione
- [ ] ❌ Czerwone boxy = błędy krytyczne
- [ ] ⚠️ Żółte boxy = ostrzeżenia
- [ ] 🔒 Ikony odpowiednie do sekcji

### Test 21: Info boxy
- [ ] Niebieskie info boxy z 💡 dla podpowiedzi
- [ ] Zawierają wzory matematyczne
- [ ] Są czytelne i pomocne

---

## 🔄 8. Testy Integracyjne

### Test 22: Pełny flow obwodu
- [ ] Wprowadź wszystkie dane od początku do końca:
  1. [ ] Nazwa i typ obwodu
  2. [ ] IB lub moc
  3. [ ] Materiał i sposób ułożenia
  4. [ ] In, charakterystyka, przekrój
  5. [ ] Długość
  6. [ ] Zs (źródło)
- [ ] Sprawdź wszystkie 4 weryfikacje:
  - [ ] Złota zasada
  - [ ] Przeciążenie
  - [ ] SWZ
  - [ ] Termika
- [ ] Dodaj do listy
- [ ] Sprawdź w tabeli

### Test 23: localStorage
- [ ] Dodaj kilka obwodów z nowymi polami
- [ ] Odśwież stronę (F5)
- [ ] Wszystkie obwody powinny pozostać
- [ ] Wszystkie nowe pola zachowane

### Test 24: Edge cases
- [ ] IB = 0 - nie powinno crashować
- [ ] Bardzo długi przewód (1000m) - duży spadek napięcia
- [ ] Bardzo mały przekrój (0.5mm²) - nie ma w tabeli
- [ ] Bardzo duży In (63A) - weryfikacja przeciążeniowa

---

## ✨ 9. Zgodność z Normami

### Test 25: Weryfikacja wzorów
- [ ] Spadek napięcia 1-faz: ΔU = (2×L×IB×cosφ)/(γ×S×U)
- [ ] Spadek napięcia 3-faz: ΔU = (√3×L×IB×cosφ)/(γ×S×U)
- [ ] I₂ = 1.45 × In
- [ ] Termika: t ≤ (k²×S²)/I²
- [ ] Wszystkie wzory zgodne z PN-HD 60364

### Test 26: Wartości γ
- [ ] Cu 70°C: γ = 46 m/(Ω·mm²)
- [ ] Al 70°C: γ = 29 m/(Ω·mm²)
- [ ] Używane w obliczeniach spadku napięcia

### Test 27: Współczynniki k
- [ ] Cu PVC: k = 115
- [ ] Al PVC: k = 76
- [ ] Używane w termice zwarciowej

---

## 📝 Wynik Testów

**Data:** _______________

**Tester:** _______________

**Liczba testów:** 27

**Przeszło:** _____ / 27

**Nie przeszło:** _____

**Uwagi:**
```
[Miejsce na notatki]
```

---

## 🎯 Kryteria Akceptacji (z zadania)

- [ ] 1. Aplikacja blokuje dodanie obwodu gdy In > Iz
- [ ] 2. Sekcja "Weryfikacja termiczna zwarcia" istnieje i działa
- [ ] 3. Użytkownik wybiera sposób ułożenia, aplikacja podpowiada Iz
- [ ] 4. Spadek napięcia aktualizuje się "w locie"

**Status:** ☐ PASS  ☐ FAIL

---

**WSZYSTKIE TESTY PRZESZŁY? ✅**

Gratulacje! Aplikacja jest gotowa do użycia zgodnie z wymaganiami PN-HD 60364! 🎉

