import { config, collection, fields } from '@keystatic/core';

export default config({
	storage: { kind: 'local' },
	collections: {
		blog: collection({
			label: 'Blog Posts',
			slugField: 'title',
			path: 'src/content/blog/*',
			entryLayout: 'content',
			format: { contentField: 'content' },
			schema: {
				title: fields.slug({ name: { label: 'Title' } }),
				description: fields.text({ label: 'Description', multiline: true }),
				tags: fields.array(fields.text({ label: 'Tag' }), {
					label: 'Tags',
					itemLabel: (props) => props.fields.value.value ?? 'Tag',
				}),
				publishedAt: fields.date({
					label: 'Published At',
					defaultValue: { kind: 'today' },
				}),
				draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
				content: fields.text({ label: 'Content', multiline: true }),
			},
		}),
	},
});
