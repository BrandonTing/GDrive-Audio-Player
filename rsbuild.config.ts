import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3000,
    base: '/GDrive-Audio-Player',
  },
  output: {
    assetPrefix: '/GDrive-Audio-Player/',
    copy: [
      {
        from: './404.html',
        to: '404.html',
      },
    ],
  },
});
