# ⚡ Elektryczny - Kalkulator Obliczeń Elektrycznych

Aplikacja webowa do obliczeń elektrycznych stworzona z wykorzystaniem **React + Vite + TailwindCSS**.

## 🌐 Demo

Aplikacja jest dostępna online: **[Zobacz Demo](https://[twoja-nazwa-użytkownika].github.io/elektryczny/)**

## 🚀 Technologie

- **React 19** + TypeScript
- **Vite** - szybkie budowanie i dev server
- **TailwindCSS** - utility-first CSS framework
- **React Router** - routing w aplikacji

## 🎯 Architektura Dashboard

Aplikacja wykorzystuje układ **Dashboard** z czterema głównymi sekcjami w jednym widoku:

### 1️⃣ Sekcja Wejściowa (Obwód)
- **Cel**: Określenie parametrów projektowanego obwodu
- **Pola**: Nazwa obwodu, Typ (Oświetlenie/Gniazda/Inne), Prąd odbiornika IB
- **Inteligencja**: System automatycznie sugeruje standardowe parametry po wyborze typu obwodu
  - *Gniazda* → 2.5mm² + B16
  - *Oświetlenie* → 1.5mm² + B10

### 2️⃣ Sekcja Obliczeniowa (Złota Zasada)
- **Cel**: Dynamiczna weryfikacja warunku IB ≤ In ≤ Iz
- **Wizualizacja**: 
  - Pasek postępu pokazujący wykorzystanie przewodu
  - Czerwone ostrzeżenie gdy warunek niespełniony
  - Przykład: Przewód 1.5mm² (Iz≈14.5A) + B16 → ❌ błąd (16A > 14.5A)

### 3️⃣ Sekcja Bezpieczeństwa (SWZ)
- **Cel**: Sprawdzenie skuteczności wyłączenia zwarcia
- **Wzór**: Zs ≤ U₀/Ia
- **Sugestie**: System podpowiada:
  - Zwiększenie przekroju przewodu
  - Zmianę charakterystyki z C na B
  - Sprawdzenie połączenia ochronnego PE

### 4️⃣ Sekcja Raportu (Dokumentacja)
- **Cel**: Zestawienie wszystkich zaprojektowanych obwodów
- **Tabela**: Nazwa | Przewód | Zabezpieczenie | Złota zasada | SWZ | Spadek U
- **Eksport/Import**: JSON, PDF (TODO), Excel (TODO)
- **Statystyki**: Suma IB, liczba poprawnych/błędnych obwodów
- **💾 Automatyczne zapisywanie**: Dane zapisywane w localStorage przeglądarki
  - Zachowanie danych po odświeżeniu strony
  - Import/Export do pliku JSON
  - Funkcja czyszczenia wszystkich danych

## 📁 Struktura Projektu

```
src/
├── components/          # Komponenty UI
│   ├── Input.tsx       # Input z etykietą i jednostkami
│   ├── Badge.tsx       # Kolorowe etykiety statusów
│   ├── Table.tsx       # Tabela z danymi
│   └── Navigation.tsx  # Nawigacja aplikacji
│
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts  # Hook do localStorage (auto-save)
│
├── logic/              # Czyste funkcje obliczeniowe
│   └── calculations.ts # Wzory elektryczne (bez side-effects)
│
├── constants/          # Stałe wartości
│   ├── coefficients.ts # Współczynniki korekcyjne (k)
│   └── cableTables.ts  # Tabele obciążalności (Iz)
│
├── pages/              # Strony aplikacji
│   ├── Home.tsx        # Strona główna z kalkulatorem
│   └── About.tsx       # Strona o aplikacji
│
├── App.tsx             # Główny komponent z routingiem
└── main.tsx            # Entry point aplikacji
```

## 🛠️ Instalacja i Uruchomienie

### Instalacja zależności
```bash
npm install
```

### Uruchomienie dev servera
```bash
npm run dev
```

### Build produkcyjny
```bash
npm run build
```

### Podgląd buildu
```bash
npm run preview
```

## 📚 Komponenty UI

### Input
Komponent do wprowadzania danych numerycznych z etykietami i jednostkami:
```tsx
<Input
  label="Moc"
  value={power}
  onChange={setPower}
  type="number"
  unit="W"
  placeholder="Wprowadź moc"
/>
```

### Badge
Kolorowe etykiety do wyświetlania statusów:
```tsx
<Badge variant="success">Niski prąd</Badge>
<Badge variant="warning">Wysoki prąd</Badge>
```

### Table
Tabela z danymi generyczna:
```tsx
<Table
  data={CABLE_CAPACITY_A1}
  columns={columns}
  caption="Obciążalność przewodów"
/>
```

## 🧮 Funkcje Obliczeniowe

Wszystkie funkcje obliczeniowe znajdują się w `src/logic/calculations.ts`:

- `calculateCurrent(power, voltage, powerFactor)` - oblicza prąd
- `calculateVoltageDrop(current, resistance)` - oblicza spadek napięcia
- `calculateActivePower(voltage, current, powerFactor)` - oblicza moc czynną
- `calculateResistance(resistivity, length, crossSection)` - oblicza rezystancję

## 📊 Stałe i Tabele

### Współczynniki korekcyjne (`coefficients.ts`)
- Współczynniki temperaturowe
- Współczynniki sposobu układania
- Współczynniki grupowania obwodów
- Rezystywność materiałów
- Współczynniki mocy

### Tabele obciążalności (`cableTables.ts`)
- `CABLE_CAPACITY_A1` - przewody w rurach w ścianie
- `CABLE_CAPACITY_B2` - przewody w rurkach na ścianie
- `CABLE_CAPACITY_C` - przewody bezpośrednio w ziemi

### Dane techniczne (`electricalData.ts`) ⭐ NOWE
- `NOMINAL_CURRENTS` - prądy znamionowe zabezpieczeń [6, 10, 13, 16, 20, 25, 32, 40, 50, 63]
- `TRIP_MULTIPLIERS` - krotności wyzwalania { B: 5, C: 10, D: 20 }
- `K_COEFFICIENTS` - współczynniki k (115 dla Cu/PVC, 143 dla Cu/XLPE, etc.)
- `VOLTAGE_DROP_LIMITS` - limity spadków napięcia { lighting: 0.03, sockets: 0.05 }

## 📝 TODO

- [ ] Dodać więcej wzorów obliczeniowych
- [ ] Uzupełnić tabele wartościami z norm
- [ ] Dodać walidację danych wejściowych
- [ ] Dodać testy jednostkowe
- [ ] Dodać eksport wyników do PDF
- [x] **GitHub Pages deployment** ✅
- [x] **localStorage - automatyczne zapisywanie** ✅

## 💾 Automatyczne zapisywanie

Aplikacja automatycznie zapisuje wszystkie dodane obwody w localStorage przeglądarki!

**Funkcje:**
- ✅ Automatyczne zapisywanie przy każdej zmianie
- ✅ Dane pozostają po odświeżeniu strony
- ✅ Import/Export do pliku JSON
- ✅ Funkcja czyszczenia wszystkich danych
- ✅ Synchronizacja między kartami przeglądarki

**Szczegóły:** Zobacz [LOCALSTORAGE.md](./LOCALSTORAGE.md)

## 🚀 Deployment

Aplikacja jest automatycznie wdrażana na GitHub Pages przy każdym pushu na branch `main`.

**Instrukcja deploymentu:** Zobacz [GITHUB_PAGES.md](./GITHUB_PAGES.md)

**Kroki:**
1. Wypchaj kod: `git push origin main`
2. GitHub Actions automatycznie zbuduje i wdroży aplikację
3. Aplikacja dostępna pod: `https://[twoja-nazwa].github.io/elektryczny/`

## 📄 Licencja

Projekt prywatny

