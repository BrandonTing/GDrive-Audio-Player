import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    assetPrefix: '/GDrive-Audio-Player/',
    copy: [{
      from: './404.html',
      to: '404.html',
    }],
  },
});
