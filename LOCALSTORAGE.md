# 💾 LocalStorage - Automatyczne Zapisywanie Danych

## 🎯 Funkcjonalność

Aplikacja automatycznie zapisuje wszystkie dodane obwody w localStorage przeglądarki. Dane pozostają zachowane nawet po:
- Odświeżeniu strony (F5)
- Zamknięciu przeglądarki
- Wyłączeniu komputera

## ✨ Cechy

### Automatyczne zapisywanie
- Każdy dodany obwód jest natychmiast zapisywany w localStorage
- Nie musisz nic robić - wszystko działa automatycznie
- Dane są synchronizowane między kartami przeglądarki

### Import/Export
- **📥 Importuj JSON** - wczytaj wcześniej zapisane obwody z pliku
- **💾 Eksportuj JSON** - zapisz obwody do pliku JSON
- **🗑️ Wyczyść wszystko** - usuń wszystkie obwody z localStorage

## 🔧 Jak to działa?

### useLocalStorage Hook
Aplikacja używa custom hook `useLocalStorage`, który:
1. Ładuje dane z localStorage przy starcie
2. Automatycznie zapisuje przy każdej zmianie
3. Synchronizuje dane między kartami
4. Obsługuje błędy (np. pełny localStorage)

### Klucz w localStorage
Dane są zapisywane pod kluczem: `elektryczny-circuits`

## 📝 Przykład użycia

### Podstawowe operacje
```typescript
// Hook automatycznie synchronizuje state z localStorage
const [circuits, setCircuits] = useLocalStorage<Circuit[]>('elektryczny-circuits', [])

// Dodanie obwodu - automatycznie zapisze
setCircuits([...circuits, newCircuit])

// Usunięcie obwodu - automatycznie zapisze
setCircuits(circuits.filter(c => c.id !== id))

// Wyczyszczenie wszystkich - automatycznie zapisze
setCircuits([])
```

### Import z pliku JSON
```typescript
const handleImport = (importedCircuits: Circuit[]) => {
  setCircuits(importedCircuits) // Automatycznie zastępuje i zapisuje
}
```

### Export do pliku JSON
```typescript
const handleExport = () => {
  const data = JSON.stringify(circuits, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `obwody_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}
```

## 🛠️ Utility Functions

Aplikacja zawiera również pomocnicze funkcje do zarządzania localStorage:

```typescript
import { localStorageUtils } from '../hooks/useLocalStorage'

// Zapisz dane
localStorageUtils.save('key', data)

// Wczytaj dane
const data = localStorageUtils.load('key', defaultValue)

// Usuń konkretny klucz
localStorageUtils.remove('key')

// Wyczyść cały localStorage
localStorageUtils.clear()

// Sprawdź czy klucz istnieje
if (localStorageUtils.exists('key')) { ... }
```

## 🔒 Bezpieczeństwo danych

### Limity localStorage
- Maksymalna pojemność: ~5-10 MB (zależy od przeglądarki)
- Dane są przechowywane lokalnie w przeglądarce
- Dane NIE są synchronizowane między urządzeniami
- Dane mogą być usunięte przez użytkownika (czyszczenie cache)

### Backup danych
**Zalecenie:** Regularnie eksportuj obwody do pliku JSON jako backup!

```
Sekcja 4 → Przycisk "💾 Eksportuj JSON"
```

## 📊 Format danych

Obwody są zapisywane jako tablica JSON:

```json
[
  {
    "id": "1234567890",
    "name": "Salon - gniazda",
    "type": "sockets",
    "IB": 16,
    "In": 20,
    "characteristic": "B",
    "crossSection": 2.5,
    "material": "copper",
    "Iz": 21,
    "length": 25,
    "voltageDrop": 2.43,
    "Zs": 0.8,
    "goldenRuleValid": true,
    "swzValid": true
  }
]
```

## 🔄 Synchronizacja między kartami

Hook `useLocalStorage` automatycznie synchronizuje dane między kartami:
- Otwórz aplikację w dwóch kartach
- Dodaj obwód w jednej karcie
- Dane automatycznie zaktualizują się w drugiej karcie

## 🆘 Rozwiązywanie problemów

### Dane się nie zapisują
1. Sprawdź czy localStorage nie jest wyłączony w przeglądarce
2. Sprawdź czy nie jest pełny (limit ~5-10 MB)
3. Sprawdź konsolę przeglądarki (F12) czy nie ma błędów

### Chcę wyczyścić dane
Opcja 1: Użyj przycisku "🗑️ Wyczyść wszystko" w sekcji 4
Opcja 2: Ręcznie w konsoli przeglądarki:
```javascript
localStorage.removeItem('elektryczny-circuits')
```

### Chcę przenieść dane na inne urządzenie
1. Eksportuj JSON (przycisk "💾 Eksportuj JSON")
2. Prześlij plik na inne urządzenie
3. Importuj JSON (przycisk "📥 Importuj JSON")

## 📱 Wsparcie przeglądarek

localStorage jest wspierany przez:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Wszystkie nowoczesne przeglądarki

## 🎓 Więcej informacji

- [MDN - Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Can I Use - localStorage](https://caniuse.com/namevalue-storage)

