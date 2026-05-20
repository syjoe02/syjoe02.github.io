import { config, collection, fields } from '@keystatic/core';

export default config({
	storage: { kind: 'local' },
	collections: {
		docs: collection({
			label: 'Articles',
			slugField: 'title',
			path: 'src/content/docs/**',
			entryLayout: 'content',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				description: fields.text({ label: 'Description', multiline: false }),
				topic: fields.select({
					label: 'Topic',
					options: [
						{ label: 'Backend Engineering', value: 'backend' },
						{ label: 'Async Systems', value: 'async-systems' },
						{ label: 'Distributed Systems', value: 'distributed' },
						{ label: 'Production & Incidents', value: 'production' },
						{ label: 'AI Infrastructure', value: 'ai-infra' },
						{ label: 'Architecture Tradeoffs', value: 'architecture' },
						{ label: 'Debugging', value: 'debugging' },
					],
					defaultValue: 'backend',
				}),
				tags: fields.array(fields.text({ label: 'Tag' }), {
					label: 'Tags',
					itemLabel: (props) => props.fields.value.value ?? 'Tag',
				}),
				difficulty: fields.select({
					label: 'Difficulty',
					options: [
						{ label: 'Beginner', value: 'beginner' },
						{ label: 'Intermediate', value: 'intermediate' },
						{ label: 'Advanced', value: 'advanced' },
					],
					defaultValue: 'intermediate',
				}),
				draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
				content: fields.markdoc({ label: 'Content' }),
			},
		}),
	},
});
