import InterfaceComponent from './interface.vue';

export default {
    id: 'scaleflex-dam',
    name: 'Scaleflex DAM',
    icon: 'image',
    description: '',
    component: InterfaceComponent,
    options: [
		{
			field: 'custom',
			type: 'boolean',
			name: 'Use custom setting',
			schema: {
				default_value: false,
			},
			meta: {
				interface: 'toggle',
				width: 'half',
			},
		},
		{
			field: 'limit',
			type: 'integer',
			name: 'Limit',
			schema: {
				default_value: 0,
			},
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					min: 0
				}
			},
		},
		{
			field: 'limitTypes',
			type: 'string',
			name: 'Limit Types',
			meta: {
				interface: 'select-multiple-dropdown',
				options: {
					choices: [
						{
							text: 'Image',
							value: 'image',
						},
						{
							text: 'Document',
							value: 'document',
						},
						{
							text: 'Video',
							value: 'video',
						},
						{
							text: 'Audio',
							value: 'audio',
						},
					],
				},
				width: 'half',
			},
		},
		{
			field: 'attributes',
			type: 'string',
			name: 'Attributes',
			meta: {
				interface: 'select-multiple-dropdown',
				options: {
					choices: [
						{
							text: 'Meta',
							value: 'meta',
						},
						{
							text: 'Tags',
							value: 'tags',
						},
						{
							text: 'Info',
							value: 'info',
						},
					],
				},
				width: 'half',
			},
		},
	],
    types: ['json'],
};
