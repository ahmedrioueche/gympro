# GymPro Desktop Application

An Electron + React + Tailwind CSS desktop application.

## Getting Started

1. **Install dependencies:**

   ```bash
   cd desktop
   npm install
   ```

2. **Run in development mode:**

   ```bash
   npm run dev
   ```

   This will start the Vite dev server and launch the Electron app.

3. **Build for production:**

   ```bash
   # Build for all platforms
   npm run build

   # Build for specific platform
   npm run build:win   # Windows
   npm run build:mac   # macOS
   npm run build:linux # Linux
   ```

## Features

- ⚡ Fast development with Vite
- 🎨 Styled with Tailwind CSS
- 🖥️ Cross-platform desktop app with Electron
- 🔧 TypeScript support
- 📦 Easy build with electron-builder

## Project Structure

```
desktop/
├── main.js              # Electron main process
├── preload.js           # Preload script for security
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── electron-builder.yml # Electron builder configuration
└── src/
    ├── App.tsx          # Main React component
    ├── main.tsx          # React entry point
    └── index.css         # Global styles
```

## Development

- The app runs on `http://localhost:5173` in development mode
- Hot module replacement is enabled
- DevTools are automatically opened

## Building

The built application will be in the `release` folder with the appropriate installer for your platform.
