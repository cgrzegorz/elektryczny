# ✅ Dodano typ obwodu: WLZ (Rekuperacja)

## Co zostało dodane:

### 1. Nowy typ w CircuitType
```typescript
export type CircuitType = 'lighting' | 'sockets' | 'other' | 'motor' | 'wlz'
```

### 2. Etykieta w interfejsie
```
WLZ (Rekuperacja)
```

### 3. Sugestia parametrów dla WLZ
```typescript
wlz: {
  crossSection: 2.5,    // mm²
  In: 16,               // A
  characteristic: 'C',   // C16
  reason: 'Wentylacja z Odzyskiem Ciepła (zwykle 3-fazowa, ~1.5kW)'
}
```

## 📊 Typowe parametry WLZ:

### Standardowa WLZ domowa (~150-300m³/h):
```
✅ Typ: WLZ (Rekuperacja)
✅ Zasilanie: 3-fazowy (400V)
✅ Tryb: Moc [kW]
✅ Moc: 0.3 - 1.5 kW
✅ cosφ: 0.85 - 0.93
✅ Sugestia: C16, 2.5mm²

Obliczony IB: ~0.5 - 2.5 A
```

### WLZ o większej wydajności (>500m³/h):
```
✅ Typ: WLZ (Rekuperacja)
✅ Zasilanie: 3-fazowy (400V)
✅ Moc: 2-3 kW
✅ cosφ: 0.90
✅ Sugestia: C20, 2.5-4mm²

Obliczony IB: ~3-5 A
```

## 🎯 Przykład użycia w aplikacji:

### Krok 1: Wybierz typ obwodu
```
Typ obwodu: [WLZ (Rekuperacja)] ▼
```

### Krok 2: Ustaw zasilanie
```
Typ zasilania: [3-fazowy (400V)]  ← Zazwyczaj dla WLZ
```

### Krok 3: Wprowadź moc
```
Wprowadź dane jako: [⚡ Moc [kW]]
Moc odbiornika: 1.5 kW
cosφ: 0.90
```

### Krok 4: Zobacz wynik
```
💡 Obliczony prąd IB = 2.4 A
```

### Krok 5: System podpowiada
```
💡 Sugestia dla WLZ (Rekuperacja):
Przewód: 2.5 mm² | Zabezpieczenie: C16
Wentylacja z Odzyskiem Ciepła (zwykle 3-fazowa, ~1.5kW)
```

## 📋 Typowe moce WLZ:

| Model WLZ | Wydajność | Moc | Fazy | IB (przy cosφ=0.9) |
|-----------|-----------|-----|------|-------------------|
| Domowa mała | 150 m³/h | 0.3 kW | 1 lub 3 | ~1.5 A |
| Domowa średnia | 300 m³/h | 0.8 kW | 3 | ~1.3 A |
| Domowa duża | 500 m³/h | 1.5 kW | 3 | ~2.4 A |
| Komercyjna | 1000 m³/h | 3 kW | 3 | ~4.8 A |

## 💡 Wskazówki projektowe:

### Dlaczego C16 dla WLZ?
- WLZ ma silnik z rozruchem (wyższa krotność In)
- Charakterystyka C (10×In) lepiej obsługuje rozruch
- Standard dla urządzeń silnikowych

### Długość przewodu
- WLZ zazwyczaj w strychu/piwnicy
- Typowa długość: 15-30m
- Sprawdź spadek napięcia!

### Typowa konfiguracja
```
WLZ w strychu (25m od rozdzielnicy):
- Typ: WLZ (Rekuperacja)
- Zasilanie: 3-fazowy
- Moc: 1.2 kW
- Długość: 25 m
- Przewód: 2.5 mm²
- Zabezpieczenie: C16

Sprawdzenie:
✅ IB = 1.9 A
✅ Złota zasada: 1.9 ≤ 16 ≤ 21 → OK
✅ Spadek napięcia: ~0.3% → OK
```

## 🔧 Lista wyboru w aplikacji:

Po dodaniu WLZ, dropdown "Typ obwodu" zawiera:
```
┌────────────────────────────────┐
│ Typ obwodu                     │
├────────────────────────────────┤
│ Oświetlenie                    │
│ Gniazda                        │
│ Silniki / Urządzenia 3-faz     │
│ WLZ (Rekuperacja)         ← NOWE
│ Inne                           │
└────────────────────────────────┘
```

## ✅ Gotowe do użycia!

Po zrestartowaniu serwera dev (Ctrl+C → `npm run dev`), w sekcji "Typ obwodu" zobaczysz nową opcję:

**WLZ (Rekuperacja)**

System automatycznie zasugeruje:
- Przekrój: 2.5 mm²
- Zabezpieczenie: C16
- Informację że to zwykle 3-fazowe urządzenie

---

**WLZ został dodany do systemu!** 🎉

Możesz teraz łatwo projektować obwody dla rekuperacji!

