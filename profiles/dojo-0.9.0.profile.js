dependencies = {
	layers: [
		{
			name: "../../../../drupal/dojo-module-main.js",
			resourceName: "drupal.dojo-module-main",
			dependencies: [
				"drupal.dojo-module-main"
			]
		},
		{
			name: "../../../../drupal/dojo-module-admin.js",
			resourceName: "drupal.dojo-module-admin",
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
