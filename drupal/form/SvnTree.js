dojo.provide("drupal.form.SvnTree");

dojo.require("drupal.data.SvnStore");
dojo.require("dijit.Tree");
dojo.require("dijit.Tooltip");

dojo.declare(
	"drupal.form.SvnTree",
	dijit._Widget,
	{
		_tree: null,

		postCreate: function() {
			var self = this;
			var opened = "dojoSvnTreeFolderOpened";
			var closed = "dojoSvnTreeFolderClosed";

			var d = document.createElement("div");
			dojo.place(d, this.domNode, "after");

			this._tree = new dijit.Tree({
				query: { type: "dir" },
				labelAttr: "name",
				typeAttr: "type",
				store: new drupal.data.SvnStore({ url: "/dojo/svn" }),
				getIconClass: function() { return closed; }
			}, d);

			dojo.connect(this._tree, "addChild", this, "_createToolTip");

			dojo.subscribe(this._tree.id, null, function(e) {
				var n = e.node;
				if (/^toggleOpen$|^zoomIn$|^zoomOut$/i.test(e.event)) {
					var b = (n.isExpanded || /loading/i.test(n.state));
					dojo.removeClass(n.iconNode, b ? closed : opened);
					dojo.addClass(n.iconNode, b ? opened : closed);
				} else if (e.event == "execute") {
					self.domNode.value = n.item.id;
				}
			});

			dojo.addClass(this._tree.domNode, "dojoSvnTree");
		},

		_createToolTip: function(node) {
			var d = document.createElement("div");
			d.innerHTML = "<div><strong>" + node.label + "</strong></div><div>Revision: " + node.item.revision + "</div><div>Author: " + node.item.author + "</div><div>Date: " + node.item.date + "</div>";
			dojo.style(d, 'display', 'none');
			dojo.place(d, self.domNode, "after");
			node.labelNode.id = "node" + Math.round(Math.random() * 10000000);
			var t = new dijit.Tooltip({ connectId: node.labelNode.id }, d);
			dojo.connect(node, "addChild", this, "_createToolTip");
		}
	}
);