# 📖 Przewodnik: Dynamiczne Obliczanie Iz

## Co to jest Iz?

**Iz** (obciążalność długotrwała przewodu) to maksymalny prąd, jaki przewód może bezpiecznie przewodzić przez długi czas bez przegrzania.

## Czym różni się Idd od Iz?

- **Idd** = obciążalność **bazowa** z tabeli normy (dla 30°C, pojedynczy przewód)
- **Iz** = obciążalność **rzeczywista** po uwzględnieniu warunków instalacji

```
Iz = Idd × k_temp × k_group
```

---

## 🌡️ Jak Temperatura Wpływa na Iz?

### Zasada:
**Im wyższa temperatura → tym niższa obciążalność**

### Przykłady (dla PVC):

| Temperatura | Współczynnik k_temp | Efekt |
|-------------|---------------------|-------|
| 20°C (chłodne pomieszczenie) | 1.12 | ✅ Przewód może przewodzić **więcej** prądu (+12%) |
| 30°C (temperatura bazowa) | 1.00 | ⚪ Bez zmian |
| 40°C (ciepłe pomieszczenie) | 0.87 | ⚠️ Przewód może przewodzić **mniej** prądu (-13%) |
| 50°C (gorąca kotłownia) | 0.71 | 🔴 Przewód może przewodzić **znacznie mniej** prądu (-29%) |

### 💡 Wskazówki:
- **Piwnica, garaż (zimno):** Ustaw 20°C → zwiększysz Iz
- **Kuchnia, łazienka (ciepło):** Zostaw 30°C
- **Kotłownia, strych latem (gorąco):** Ustaw 40-50°C → zmniejszysz Iz

---

## 👥 Jak Liczba Obwodów w Wiązce Wpływa na Iz?

### Zasada:
**Im więcej kabli obok siebie → tym gorzej się chłodzą → tym niższa obciążalność**

### Przykłady:

| Liczba obwodów | Współczynnik k_group | Efekt |
|----------------|----------------------|-------|
| 1 (pojedynczy kabel) | 1.00 | ⚪ Bez zmian |
| 2 (para kabli) | 0.80 | ⚠️ Obciążalność -20% |
| 3 (trzy kable) | 0.70 | ⚠️ Obciążalność -30% |
| 5 (pięć kabli) | 0.60 | 🔴 Obciążalność -40% |
| 10 (dziesięć kabli) | 0.48 | 🔴 Obciążalność -52% |

### 💡 Wskazówki:
- **Pojedynczy kabel na ścianie:** n=1 → max Iz
- **2-3 kable w korytku:** n=2 lub n=3 → średnia redukcja
- **Wiązka w szafie rozdzielczej:** n≥5 → duża redukcja
- **Gęsto upakowane kable:** n≥10 → bardzo duża redukcja

---

## 🧪 Przykład Praktyczny

### Sytuacja:
Projektujesz obwód gniazd wtykowych w kotłowni:
- Przewód: **2.5 mm² Cu**
- Sposób ułożenia: **C** (na ścianie)
- W korytku jest już **4 inne kable**
- Temperatura w kotłowni: **45°C**
- Zabezpieczenie: **B16**

### Krok 1: Sprawdź Idd (bazowe)
```
Idd = 26 A (z tabeli dla 2.5mm² Cu, metoda C)
```

### Krok 2: Oblicz współczynniki
```
k_temp (45°C, PVC) = 0.79
k_group (5 kabli) = 0.60
```

### Krok 3: Oblicz Iz
```
Iz = 26 × 0.79 × 0.60 = 12.32 A
```

### ⚠️ Problem!
```
IB ≤ In ≤ Iz
?  ≤ 16 ≤ 12.32  ❌ BŁĄD!
```

Zabezpieczenie **B16** (16A) jest **za duże** dla przewodu, który w tych warunkach wytrzyma tylko **12.32 A**!

### ✅ Rozwiązania:

**Opcja 1:** Zwiększ przekrój na **4 mm²**
```
Idd (4mm²) = 34 A
Iz = 34 × 0.79 × 0.60 = 16.12 A ✅ OK!
```

**Opcja 2:** Zmniejsz zabezpieczenie na **B10**
```
10A ≤ 12.32A ✅ OK!
```

**Opcja 3:** Rozdziel kable (zmniejsz n)
- Przenieś część kabli do innego korytka
- n=3 → k_group = 0.70
- Iz = 26 × 0.79 × 0.70 = 14.41 A
- Nadal za mało dla B16 ❌

**Opcja 4:** Połączenie
- Przekrój **4 mm²** + rozdziel kable (n=3)
- Iz = 34 × 0.79 × 0.70 = 18.85 A ✅ OK z zapasem!

---

## 🎯 Kiedy Używać Każdego Ustawienia?

### Temperatura:

| Pomieszczenie | Zalecana temperatura |
|---------------|---------------------|
| Piwnica, garaż nieogrzewany | 20°C |
| Pomieszczenia standardowe | 30°C (domyślna) |
| Kuchnia, łazienka | 30-35°C |
| Kotłownia, strych w lecie | 40-50°C |
| Blisko pieca, kotła | 50-60°C |

### Liczba obwodów:

| Sytuacja | Liczba obwodów |
|----------|----------------|
| Pojedynczy kabel na ścianie | 1 |
| Kilka kabli w korytku/rurze | 2-5 |
| Wiązka w szafie rozdzielczej | 5-10 |
| Bardzo gęste układanie | 10-20 |

### Typ izolacji:

| Typ | Kiedy używać | Max temp |
|-----|--------------|----------|
| **PVC** | Standardowe instalacje domowe i biurowe | 70°C |
| **XLPE/EPR** | Przemysł, wysokie temperatury, większe bezpieczeństwo | 90°C |

💡 **Uwaga:** XLPE ma lepsze współczynniki temperaturowe niż PVC!

---

## ❓ Najczęstsze Pytania

### 1. Co jeśli aplikacja mówi "In > Iz"?

To oznacza, że zabezpieczenie jest **za duże** dla przewodu w danych warunkach.

**Rozwiązania:**
- ⬆️ Zwiększ przekrój przewodu
- ⬇️ Zmniejsz prąd znamionowy zabezpieczenia (In)
- 🌡️ Obniż temperaturę (lepsze chłodzenie)
- 👥 Zmniejsz liczbę kabli w wiązce
- 🔧 Użyj izolacji XLPE zamiast PVC

### 2. Czy mogę zignorować współczynniki?

**NIE!** To może być niebezpieczne:
- Przewód się przegrzeje
- Izolacja ulegnie uszkodzeniu
- Ryzyko pożaru
- **Niezgodność z normami!**

### 3. Kiedy ustawić n=1?

Tylko gdy przewód jest:
- Pojedynczy na ścianie/suficie
- Nie dotyka innych kabli
- Dobrze chłodzony

### 4. Co to znaczy "współczynnik redukcji 77%"?

To oznacza, że Iz wynosi 77% wartości bazowej Idd.

Przykład:
- Idd = 26 A
- Współczynnik redukcji = 77%
- Iz = 26 × 0.77 = 20.02 A

**Stracono 23% obciążalności** przez niekorzystne warunki!

---

## ✅ Checklist Projektanta

Przed dodaniem obwodu sprawdź:

- [ ] Czy wybrałeś prawidłową **temperaturę** dla pomieszczenia?
- [ ] Czy policzyłeś **wszystkie kable** w korytku/rurze?
- [ ] Czy wybrałeś prawidłowy **typ izolacji**?
- [ ] Czy **Iz (skorygowane)** jest większe niż **In**?
- [ ] Czy masz zapas bezpieczeństwa (Iz - In ≥ 10%)?

---

## 🎓 Podsumowanie

1. **Iz** to nie stała wartość - zmienia się w zależności od warunków!
2. Wysoka temperatura i dużo kabli w wiązce **zmniejszają Iz**
3. Zawsze sprawdzaj: **IB ≤ In ≤ Iz (dynamiczne)**
4. Lepiej przewymiarować niż ryzykować

**Pamiętaj:** Bezpieczeństwo to priorytet! 🛡️

