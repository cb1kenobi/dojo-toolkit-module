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
			name: "../../drupal.js",
			resourceName: "drupal.drupal",
			layerDependencies: [
				"temp.layer"
			],
			dependencies: [
				"drupal.drupal"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "drupal", "../../drupal" ]
	]
}
