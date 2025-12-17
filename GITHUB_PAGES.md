# 🚀 GitHub Pages - Instrukcja Deploymentu

## Automatyczny deployment (zalecany)

Projekt jest skonfigurowany do automatycznego deploymentu na GitHub Pages przy użyciu GitHub Actions.

### Konfiguracja początkowa:

1. **Wypchaj kod na GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

2. **Włącz GitHub Pages w ustawieniach repozytorium:**
   - Przejdź do Settings → Pages
   - W sekcji "Source" wybierz **GitHub Actions**

3. **Gotowe!** 🎉
   - Przy każdym pushu na branch `main` aplikacja zostanie automatycznie zbudowana i wdrożona
   - URL: `https://[twoja-nazwa-użytkownika].github.io/elektryczny/`

### Ręczny deployment (alternatywa):

Jeśli wolisz ręczny deployment:

1. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

2. **Zbuduj i wdróż:**
   ```bash
   npm run deploy
   ```

## 📝 Struktura projektu

```
.github/
  workflows/
    deploy.yml          # GitHub Actions workflow dla auto-deploymentu
package.json            # Zawiera skrypty deploy i predeploy
vite.config.ts          # Zawiera base: '/elektryczny/' dla GitHub Pages
```

## 🔧 Konfiguracja

### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/elektryczny/', // Nazwa repozytorium
})
```

### package.json - Skrypty
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

## 🌐 Dostęp do aplikacji

Po wdrożeniu aplikacja będzie dostępna pod adresem:
- **URL:** `https://[twoja-nazwa-użytkownika].github.io/elektryczny/`

## 🔍 Sprawdzanie statusu deploymentu

1. Zakładka **Actions** w repozytorium GitHub
2. Zobacz logi budowania i deploymentu
3. Sprawdź czy workflow zakończył się sukcesem (zielony ptaszek ✓)

## ⚠️ Troubleshooting

### Aplikacja nie działa po deployment
- Sprawdź czy `base` w `vite.config.ts` odpowiada nazwie repozytorium
- Upewnij się że GitHub Pages jest włączony w ustawieniach
- Sprawdź logi w zakładce Actions

### 404 na podstronach (React Router)
Jeśli używasz React Router i dostajesz 404 na odświeżeniu:
- Dodaj plik `dist/404.html` który przekierowuje do `index.html`
- Lub użyj HashRouter zamiast BrowserRouter

### Błędy w GitHub Actions
- Sprawdź logi w zakładce Actions
- Upewnij się że wszystkie zależności są w `package.json`
- Sprawdź czy build działa lokalnie: `npm run build`

## 📚 Dodatkowe zasoby

- [Dokumentacja GitHub Pages](https://docs.github.com/en/pages)
- [Dokumentacja Vite - Deployment](https://vitejs.dev/guide/static-deploy.html)
- [gh-pages package](https://www.npmjs.com/package/gh-pages)

