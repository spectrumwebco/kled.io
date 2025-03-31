import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import path from 'path';
// import tailwindcssPlugin from 'rsbuild-plugin-tailwindcss';

const pluginLynx = (options: { platforms: string[], configPath: string }) => {
  return {
    name: 'lynx-plugin',
    setup(api: any) {
      api.modifyRspackConfig((config: any) => {
        console.log(`Configuring Lynx for platforms: ${options.platforms.join(', ')}`);
        console.log(`Using Lynx config from: ${options.configPath}`);
        return config;
      });
    }
  };
};

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginNodePolyfill(),
    pluginLynx({
      platforms: ['web', 'ios', 'android'],
      configPath: './lynx.config.js'
    }),
    // Skip Tailwind plugin for now to get the app running
    // Will re-enable once we figure out the correct import
  ],
  source: {
    entry: {
      index: './src/main.tsx'
    }
  },
  server: {
    port: 1420 // Same port that Tauri expects by default
  },
  html: {
    title: 'Kled.io - Development Environment Manager'
  },
  tools: {
    rspack: {
      resolve: {
        alias: {
          '@emotion/is-prop-valid': path.resolve(__dirname, './src/shims/emotion-is-prop-valid-shim.js')
        }
      }
    }
  },

});
