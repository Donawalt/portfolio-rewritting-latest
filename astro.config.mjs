import { defineConfig } from 'astro/config';

// Add React support
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
});
