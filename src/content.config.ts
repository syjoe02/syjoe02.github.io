import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				topic: z.enum([
					'backend',
					'async-systems',
					'distributed',
					'production',
					'ai-infra',
					'architecture',
					'debugging',
				]).optional(),
				tags: z.array(z.string()).default([]),
				difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
				draft: z.boolean().default(false),
				related: z.array(z.string()).default([]),
			}),
		}),
	}),
};
