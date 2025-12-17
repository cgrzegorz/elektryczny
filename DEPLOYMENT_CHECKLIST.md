# 📋 Checklist - Deployment na GitHub Pages

## ✅ Co zostało zrobione automatycznie:

- [x] Dodano `gh-pages` do devDependencies w package.json
- [x] Dodano skrypty `predeploy` i `deploy` w package.json
- [x] Skonfigurowano `base: '/elektryczny/'` w vite.config.ts
- [x] Utworzono GitHub Actions workflow (.github/workflows/deploy.yml)
- [x] Utworzono instrukcję deploymentu (GITHUB_PAGES.md)
- [x] Zaktualizowano README_PL.md

## 🔧 Co musisz zrobić teraz:

### 1. Zainstaluj nową zależność
```bash
npm install
```

### 2. Commituj i wypchnij zmiany
```bash
git add .
git commit -m "Add GitHub Pages deployment configuration"
git push origin main
```

### 3. Włącz GitHub Pages w ustawieniach repozytorium
1. Przejdź do swojego repozytorium na GitHub
2. Kliknij **Settings** (Ustawienia)
3. W menu po lewej wybierz **Pages**
4. W sekcji **Source** wybierz **GitHub Actions**
5. Zapisz zmiany

### 4. Poczekaj na automatyczny build
- Po pushu na `main` GitHub Actions automatycznie:
  - Zainstaluje zależności
  - Zbuduje aplikację
  - Wdroży ją na GitHub Pages
- Sprawdź postęp w zakładce **Actions** w repozytorium

### 5. Otwórz swoją aplikację! 🎉
Aplikacja będzie dostępna pod adresem:
```
https://[twoja-nazwa-użytkownika].github.io/elektryczny/
```

## 🔄 Alternatywa - Ręczny deployment

Jeśli wolisz wdrożyć ręcznie (bez GitHub Actions):

```bash
npm run deploy
```

To zbuduje projekt i wypchnie go do brancha `gh-pages`.

Potem w Settings → Pages wybierz:
- Source: **Deploy from a branch**
- Branch: **gh-pages** / root

## 📝 Uwagi

- Przy każdym pushu na `main` aplikacja zostanie automatycznie zaktualizowana
- Build trwa około 2-3 minut
- Możesz śledzić postęp w zakładce Actions
- Jeśli coś nie działa, zobacz logi w Actions

## 🆘 Troubleshooting

**Problem:** 404 po wejściu na stronę  
**Rozwiązanie:** Sprawdź czy GitHub Pages jest włączony i czy wybrałeś "GitHub Actions" jako źródło

**Problem:** Aplikacja się nie ładuje poprawnie  
**Rozwiązanie:** Upewnij się że `base: '/elektryczny/'` w vite.config.ts odpowiada nazwie repozytorium

**Problem:** Workflow się nie uruchamia  
**Rozwiązanie:** Sprawdź czy plik .github/workflows/deploy.yml został commitnięty

## 📚 Dodatkowe materiały

- [GITHUB_PAGES.md](./GITHUB_PAGES.md) - Szczegółowa instrukcja
- [Dokumentacja GitHub Pages](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

