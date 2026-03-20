import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fundi.app',
  appName: 'Fundi',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
