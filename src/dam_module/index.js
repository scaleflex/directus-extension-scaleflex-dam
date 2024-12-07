import ModuleComponent from './module.vue';

export default {
	id: 'scaleflex-dam-setting',
	name: 'Scaleflex DAM Setting',
	icon: 'settings_system_daydream',
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
