/// <reference types="vite/client" />

interface ElectronAPI {
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
}

interface Window {
  electron: ElectronAPI;
}
