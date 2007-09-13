dependencies = {
	layers: [
		{
			name: "../../dijit-main.js",
			dependencies: [
				"dojo._base",
				"dojo.Parser",
				"dijit._base",
				"dijit._Widget",
				"dijit._Templated",
				"dijit._Container",
				"dijit.layout._LayoutWidget",
				"dijit.form._FormWidget",
				"dijit.Editor",
				"dijit._editor.plugins.AlwaysShowToolbar",
				"dijit._editor.plugins.EnterKeyHandling",
				"dijit._editor.plugins.LinkDialog",
				"drupal.form.AutoComplete",
				"drupal.form.Editor",
				"drupal.layout.CollapsiblePane"
			]
		},
		{
			name: "../../dijit-admin.js",
			dependencies: [
				"dojo.data.ItemFileWriteStore",
				"dojox.collections.ArrayList",
				"dijit.Dialog",
				"dijit.Tree",
				"dijit.Tooltip",
				"drupal.PleaseWait",
				"drupal.data.SvnStore",
				"drupal.form.CustomizeToolbar",
				"drupal.form.GoogleMapKeyTable",
				"drupal.form.SvnTree"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "drupal", "../../drupal" ]
	]
}
