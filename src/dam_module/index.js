import ModuleComponent from './module.vue';

export default {
	id: 'scaleflex-dam-setting',
	name: 'Scaleflex DAM',
	icon: 'image',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
		{
			name: 'page',
			path: ':page',
			props: true,
			component: ModuleComponent,
		},
	]
};
