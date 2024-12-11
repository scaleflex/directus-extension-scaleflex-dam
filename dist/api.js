var e0 = ({ embed }, { env }) => {
	embed(
		'body',
		'<script src="https://cdn.scaleflex.com/plugins/filerobot-widget/v3/latest/filerobot-widget.min.js"></script>'
	);
};

const hooks = [{name:'dam_hook',config:e0}];const endpoints = [];const operations = [];

export { endpoints, hooks, operations };
