# EGEL Simulator

Aplicacion de escritorio para simular examenes tipo EGEL con control de acceso por licencia.
El proyecto esta dividido en dos capas principales:

- `main/`: proceso principal de Electron (Node.js, SQLite, IPC, validacion de licencia)
- `renderer/`: interfaz React + Vite (autenticacion, configuracion de simulacro, resolucion de preguntas, historial)

## Contenido

- [Vision general](#vision-general)
- [Arquitectura](#arquitectura)
- [Tecnologias](#tecnologias)
- [Funciones principales](#funciones-principales)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Flujo de licencia](#flujo-de-licencia)
- [Flujo funcional del simulador](#flujo-funcional-del-simulador)
- [Configuracion de entorno](#configuracion-de-entorno)
- [Instalacion y ejecucion](#instalacion-y-ejecucion)
- [Build y distribucion](#build-y-distribucion)
- [Canales IPC expuestos](#canales-ipc-expuestos)
- [Notas y consideraciones](#notas-y-consideraciones)

## Vision general

La app corre como Electron App y usa un frontend React embebido.

1. El usuario abre la aplicacion.
2. El renderer valida si existe una activacion local valida.
3. Si no existe, solicita una clave de producto.
4. El proceso principal valida la clave contra Supabase, la asocia al equipo y guarda activacion local firmada.
5. Con licencia valida, el usuario puede configurar y ejecutar simulacros, y revisar historial.

## Arquitectura

### 1) Proceso principal (`main/`)

Responsabilidades:

- Crear ventana Electron (`main/main.js`)
- Inicializar base local SQLite con Sequelize (`main/db/index.js`)
- Registrar canales IPC (`main/ipc/index.js`)
- Validar/activar licencias (servicios local + remoto)
- Firmar y verificar payload de activacion (HMAC)

Puntos clave:

- Seguridad Electron: `contextIsolation: true`, `nodeIntegration: false`
- Bridge seguro via preload (`main/preload.js`) usando `contextBridge`
- Persistencia local de activacion en `license_activations`

### 2) Preload (`main/preload.js`)

Expone en `window.api` un contrato minimo para el renderer:

- `licenseActivation.findByProductKey(productKey)`
- `licenseActivation.verifyLocalActivation()`
- `licenseActivation.verifyAndActivateKey(productKey)`

El renderer no accede directamente a Node ni a `ipcRenderer`.

### 3) Renderer (`renderer/`)

Responsabilidades:

- Routing y control de acceso por licencia
- Pantallas de autenticacion y flujo de simulacro
- Estado global con Zustand
- Presentacion de preguntas con soporte Markdown (`react-markdown`)

Rutas principales:

- `/` -> `AuthLoader` (redirige segun estado de licencia)
- `/auth` -> captura y validacion de product key
- `/home` -> dashboard principal
- `/setup` -> configuracion de simulacro
- `/test` -> ejecucion de examen
- `/history` -> historial persistente

## Tecnologias

### Core

- Electron 27
- Node.js (CommonJS en proceso principal)
- React 19
- TypeScript (renderer)
- Vite 7

### Estado y routing

- Zustand (estado local y persistencia)
- React Router DOM

### Datos y backend remoto

- SQLite (archivo local)
- Sequelize
- Supabase JS Client

### UI

- Tailwind CSS v4
- Lucide React
- React Markdown

### Build

- electron-builder
- concurrently (dev main + renderer)

## Funciones principales

- Activacion de licencia por clave UUID.
- Verificacion local de licencia en cada arranque.
- Firma HMAC del payload local para detectar alteraciones.
- Binding de licencia a `machineId` del equipo.
- Configuracion de simulacro (area, cronometro, modo practica).
- Render de preguntas y opciones con Markdown.
- Historial de resultados persistente en frontend.

## Estructura del proyecto

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
    |-- src/
    |   |-- App.tsx
    |   |-- main.tsx
    |   |-- routes/routes.tsx
    |   |-- pages/
    |   \-- features/
    |       |-- auth/
    |       \-- EGEL/
    \-- ...
```

## Flujo de licencia

### Activacion remota + persistencia local

1. El usuario ingresa `productKey` en `/auth`.
2. Renderer llama `window.api.licenseActivation.verifyAndActivateKey(productKey)`.
3. En main:
   - obtiene `machineId` local
   - busca licencia en Supabase (`licenses`)
   - valida estado (`active`)
   - valida si ya esta asociada a otro equipo
   - intenta bind remoto (`update machineId, activated_at`)
   - guarda activacion local con firma HMAC
4. Devuelve respuesta estandar IPC (`successResponse` o `errorResponse`).

### Validacion local en arranque

1. `useLicenseStore.refresh()` ejecuta `verifyLocalKey()`.
2. `verifyLocalKey()` llama `verifyLocalActivation()` por IPC.
3. Main recupera la licencia local y verifica la firma.
4. Si la firma no coincide, elimina el registro local y retorna error.
5. `AuthLoader` redirige a `/home` o `/auth`.

## Flujo funcional del simulador

1. En `/setup`, usuario define:
   - area (`disciplinar`, `transversal`, `ambas`)
   - cronometro on/off
   - modo practica on/off
2. Config se guarda en Zustand (`useSetupStore`).
3. En `/test`, `useQuestions` obtiene preguntas segun area.
4. Se administra avance de preguntas, seleccion de respuesta y timer.
5. Al finalizar se calcula score y se registra en `useHistoryStore`.
6. `/history` muestra resultados acumulados.

## Configuracion de entorno

Crear archivo `.env` en la raiz con:

```env
SUPABASE_URL=tu_url_supabase
SUPABASE_ANON_KEY=tu_anon_key
SIGNATURE_SECRET=un_secreto_largo_y_unico
```

Variables usadas:

- `SUPABASE_URL`: endpoint de proyecto Supabase
- `SUPABASE_ANON_KEY`: key de acceso usada por el cliente remoto
- `SIGNATURE_SECRET`: secreto para HMAC de activaciones locales

## Instalacion y ejecucion

### Requisitos

- Node.js 18+
- npm 9+

### Instalar dependencias

```bash
npm run install:all
```

### Modo desarrollo

```bash
npm run dev
```

Esto levanta en paralelo:

- renderer Vite en `http://localhost:5173`
- proceso Electron apuntando al renderer en desarrollo

## Build y distribucion

### Build completo

```bash
npm run build
```

### Build solo renderer

```bash
npm run build:renderer
```

### Build paquete Electron

```bash
npm run build:main
```

## Canales IPC expuestos

Definidos principalmente en `main/ipc/handlers/licenseActivation.handler.js`.

Canales CRUD/local:

- `licenseActivation:findAll`
- `licenseActivation:create`
- `licenseActivation:update`
- `licenseActivation:delete`
- `licenseActivation:findById`
- `licenseActivation:findByProductKey`
- `licenseActivation:findFirst`
- `licenseActivation:deleteAll`

Canales de negocio:

- `licenseActivation:verifyAndActivateKey`
- `licenseActivation:verifyLocalActivation`

Formato de respuesta:

- exito: `{ success: true, data }`
- error: `{ success: false, error: { code, message } }`

## Notas y consideraciones

- La base SQLite se guarda en `app.getPath('userData')` cuando corre en Electron.
- La activacion local usa `productKey` unico en DB.
- El historial de simulacros se persiste en storage del renderer (Zustand persist).
- Actualmente las preguntas provienen de un arreglo local (`renderer/src/features/EGEL/services/questions.ts`).
- El score en `TestPage` se calcula de forma simplificada (base 70%) y puede evolucionar a un calculo real por `correctAnswerIndex`.

---

Si vas a extender el proyecto, una evolucion natural es mover banco de preguntas e historial a una capa de datos formal (local o remota) y reforzar el control de rutas con `ProtectedRoute` en las rutas sensibles (`/home`, `/setup`, `/test`, `/history`).
