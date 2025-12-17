# 🎓 Przewodnik Użytkownika - Automatyczne Zapisywanie

## ✨ Jak to działa?

Twoje obwody są **automatycznie zapisywane** w przeglądarce. Nie musisz nic robić!

## 💾 Co oznacza "automatyczne zapisywanie"?

### ✅ Dane są zachowane po:
- Odświeżeniu strony (F5)
- Zamknięciu przeglądarki
- Zamknięciu karty
- Wyłączeniu komputera
- Restarcie przeglądarki

### ❌ Dane NIE są:
- Synchronizowane między urządzeniami (np. laptop i telefon)
- Dostępne w innej przeglądarce
- Dostępne w trybie incognito/prywatnym

## 🔧 Funkcje w Sekcji 4 (Raport)

### 📥 Importuj JSON
Wczytaj wcześniej zapisane obwody z pliku JSON.

**Jak użyć:**
1. Kliknij przycisk "📥 Importuj JSON"
2. Wybierz plik `.json` z obwodami
3. Dane zostaną wczytane i zastąpią aktualne obwody

⚠️ **Uwaga:** Import zastępuje wszystkie aktualne obwody!

### 💾 Eksportuj JSON
Zapisz obwody do pliku JSON jako backup.

**Jak użyć:**
1. Kliknij przycisk "💾 Eksportuj JSON"
2. Plik zostanie pobrany: `obwody_2025-12-17.json`
3. Zachowaj ten plik jako backup!

💡 **Zalecenie:** Regularnie eksportuj dane, szczególnie przed czyszczeniem cache przeglądarki.

### 🗑️ Wyczyść wszystko
Usuń wszystkie obwody z localStorage.

**Jak użyć:**
1. Kliknij przycisk "🗑️ Wyczyść wszystko"
2. Potwierdź operację
3. Wszystkie dane zostaną usunięte

⚠️ **Uwaga:** Ta operacja jest nieodwracalna! Przed wyczyszczeniem zrób backup (eksportuj JSON).

## 📊 Przykładowy workflow

### Scenariusz 1: Codzienna praca
```
1. Otwórz aplikację
2. Dodaj nowe obwody
3. Dane zapisują się automatycznie
4. Zamknij przeglądarkę
5. Następnego dnia - dane wciąż są dostępne! ✅
```

### Scenariusz 2: Backup danych
```
1. Raz w tygodniu kliknij "💾 Eksportuj JSON"
2. Zapisz plik w bezpiecznym miejscu (chmura, pendrive)
3. Masz backup na wypadek problemów!
```

### Scenariusz 3: Praca na dwóch komputerach
```
Komputer 1:
1. Zaprojektuj obwody
2. Eksportuj JSON
3. Prześlij plik na komputer 2 (email, pendrive, cloud)

Komputer 2:
1. Otwórz aplikację
2. Importuj JSON
3. Kontynuuj pracę!
```

### Scenariusz 4: Udostępnianie projektu
```
1. Eksportuj JSON z Twoimi obwodami
2. Wyślij plik współpracownikowi
3. Współpracownik importuje JSON do swojej przeglądarki
4. Ma dostęp do Twoich obwodów!
```

## 🆘 FAQ

### ❓ Czy mogę pracować offline?
**Tak!** Po pierwszym załadowaniu strony, dane są zapisane lokalnie. Możesz dodawać obwody offline.

### ❓ Co jeśli wyczyszczę cache przeglądarki?
**Dane zostaną usunięte!** Dlatego zalecamy regularne eksportowanie do JSON.

### ❓ Czy dane są bezpieczne?
**Tak**, dane są przechowywane tylko w Twojej przeglądarce. Nikt inny nie ma do nich dostępu.

### ❓ Ile danych mogę zapisać?
localStorage ma limit **~5-10 MB** (zależy od przeglądarki). To wystarczy na **tysiące obwodów**.

### ❓ Czy mogę synchronizować między telefonem a komputerem?
**Nie automatycznie**. Użyj funkcji Eksport/Import JSON do ręcznego przenoszenia danych.

### ❓ Co się stanie jak otworzę aplikację w dwóch kartach?
**Dane będą synchronizowane!** Dodanie obwodu w jednej karcie automatycznie pojawi się w drugiej.

### ❓ Straciłem dane - czy mogę je odzyskać?
Jeśli:
- ✅ Masz backup JSON - importuj go
- ❌ Nie masz backupu - niestety nie da się odzyskać

**Zawsze rób backupy!** 💾

## 💡 Dobre praktyki

### ✅ Zalecane
- Eksportuj JSON co tydzień
- Zapisuj backupy w chmurze (Google Drive, Dropbox)
- Używaj opisowych nazw obwodów
- Regularnie sprawdzaj czy dane są zapisane

### ❌ Niezalecane
- Praca w trybie incognito (dane nie będą zapisane)
- Czyszczenie cache bez backupu
- Udostępnianie komputera bez eksportu danych

## 🔗 Powiązane dokumenty

- [LOCALSTORAGE.md](./LOCALSTORAGE.md) - Szczegółowa dokumentacja techniczna
- [README_PL.md](./README_PL.md) - Dokumentacja projektu

---

**Pamiętaj:** Twoje dane są bezpieczne i automatycznie zapisywane, ale **zawsze rób backupy** do pliku JSON! 💾

