Package.describe({
	name: "andreheber:compiler",
	summary: "TypeScript is a staticaly typed superset of JavaScript",
	git: "",
	version: "0.0.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('isobuild:compiler-plugin@1.0.0');
//  api.addFiles('plugin/compile-tsc.js', 'server');
});

Package.registerBuildPlugin({
	name: "compileTypescript",
	use: ['meteor'],
	sources: [
		'plugin/compile-tsc.js'
	],
	npmDependencies: {
		"typescript": "1.6.2",
		"node-persist": "0.0.3",
		"temp": "0.8.1",
		"glob": "4.4.0",
		"rimraf": "2.2.8",
		"typescript-compiler": "1.4.1"
	}
});
