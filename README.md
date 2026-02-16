# EGEL Simulator (Electron + React)

An offline-first exam simulator built with Electron for the desktop shell and a React + Vite renderer. The app validates product keys against Supabase, binds them to the current device, stores signed activations locally in SQLite, and delivers a guided simulation experience with practice and timed modes.

## Features
- Product key validation with remote Supabase lookup, device binding, and local signed activation records
- Auth gate with formatted UUID input and friendly error messaging
- Exam setup with discipline selection (disciplinar, transversal, or both), practice mode toggle, and timer control
- Question runner with progress tracking, optional countdown, and practice feedback showing correct answers
- Attempt history persisted locally (Zustand + storage) with summary stats per discipline

## Tech Stack
- **Desktop shell:** Electron 27, IPC bridge via `contextBridge`
- **Renderer:** React 19, React Router 7, Zustand, Tailwind CSS 4, Vite 7
- **Data:** SQLite (via Sequelize) for local activations; Supabase as the remote license source; localStorage for attempt history
- **Security:** HMAC-SHA256 signatures for local activation integrity, device binding with `node-machine-id`

## Architecture
- **Main process (Electron):**
  - Bootstrap in [main/main.js](main/main.js) creates the browser window, syncs the local SQLite schema, and registers IPC handlers.
  - IPC layer in [main/ipc/handlers/licenseActivation.handler.js](main/ipc/handlers/licenseActivation.handler.js) exposes CRUD plus `verifyAndActivateKey` and `verifyLocalActivation` to the renderer.
  - Local persistence via Sequelize model in [main/db/models/LicenseActivation.js](main/db/models/LicenseActivation.js); database stored under the Electron `userData` directory.
  - Remote license service in [main/services/remoteLicense.services.js](main/services/remoteLicense.services.js) talks to Supabase; signatures handled in [main/ipc/utils/signature.js](main/ipc/utils/signature.js).
- **Renderer:**
  - Entrypoint [renderer/src/main.tsx](renderer/src/main.tsx) mounts React inside a HashRouter.
  - Routing defined in [renderer/src/routes/routes.tsx](renderer/src/routes/routes.tsx) with pages for auth, home, setup, test, and history.
  - State managed with Zustand stores: license ([renderer/src/features/auth/hooks/useLicenseStore.tsx](renderer/src/features/auth/hooks/useLicenseStore.tsx)), setup ([renderer/src/features/EGEL/hooks/useSetupStore.tsx](renderer/src/features/EGEL/hooks/useSetupStore.tsx)), questions ([renderer/src/features/EGEL/hooks/useQuestions.tsx](renderer/src/features/EGEL/hooks/useQuestions.tsx)), and history ([renderer/src/features/EGEL/hooks/useHistoryStore.tsx](renderer/src/features/EGEL/hooks/useHistoryStore.tsx)).
  - Question UI component in [renderer/src/features/EGEL/components/Question.tsx](renderer/src/features/EGEL/components/Question.tsx) renders markdown and answer options with feedback support.

## Application Flow
1. **Launch:** Electron loads the renderer (localhost:5173 in dev, packaged HTML in prod) and syncs the SQLite schema.
2. **License check:** The renderer calls `window.api.licenseActivation.verifyLocalActivation`; the main process validates the HMAC signature against the current machine ID. If invalid, the record is removed.
3. **Product key entry:** On the Auth page the user enters a UUID key. `verifyAndActivateKey` queries Supabase, ensures the license is active and unbound (or bound to this device), binds it remotely, signs the payload locally, and stores it in SQLite.
4. **Simulation setup:** The user selects discipline scope, practice mode, and timer preferences; config is stored in Zustand.
5. **Taking the test:** Questions are served from a local set in [renderer/src/features/EGEL/services/questions.ts](renderer/src/features/EGEL/services/questions.ts); progress and optional countdown are shown. In practice mode, the correct answer is revealed after each selection.
6. **History:** On completion, a summary is written to the history store and shown in [renderer/src/pages/HistoryPage.tsx](renderer/src/pages/HistoryPage.tsx); entries persist via storage middleware.

## Project Layout
```
main/       # Electron main process, IPC, SQLite models, Supabase client
renderer/   # React/Vite renderer (UI, routing, state, styles)
```

## Prerequisites
- Node.js 18+
- npm (ships with Node)
- Supabase project with a `licenses` table containing `product_key`, `status`, `machineId`, `activated_at` columns

## Environment Variables
Set these in a `.env` file at the project root:

- `SIGNATURE_SECRET` – secret used to generate/verify HMAC signatures for local activations
- `SUPABASE_URL` – project URL
- `SUPABASE_ANON_KEY` – anon/public key for Supabase client

## Install & Run
```bash
# Install root deps and renderer deps
npm run install:all

# Start dev (Electron + Vite, runs both concurrently)
npm run dev

# Run only renderer dev server
npm --prefix renderer run dev

# Package renderer + Electron app
npm run build      # builds renderer then electron-builder
```
During dev, Electron opens devtools and loads `http://localhost:5173`. The SQLite file is created under the Electron user data directory.

## IPC Surface
Renderer calls exposed via `window.api.licenseActivation` (see [main/preload.js](main/preload.js)):
- `verifyAndActivateKey(productKey)` – validates remotely, binds to device, writes signed local record
- `verifyLocalActivation()` – validates the local record signature and machine binding
- `findByProductKey(productKey)` – look up a local activation

## Notes
- History storage currently lives in localStorage via Zustand; SQLite is used only for license activations.
- The bundled question set is static; extend [renderer/src/features/EGEL/services/questions.ts](renderer/src/features/EGEL/services/questions.ts) to wire real questions or a backend source.
- Keep `SIGNATURE_SECRET` safe; regenerating it invalidates existing local activations.
