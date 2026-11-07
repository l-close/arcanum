import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.github.lclose.arcanum',
  appName: 'arcanum',
  webDir: 'dist',
  android: {
    backgroundColor: '#14161a',
    allowMixedContent: false,
  },
};

export default config;
