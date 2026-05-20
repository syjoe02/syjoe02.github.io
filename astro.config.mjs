// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

// Keystatic admin UI is local-only — exclude from production builds
const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
	site: 'https://syjoe02.github.io',
	integrations: [
		starlight({
			title: 'Engineering Compendium',
			description: 'Backend systems, distributed architecture, and production engineering.',
			defaultLocale: 'root',
			locales: { root: { label: 'English', lang: 'en' } },
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/syjoe02' },
			],
			sidebar: [
				{ label: 'Backend Engineering', autogenerate: { directory: 'backend' } },
				{ label: 'Async Systems', autogenerate: { directory: 'async-systems' } },
				{ label: 'Distributed Systems', autogenerate: { directory: 'distributed' } },
				{ label: 'Production & Incidents', autogenerate: { directory: 'production' } },
				{ label: 'AI Infrastructure', autogenerate: { directory: 'ai-infra' } },
				{ label: 'Architecture Tradeoffs', autogenerate: { directory: 'architecture' } },
				{ label: 'Debugging', autogenerate: { directory: 'debugging' } },
			],
			customCss: ['./src/styles/custom.css'],
			components: {
				Head: './src/components/overrides/Head.astro',
				Header: './src/components/overrides/Header.astro',
			},
			editLink: {
				baseUrl: 'https://github.com/syjoe02/syjoe02.github.io/edit/main/',
			},
		}),
		...(isDev ? [keystatic()] : []),
		sitemap(),
	],
});
