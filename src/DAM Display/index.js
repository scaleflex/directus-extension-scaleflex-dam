import DisplayComponent from './display.vue';

export default {
	id: 'scaleflex-dam-display',
	name: 'Display Images',
	icon: 'image',
	description: 'Display The Current Images',
	component: DisplayComponent,
	options: [
		{
			field: 'show_images',
			type: 'boolean',
			name: 'Show Images as well',
			meta: {
				interface: 'boolean',
				options: {
					label: 'Yes',
				},
				width: 'half',
			},
		},
	],
	types: ['json'],
};
