// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

const fileEnv = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

// loadEnv reads .env files only; Cloudflare Pages injects vars via process.env.
const PUBLIC_SANITY_PROJECT_ID =
	fileEnv.PUBLIC_SANITY_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID;
const PUBLIC_SANITY_DATASET =
	fileEnv.PUBLIC_SANITY_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';

if (!PUBLIC_SANITY_PROJECT_ID) {
	throw new Error(
		'Missing PUBLIC_SANITY_PROJECT_ID. Set it in .env locally or in Cloudflare Pages environment variables.',
	);
}

// Production site URL (canonical links, sitemap). Override with ASTRO_SITE if needed.
const site = process.env.ASTRO_SITE ?? 'https://www.luminosafilm.hu';

// https://astro.build/config
export default defineConfig({
	...(site ? { site } : {}),
	base: '/',
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
