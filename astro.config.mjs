// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
	site: 'https://syjoe02.github.io',
	integrations: [
		...(isDev ? [keystatic()] : []),
		sitemap(),
	],
});
