# ✅ GOTOWE! Przelicznik kW → Ampery Zaimplementowany

## 🎉 Co działa:

### 1. **Przełącznik jednostek w Sekcji 1**

Użytkownik może teraz wybrać między:
- **⚡ Moc [kW]** - dla tych którzy znają moc urządzenia
- **🔌 Prąd [A]** - dla tych którzy znają bezpośrednio prąd

### 2. **Automatyczne przeliczanie**

Gdy wybierzesz "Moc [kW]":
- Wprowadzasz moc w kilowatach (np. 6 kW dla pompy ciepła)
- Wybierasz czy 1-fazowy (230V) czy 3-fazowy (400V)
- Podajesz współczynnik mocy cosφ (domyślnie 1.0 dla 1-faz, 0.93 dla 3-faz)
- **Aplikacja automatycznie oblicza IB!**

### 3. **Wzory używane**

#### 1-faza (230V):
```
IB = P [kW] × 1000 / (230V × cosφ)
```

#### 3-fazy (400V):
```
IB = P [kW] × 1000 / (√3 × 400V × cosφ)
IB = P [kW] × 1000 / (1.732 × 400V × cosφ)
```

## 📸 Jak to wygląda:

### Sekcja 1 - NOWA:
```
┌─────────────────────────────────────────────┐
│ 📝 1. Dane obwodu                           │
├─────────────────────────────────────────────┤
│ LEWA KOLUMNA          │ PRAWA KOLUMNA       │
│ ─────────────────────│──────────────────── │
│ Nazwa obwodu          │ Wprowadź dane jako: │
│ Typ obwodu            │ [⚡ Moc kW] [🔌 Prąd A] │
│ Typ zasilania:        │                     │
│ [1-fazowy] [3-fazowy] │ Moc odbiornika: _kW │
│                       │ cosφ: _____         │
│                       │                     │
│                       │ 💡 IB = 9.3 A       │
└─────────────────────────────────────────────┘
```

## 🧪 Przykłady użycia:

### Przykład 1: Pompa ciepła
```
✅ Tryb: Moc [kW]
✅ Typ: Silniki / Urządzenia 3-faz
✅ Zasilanie: 3-fazowy (400V)
✅ Moc: 6 kW
✅ cosφ: 0.93

➡️ WYNIK: IB = 9.3 A
```

### Przykład 2: Oświetlenie LED
```
✅ Tryb: Moc [kW]
✅ Typ: Oświetlenie
✅ Zasilanie: 1-fazowy (230V)
✅ Moc: 2 kW
✅ cosφ: 1.0

➡️ WYNIK: IB = 8.7 A
```

### Przykład 3: Klasyczne podejście (Prąd)
```
✅ Tryb: Prąd [A]
✅ Prąd: 16 A

➡️ WYNIK: IB = 16 A (bezpośrednio)
```

## 🎨 Dodatki UI/UX:

### ✅ Duże przyciski przełączające
- Zielony kolor dla aktywnego trybu
- Jasno widać co jest wybrane

### ✅ Dwukolumnowy layout
- Lewa: Dane podstawowe (nazwa, typ)
- Prawa: Moc lub Prąd (w zależności od wyboru)

### ✅ Live calculation
- Wynik IB pokazywany **natychmiast** po wpisaniu mocy
- Pod spodem wzór z podstawionymi wartościami

### ✅ Wizualizacja złotej zasady
- Oś liczbowa zamiast paska procentowego
- Znaczniki dla IB, In, Iz
- Zielona strefa pokazująca poprawny zakres

## 📁 Zmienione pliki:

1. **Home.tsx**
   - Import `PowerInputSection`
   - Import funkcji `calculateCurrentSinglePhase`, `calculateCurrentThreePhase`
   - Nowe state: `inputMode`, `phaseType`, `powerKW`, `currentA`, `powerFactor`
   - Automatyczne obliczanie IB na podstawie trybu
   - Zapisywanie dodatkowych pól do Circuit

2. **CalculationSection.tsx**
   - Import `GoldenRuleVisualization`
   - Dodano wizualizację na osi liczbowej

3. **circuit.ts** (już było)
   - Typy: `PhaseType`, `InputMode`
   - Rozszerzony `Circuit` o: `phaseType`, `powerKW`, `powerFactor`

## 🚀 Jak użyć:

1. **Uruchom aplikację**: `npm run dev`
2. **W Sekcji 1** zobaczysz nowy interfejs
3. **Kliknij "⚡ Moc [kW]"** zamiast "🔌 Prąd [A]"
4. **Wybierz 1-fazowy lub 3-fazowy**
5. **Wprowadź moc w kW**
6. **Zobacz automatycznie obliczony IB!**

## 💾 Kompatybilność:

- ✅ Stare obwody (bez powerKW) będą nadal działać
- ✅ Można mieszać obwody z mocy i z prądu
- ✅ Wszystko zapisywane w localStorage
- ✅ Export/Import JSON obsługuje nowe pola

## 🎓 Dla projektantów:

**Zalety wprowadzania mocy:**
- Szybsze projektowanie (często znamy moc urządzenia z tabliczki)
- Mniej błędów obliczeniowych
- Automatyczny dobór cosφ zależny od typu faz
- Widoczny wzór - łatwa weryfikacja

**Kiedy używać mocy kW:**
- Pompy ciepła, klimatyzacje
- Urządzenia przemysłowe
- Silniki elektryczne
- Gdy dane z tabliczki urządzenia

**Kiedy używać prądu A:**
- Dane projektowe gotowe
- Obwody mieszane (kilka urządzeń)
- Gdy IB już policzony ręcznie

---

**Wszystko działa i jest gotowe do użycia!** 🎉

Odśwież stronę (Ctrl+Shift+R) i zobacz nowy interfejs!

