dependencies = {
	layers: [
		{
			name: "../drupal/DojoModuleMain.js",
			resourceName: "drupal.DojoModuleMain",
			dependencies: [
				"drupal.DojoModuleMain"
			]
		},
		{
			name: "../drupal/DojoModuleAdmin.js",
			resourceName: "drupal.DojoModuleAdmin",
			dependencies: [
				"drupal.DojoModuleAdmin"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "drupal", "../../drupal" ]
	]
}
