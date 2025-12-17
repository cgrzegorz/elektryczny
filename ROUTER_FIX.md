# 🔧 Naprawa React Router dla GitHub Pages

## Problem
```
App.tsx:12 No routes matched location "/elektryczny/"
```

## Przyczyna
React Router (BrowserRouter) nie wiedział o bazowej ścieżce `/elektryczny/` używanej przez GitHub Pages.

## Rozwiązanie

### 1. Dodano `basename` do BrowserRouter w App.tsx

**Przed:**
```typescript
<Router>
  <Navigation />
  <Routes>
    <Route path="/" element={<Home />} />
    ...
  </Routes>
</Router>
```

**Po:**
```typescript
const basename = import.meta.env.BASE_URL

<Router basename={basename}>
  <Navigation />
  <Routes>
    <Route path="/" element={<Home />} />
    ...
  </Routes>
</Router>
```

### 2. Dynamiczna konfiguracja base w vite.config.ts

**Przed:**
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/elektryczny/',
})
```

**Po:**
```typescript
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // W dev mode używaj '/', w production '/elektryczny/'
  base: mode === 'production' ? '/elektryczny/' : '/',
}))
```

## Jak to działa?

### Lokalny development (npm run dev)
- `base: '/'` - aplikacja działa na http://localhost:5173/
- Router używa basename: `/`
- Wszystkie linki działają normalnie

### Production build (GitHub Pages)
- `base: '/elektryczny/'` - aplikacja działa na https://user.github.io/elektryczny/
- Router używa basename: `/elektryczny`
- Wszystkie linki są automatycznie prefixowane

### import.meta.env.BASE_URL
Vite automatycznie ustawia `BASE_URL` na podstawie konfiguracji `base`:
- Development: `BASE_URL = '/'`
- Production: `BASE_URL = '/elektryczny/'`

## Testowanie

### Lokalnie (dev mode)
```bash
npm run dev
# Otwórz http://localhost:5173/
# Routing powinien działać: /, /data, /about
```

### Lokalnie (preview production build)
```bash
npm run build
npm run preview
# Otwórz http://localhost:4173/elektryczny/
# Routing powinien działać: /elektryczny/, /elektryczny/data, /elektryczny/about
```

### Na GitHub Pages
```
https://[username].github.io/elektryczny/
```

## Linki w aplikacji

Wszystkie linki używają komponentu `Link` z react-router-dom:
```typescript
<Link to="/">Dashboard</Link>
<Link to="/data">Dane Techniczne</Link>
<Link to="/about">O aplikacji</Link>
```

React Router automatycznie dodaje basename, więc:
- Dev: `/`, `/data`, `/about`
- Prod: `/elektryczny/`, `/elektryczny/data`, `/elektryczny/about`

## Sprawdź czy działa

1. **W dev mode:**
   - Uruchom: `npm run dev`
   - Sprawdź czy strona główna ładuje się na http://localhost:5173/
   - Kliknij linki w nawigacji

2. **W production mode:**
   - Zbuduj: `npm run build`
   - Preview: `npm run preview`
   - Sprawdź czy strona główna ładuje się na http://localhost:4173/elektryczny/
   - Kliknij linki w nawigacji

3. **Na GitHub Pages:**
   - Deploy: `npm run deploy` (lub push na main)
   - Otwórz: https://[username].github.io/elektryczny/
   - Sprawdź czy routing działa

## Dodatkowe uwagi

### HashRouter jako alternatywa
Jeśli nadal masz problemy, możesz użyć HashRouter zamiast BrowserRouter:

```typescript
import { HashRouter as Router } from 'react-router-dom'
```

Wtedy URL będzie wyglądać: `https://user.github.io/elektryczny/#/`

Ale BrowserRouter z basename jest lepszym rozwiązaniem (czyste URL).

### 404 na odświeżeniu
Jeśli dostajesz 404 po odświeżeniu podstrony na GitHub Pages, dodaj plik `public/404.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Elektryczny</title>
    <script>
      sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/elektryczny'">
  </head>
</html>
```

Ale dla tej konfiguracji nie powinno być problemu.

## Status: ✅ Naprawione

Routing React Router jest teraz poprawnie skonfigurowany dla:
- ✅ Lokalny development (`/`)
- ✅ Production build (`/elektryczny/`)
- ✅ GitHub Pages deployment

