# Test funkcjonalności spadku napięcia

## Jak przetestować sekcję "2b. Spadek napięcia"

### Krok 1: Wypełnij sekcję 1 - Dane obwodu
- **Nazwa obwodu**: np. "Test salon"
- **Typ obwodu**: wybierz "Oświetlenie" (limit 3%) lub "Gniazda" (limit 5%)
- **Prąd obliczeniowy IB**: np. 10 A

### Krok 2: Wypełnij sekcję 2 - Obliczenia
- **Zabezpieczenie In**: np. 16 A
- **Charakterystyka**: B
- **Przekrój przewodu**: np. 1.5 mm² lub 2.5 mm²

### Krok 3: Wypełnij sekcję 2b - Spadek napięcia
- **Długość przewodu**: np. 20 m

### Oczekiwany wynik:
Po wypełnieniu wszystkich pól, sekcja 2b powinna pokazać:
- ✅ Obliczony spadek napięcia w %
- Dopuszczalny limit (3% dla oświetlenia, 5% dla gniazd)
- Pasek wizualizujący proporcję spadku do limitu
- Komunikat czy spadek mieści się w normie

### Przykładowe obliczenia:

#### Przykład 1: Oświetlenie (OK)
- IB = 10 A
- Długość = 20 m  
- Przekrój = 1.5 mm²
- **Wynik**: ΔU ≈ 2.03% (✅ poniżej 3%)

#### Przykład 2: Oświetlenie (ZA DUŻO)
- IB = 16 A
- Długość = 40 m
- Przekrój = 1.5 mm²
- **Wynik**: ΔU ≈ 6.50% (❌ powyżej 3%)
- System powinien zasugerować zwiększenie przekroju lub skrócenie trasy

#### Przykład 3: Gniazda (OK)
- IB = 16 A
- Długość = 25 m
- Przekrój = 2.5 mm²
- **Wynik**: ΔU ≈ 2.43% (✅ poniżej 5%)

## Wzór matematyczny
```
ΔU% = (2 × IB × ρ × L) / (S × U₀) × 100%
```

gdzie:
- IB - prąd obliczeniowy [A]
- ρ = 0.0175 Ω·mm²/m (dla miedzi)
- L - długość przewodu [m]
- S - przekrój przewodu [mm²]
- U₀ = 230V (napięcie fazowe)

## Rozwiązywanie problemów

### Sekcja nie pokazuje wyników?
Sprawdź czy wypełniłeś:
1. ✅ Prąd IB w sekcji 1
2. ✅ Przekrój przewodu w sekcji 2
3. ✅ Długość przewodu w sekcji 2b

### Wartość wynosi 0%?
- Sprawdź czy IB > 0
- Sprawdź czy długość > 0
- Sprawdź czy przekrój > 0

### Spadek wydaje się za duży?
To normalne! Długie przewody o małym przekroju dają duże spadki napięcia.
Rozwiązania:
- Zwiększ przekrój przewodu (np. z 1.5mm² na 2.5mm²)
- Skróć trasę kabla (jeśli możliwe)
- Podziel obwód na mniejsze części

