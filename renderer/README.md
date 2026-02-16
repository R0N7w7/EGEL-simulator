# Renderer (React + Vite)

This folder hosts the React renderer used by the Electron shell. See the project-level documentation in [../README.md](../README.md) for setup, environment variables, and overall architecture.

## Quick start (renderer only)

```bash
npm install
npm run dev
```

The renderer mounts under a HashRouter and communicates with the Electron main process through the `window.api` bridge exposed in `main/preload.js`.
