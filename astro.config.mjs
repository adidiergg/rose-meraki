// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Instrument Serif',
      cssVariable: '--font-instrument-serif',
      fallbacks: ['serif'],
    },
    {
      provider: fontProviders.local(),
      name: 'Darker Grotesque',
      cssVariable: '--font-body',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/DarkerGrotesque-VariableFont_wght.ttf'],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
  ],
});
