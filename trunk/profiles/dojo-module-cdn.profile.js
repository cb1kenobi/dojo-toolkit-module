dependencies = {
	layers: [
		{
			name: "temp.layer",
			resourceName: "temp.layer",
			discard: true,
			dependencies: [
				"dojo.fx",
				"dojox.collections.ArrayList",
				"dijit._Widget",
				"dijit._Templated",
				"dijit.form._FormWidget",
				"dijit._editor.plugins.AlwaysShowToolbar",
				"dijit._editor.plugins.EnterKeyHandling",
				"dijit._editor.plugins.LinkDialog",
				"dijit.Dialog",
				"dijit.Tooltip",
				"dijit.Tree",
				"dojo.data.ItemFileWriteStore",
				"dojox.collections.ArrayList"
			]
		},
		{
			name: "../../../../drupal/DojoModuleMain.js",
			resourceName: "drupal.DojoModuleMain",
			layerDependencies: [
				"temp.layer"
			],
			dependencies: [
				"drupal.DojoModuleMainRequires",
				"drupal.DojoModuleMain"
			]
		},
		{
			name: "../../../../drupal/DojoModuleAdmin.js",
			resourceName: "drupal.DojoModuleAdmin",
			layerDependencies: [
				"temp.layer"
			],
			dependencies: [
				"drupal.DojoModuleAdminRequires",
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
