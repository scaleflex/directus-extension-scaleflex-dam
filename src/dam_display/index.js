import DisplayComponent from './display.vue';

export default {
	id: 'scaleflex-dam-display',
	name: 'DAM Assets',
	icon: 'image',
	description: 'Display DAM assets with beautiful UI',
	component: DisplayComponent,
	options: [
		{
			field: 'limit',
			type: 'integer',
			name: 'Limit assets on Display',
			meta: {
				interface: 'input',
				options: {
					min: 0,
				}
			},
			schema: {
				default_value: 2,
			},
		},
	],
	types: ['json'],
};
