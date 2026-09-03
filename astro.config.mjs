// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
	process.env.NODE_ENV ?? 'development',
	process.cwd(),
	'',
);

// GitHub Pages project site: https://tasnadi-dev.github.io/Luminosafilm/
const site = process.env.ASTRO_SITE;
const base = process.env.ASTRO_BASE ?? '/Luminosafilm';

// https://astro.build/config
export default defineConfig({
	...(site ? { site } : {}),
	base,
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: ['react-compiler-runtime', 'react-is'],
		},
	},
	integrations: [
		sanity({
			projectId: PUBLIC_SANITY_PROJECT_ID,
			dataset: PUBLIC_SANITY_DATASET,
			apiVersion: '2025-02-19',
			useCdn: false,
			studioBasePath: '/admin',
		}),
		react(),
	],
});
