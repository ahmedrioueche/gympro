import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gympro.app',
  appName: 'GymPro',
  webDir: 'dist',
  server: {
    url: 'http://192.168.1.10:5173',
    cleartext: true
  }
};

export default config;
