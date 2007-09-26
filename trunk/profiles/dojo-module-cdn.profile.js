dependencies = {
	layers: [
		{
			name: "temp.layer",
			resourceName: "temp.layer",
			discard: true,
			dependencies: [
				"drupal.DojoModuleMainDeps",
				"drupal.DojoModuleAdminDeps"
			]
		},
		{
			name: "../../DojoModuleMain.js",
			resourceName: "drupal.DojoModuleMain",
			layerDependencies: [
				"temp.layer"
			],
			dependencies: [
				"drupal.DojoModuleMain"
			]
		},
		{
			name: "../../DojoModuleAdmin.js",
			resourceName: "drupal.DojoModuleAdmin",
			layerDependencies: [
				"temp.layer"
			],
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
