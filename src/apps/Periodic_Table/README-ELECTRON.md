Building a Windows executable (EXE) for this Vite + React app

This project has been scaffolded with a minimal Electron main process and an electron-builder config so you can produce a Windows .exe.

Prerequisites (Windows):
- Node.js (16+/18+ recommended)
- npm available in PATH
- Optional: for smaller bundles, consider Tauri (requires Rust toolchain)

Quick build steps (PowerShell):

1. Install dependencies
   npm install

2. Run the app in development (hot reload via Vite + Electron):
   # In one terminal run the Vite dev server
   npm run dev
   # In another terminal run Electron in dev mode
   npm run electron:dev

3. Create a production EXE (this runs 'vite build' then electron-builder):
   npm run electron:build

Notes & caveats:
- The first time you run electron-builder it will download some build tools and may take a few minutes.
- electron-builder produces an installer (NSIS) and an unpacked application directory in the 'dist' output. The installer will be in the 'dist' folder.
- The current icon is a placeholder at `src-electron/icon.ico`. Replace it with a proper ICO file before building a release.
- If you'd prefer a smaller native binary with tighter security, consider Tauri (requires installing Rust + cargo). I can add a Tauri scaffold if you want.

If you want me to proceed with the build here, tell me and I'll attempt to run the build (may be slow and require network).
