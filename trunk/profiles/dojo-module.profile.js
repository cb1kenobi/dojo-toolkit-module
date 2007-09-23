dependencies = {
	layers: [
		{
			name: "temp.layer",
			resourceName: "temp.layer",
			discard: true,
			dependencies: [
				"dijit._editor.plugins.AlwaysShowToolbar",
				"dijit._editor.plugins.EnterKeyHandling",
				"dijit._editor.plugins.LinkDialog",
				"dijit.Tree",
				"dojo.data.ItemFileWriteStore",
				"dojox.collections.ArrayList"
			]
		},
		{
			name: "../../../../drupal/dojo-module-main.js",
			resourceName: "drupal.dojo-module-main",
			layerDependencies: [
				"temp.layer"
			],
			dependencies: [
				"drupal.dojo-module-main"
			]
		},
		{
			name: "../../../../drupal/dojo-module-admin.js",
			resourceName: "drupal.dojo-module-admin",
			layerDependencies: [
				"temp.layer"
			],
			dependencies: [
				"drupal.dojo-module-admin"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "drupal", "../../drupal" ]
	]
}
