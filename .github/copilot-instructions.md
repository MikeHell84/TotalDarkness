# Copilot instructions for `TotalDarknessVercel`

## Architecture at a glance

- Hybrid runtime: React/Vite SPA in `src/` + static/PHP surfaces in `public/`.
- Entrypoint is `src/main.jsx`; `src/main.tsx` only delegates to it.
- SPA routing is intentionally narrow (`/` + catch-all redirect in `src/main.jsx`).
- `src/App.jsx` is the orchestration hub (intro states, 3D universe, section transitions). Prefer surgical edits here.
- Static microsites live in `public/redemthor/`, `public/el-ropero/`, `public/total-darkness/`.
- Backend behavior is mostly PHP scripts in `public/api/`, routed explicitly by `public/router.php` before static fallback.

## Service boundaries and data flow

- React analytics: `useAnalytics(pageTitle, pageType)` in `src/hooks/useAnalytics.js`.
- Static HTML analytics: `initAnalytics(pageTitle, pageType)` from `public/js/analytics-tracker.js`.
- Analytics endpoints: `/api/analytics.php`, `/api/analytics-event.php`, `/api/analytics-ping.php`.
- Payload keys are contract-sensitive: keep names like `sessionId`, `pageTitle`, `pageType`, `timeSpent`, `screenResolution`, `url`, `hostname` unchanged.
- Analytics PHP reads `.env` via `public/api/config.php`; missing DB env vars intentionally return `200` with `configured: false`.
- Dev proxy in `vite.config.js`: `/api` -> `http://localhost:8000`, with local fallback for `/api/*.json` requests.
- Email has two paths: PHP endpoint `public/api/send-email.php` and optional Node service in `server/email-server.js`.

## Critical workflows

- Frontend dev: `npm run dev`
- PHP API/router dev (from `public/`): `php -S localhost:8000 router.php`
- Build/preview: `npm run build`, `npm run preview`
- Lint/format: `npm run lint`, `npm run lint:fix`, `npm run format`
- There is no meaningful unit test suite (`npm test` is a placeholder that exits with error).
- Deploy guardrails in `deploy.ps1`: requires clean git state on `main`, runs `npm ci`, `npm run lint`, `npm run build`.

## Project-specific patterns

- Keep bilingual UX copy (`es`/`en`) consistent; see translation objects in `src/App.jsx`.
- Use storage safety wrappers instead of direct storage access (`safeSessionGet`, `safeSessionSet`, `safeLocalStorageGet`, `safeLocalStorageSet`).
- If a feature/page exists in both SPA and static HTML, update both analytics paths (`src/hooks/useAnalytics.js` and `public/js/analytics-tracker.js`).
- Preserve router style in `public/router.php`: explicit route checks first, then static file serving and MIME handling.
- Respect curated chunking in `vite.config.js` (`manualChunks` groups like `react-vendor`, `three-vendor`, `mermaid-vendor`).

## Edit boundaries and safe targets

- Primary SPA zones: `src/components/`, `src/pages/`, `src/hooks/`, `src/context/`, `src/services/`.
- Public runtime/API zones: `public/api/*.php`, `public/router.php`, `public/js/analytics-tracker.js`.
- Avoid broad edits in vendor/generated/legacy trees unless task explicitly requires it (e.g., `src/sub-apps/el-ropero/vendor/`, `dist/`).
- ESLint intentionally ignores several static trees (`public/total-darkness/**`, `public/redemthor/**`, `public/el-ropero/**`, `src/sub-apps/el-ropero/**`, `server/**`, `scripts/**`).
