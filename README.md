# EGEL Simulator

Desktop application for EGEL-style exam simulation with local + remote license validation.

This repository is organized into two runtime layers:

- `main/`: Electron main process (Node.js, IPC, SQLite, license orchestration)
- `renderer/`: React app (authentication UI, simulation workflow, exam screens, history)

## Table of Contents

- [Project Goals](#project-goals)
- [High-Level Architecture](#high-level-architecture)
- [Technical Stack](#technical-stack)
- [Runtime Lifecycle](#runtime-lifecycle)
- [License System](#license-system)
- [Simulation Module](#simulation-module)
- [Folder Structure](#folder-structure)
- [Data Model](#data-model)
- [IPC Contract](#ipc-contract)
- [Environment Variables](#environment-variables)
- [Setup and Development](#setup-and-development)
- [Build and Packaging](#build-and-packaging)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Known Limitations](#known-limitations)
- [Suggested Next Improvements](#suggested-next-improvements)

## Project Goals

The application is designed to:

1. Restrict access to licensed users.
2. Bind a product key to a device (`machineId`) through remote validation.
3. Persist a local activation record for offline startup checks.
4. Provide a configurable exam simulator (area, timer, practice mode).
5. Persist user attempts and scores in local frontend state.

## High-Level Architecture

### 1) Electron Main Process (`main/`)

Main responsibilities:

- Bootstrap Electron app and create the BrowserWindow.
- Configure secure renderer sandboxing (`contextIsolation`, `nodeIntegration: false`).
- Initialize and sync local SQLite schema through Sequelize.
- Register IPC handlers for license operations.
- Execute sensitive operations (remote validation, signature generation/checks).

Primary files:

- `main/main.js`
- `main/db/index.js`
- `main/ipc/index.js`
- `main/ipc/handlers/licenseActivation.handler.js`

### 2) Preload Bridge (`main/preload.js`)

The preload script exposes a minimal, controlled API to the renderer via `contextBridge`.

Why it matters:

- Renderer code does not directly access Node.js APIs.
- IPC surface is constrained to explicit methods.
- Security boundary is clear and auditable.

### 3) Renderer (`renderer/`)

Main responsibilities:

- Route control and license-based navigation.
- Product key capture and activation UX.
- Exam setup and test flow.
- Attempt history rendering.
- Local UI state handling through Zustand stores.

Entry points:

- `renderer/src/main.tsx`: HashRouter bootstrap.
- `renderer/src/App.tsx`: initial license refresh and route mounting.
- `renderer/src/routes/routes.tsx`: route table.

## Technical Stack

### Core Runtime

- Electron `^27.0.0`
- Node.js (CommonJS in main process)
- React `^19.1.0`
- TypeScript (renderer)
- Vite `^7.0.5`

### Data and Persistence

- SQLite (`sqlite3`)
- Sequelize (`^6.37.7`)
- Supabase client (`@supabase/supabase-js`)

### State and Routing

- Zustand (`^5.0.6`)
- Zustand persist middleware
- React Router DOM (`^7.6.3`)

### UI and Content

- Tailwind CSS v4
- Lucide React icons
- React Markdown (question/option rendering)

### Tooling

- concurrently (parallel dev scripts)
- electron-builder (desktop packaging)

## Runtime Lifecycle

### Development flow

1. Run `npm run dev` from repository root.
2. Vite dev server starts in `renderer/`.
3. Electron main process starts and points to `http://localhost:5173`.
4. BrowserWindow opens and IPC handlers are registered.

### Production flow

1. Build renderer static assets.
2. Package Electron app with `electron-builder`.
3. In packaged mode, Electron loads `renderer/dist/index.html`.

## License System

The license subsystem is the core access-control layer.

### Activation flow (`verifyAndActivateKey`)

1. User enters a UUID product key on `AuthPage`.
2. Renderer calls `window.api.licenseActivation.verifyAndActivateKey(productKey)`.
3. Main process obtains `machineId` using `node-machine-id`.
4. Main process fetches remote license from Supabase (`licenses` table).
5. Validation checks:
   - license exists
   - license status is `active`
   - license is not bound to a different machine
6. If valid, app updates remote record with `machineId` + activation timestamp.
7. App creates local activation record in SQLite.
8. Local record includes an HMAC signature of `{ productKey, machineId }`.

### Local verification flow (`verifyLocalActivation`)

1. On startup, renderer executes `useLicenseStore.refresh()`.
2. Renderer requests local validation via IPC.
3. Main process loads first local activation from SQLite.
4. Main process recomputes HMAC using `SIGNATURE_SECRET`.
5. If signature mismatch is detected:
   - activation record is deleted
   - access is denied
6. If valid, user is considered authenticated and redirected to `/home`.

### Signature design

- Algorithm: HMAC-SHA256
- Key: `SIGNATURE_SECRET`
- Payload normalization: keys are recursively sorted before hashing

This design prevents trivial local record tampering.

## Simulation Module

The simulation flow is entirely in renderer state.

### Setup (`/setup`)

User chooses:

- `area`: `disciplinar`, `transversal`, or `ambas`
- `timerEnabled`: boolean
- `practiceMode`: boolean
- `duration`: currently hardcoded in setup logic

Configuration is stored in `useSetupStore`.

### Test execution (`/test`)

- Questions are loaded via `useQuestions()`.
- Question card is rendered by `Question` component.
- Markdown is supported in prompts/options.
- Timer counts down if enabled.
- In practice mode, immediate answer feedback is shown.

### History (`/history`)

- Attempt summaries are saved in `useHistoryStore`.
- Store uses Zustand `persist` middleware.
- Metrics include score, correct answers, mode, timer, and area.

## Folder Structure

```text
.
|-- package.json
|-- main/
|   |-- main.js
|   |-- preload.js
|   |-- db/
|   |   |-- index.js
|   |   \-- models/
|   |       \-- LicenseActivation.js
|   |-- ipc/
|   |   |-- index.js
|   |   |-- handlers/
|   |   |   \-- licenseActivation.handler.js
|   |   \-- utils/
|   |       |-- ipcResponse.js
|   |       \-- signature.js
|   |-- services/
|   |   |-- licenseActivation.services.js
|   |   \-- remoteLicense.services.js
|   \-- supabase/
|       \-- client.js
\-- renderer/
    |-- package.json
    |-- vite.config.ts
    |-- src/
    |   |-- App.tsx
    |   |-- main.tsx
    |   |-- vite-env.d.ts
    |   |-- routes/routes.tsx
    |   |-- pages/
    |   \-- features/
    |       |-- auth/
    |       \-- EGEL/
    \-- public/
```

## Data Model

### Local table: `license_activations`

Defined in `main/db/models/LicenseActivation.js`.

Fields:

- `id` (INTEGER, PK, autoincrement)
- `productKey` (STRING, unique, not null)
- `machineId` (STRING, not null)
- `careerId` (STRING, nullable)
- `activatedAt` (DATE, default now)
- `signature` (TEXT, nullable)

Storage location:

- During Electron runtime: `app.getPath('userData')/data.sqlite`
- Outside Electron context: fallback to `main/db/data.sqlite`

## IPC Contract

All channels return normalized envelopes from `ipcResponse.js`:

- success: `{ success: true, data }`
- error: `{ success: false, error: { code, message } }`

### Channels currently registered

CRUD-like:

- `licenseActivation:findAll`
- `licenseActivation:create`
- `licenseActivation:update`
- `licenseActivation:delete`
- `licenseActivation:findById`
- `licenseActivation:findByProductKey`
- `licenseActivation:findFirst`
- `licenseActivation:deleteAll`

Business flows:

- `licenseActivation:verifyAndActivateKey`
- `licenseActivation:verifyLocalActivation`

### Exposed preload API (`window.api`)

The renderer currently consumes:

- `licenseActivation.findByProductKey(productKey)`
- `licenseActivation.verifyLocalActivation()`
- `licenseActivation.verifyAndActivateKey(productKey)`

## Environment Variables

Create a `.env` file in repository root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SIGNATURE_SECRET=replace_with_a_long_random_secret
```

Variable usage:

- `SUPABASE_URL`: Supabase project endpoint
- `SUPABASE_ANON_KEY`: key used by main process Supabase client
- `SIGNATURE_SECRET`: cryptographic key for activation signatures

## Setup and Development

### Requirements

- Node.js 18+
- npm 9+

### Install dependencies

```bash
npm run install:all
```

This installs root dependencies and renderer dependencies.

### Run in development mode

```bash
npm run dev
```

Processes started:

- `dev:renderer`: Vite dev server
- `dev:main`: Electron app

## Build and Packaging

### Build renderer only

```bash
npm run build:renderer
```

### Package Electron app only

```bash
npm run build:main
```

### Full build pipeline

```bash
npm run build
```

Pipeline behavior:

1. Build renderer static bundle.
2. Run `electron-builder`.

## Troubleshooting

### App starts but license validation always fails

- Check `.env` values (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SIGNATURE_SECRET`).
- Confirm remote `licenses` table uses the expected columns (`product_key`, `status`, `machineId`, `activated_at`).

### Immediate crash in main process on startup

- Ensure `SIGNATURE_SECRET` is defined.
- `main/ipc/utils/signature.js` throws if secret is missing.

### Renderer opens but shows blank/invalid route behavior

- Verify HashRouter route paths in `renderer/src/routes/routes.tsx`.
- Verify first load redirects from `AuthLoader` based on `useLicenseStore` state.

## Security Notes

- Renderer isolation is enabled (`contextIsolation: true`).
- Node integration in renderer is disabled (`nodeIntegration: false`).
- Preload restricts renderer access to a minimal IPC API.
- Local activation integrity uses HMAC signatures.

Important caveat:

- The project currently uses Supabase anon key on client side of the main process. For stronger protection, move license validation/binding behind a secure server function with stricter policies.

## Known Limitations

- Question bank is currently hardcoded (`renderer/src/features/EGEL/services/questions.ts`).
- Test score logic in `TestPage` is still simplified (fixed 70% strategy) instead of deriving from actual selected answers.
- `ProtectedRoute` exists but is not consistently applied to all sensitive routes in the route table.

## Suggested Next Improvements

1. Enforce `ProtectedRoute` on `/home`, `/setup`, `/test`, and `/history`.
2. Compute score from real answer evaluation using `correctAnswerIndex`.
3. Move question bank to local DB or remote content service.
4. Add automated tests for IPC handlers and state stores.
5. Add telemetry/logging abstraction for production diagnostics.
