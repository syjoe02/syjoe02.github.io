import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	blog: defineCollection({
		loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
		schema: z.object({
			title: z.string(),
			description: z.string().default(''),
			tags: z.array(z.string()).default([]),
			publishedAt: z.coerce.date(),
			draft: z.boolean().default(false),
		}),
	}),
};
