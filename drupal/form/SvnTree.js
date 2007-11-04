dojo.provide("drupal.form.SvnTree");
dojo.require("drupal.data.SvnStore");
dojo.require("drupal.DojoModuleAdminDeps");

dojo.declare(
	"drupal.form.SvnTree",
	dijit._Widget,
	{
		_tree: null,

		postCreate: function() {
			var self = this;

			var d = document.createElement("div");
			dojo.place(d, this.domNode, "after");

			this._tree = new dijit.Tree({
				query: { type: "dir" },
				labelAttr: "name",
				typeAttr: "type",
				store: new drupal.data.SvnStore({ url: "/dojo/svn" }),
				persist: false,
				getIconClass: function() { return "dojoSvnTreeFolderClosed"; }
			}, d);

			this._setupNode(this._tree);
			
			dojo.addClass(this._tree.domNode, "dojoSvnTree");
		},

		_createToolTip: function(node) {
			var d = document.createElement("div");
			d.innerHTML = "<div><strong>" + node.label + "</strong></div><div>Revision: " + node.item.revision + "</div><div>Author: " + node.item.author + "</div><div>Date: " + node.item.date + "</div>";
			dojo.body().appendChild(d);		
			var t = new dijit.Tooltip({ connectId: [node.iconNode,	node.labelNode] }, d);
			this._setupNode(node);
		},

		_setupNode: function(node) {
			dojo.connect(node, "addChild", this, "_createToolTip");
			dojo.connect(node, "_setExpando", function() { node.iconNode.className = "dijitInline dijitTreeIcon dojoSvnTreeFolder" + (node.isExpanded ? "Opened" : "Closed"); });
		}
	}
);