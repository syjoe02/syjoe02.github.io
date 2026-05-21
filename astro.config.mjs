// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import { visit } from 'unist-util-visit';

const isDev = process.env.NODE_ENV !== 'production';

// Converts ```mermaid code blocks to raw HTML before Shiki syntax-highlights them.
function remarkMermaid() {
	return (/** @type {import('mdast').Root} */ tree) => {
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang !== 'mermaid' || !parent || index == null) return;
			parent.children[index] = {
				type: 'html',
				value: `<div class="mermaid">${node.value}</div>`,
			};
		});
	};
}

export default defineConfig({
	site: 'https://syjoe02.github.io',
	integrations: [
		...(isDev ? [keystatic()] : []),
		sitemap(),
	],
	markdown: {
		remarkPlugins: [remarkMermaid],
	},
});
