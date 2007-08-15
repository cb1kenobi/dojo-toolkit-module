if(!dojo._hasResource["drupal.form.SvnTree"]){
dojo._hasResource["drupal.form.SvnTree"] = true;
dojo.provide("drupal.form.SvnTree");

dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.Tree");
dojo.require("dijit.Tooltip");

/*dojo.require("dojo.event.*");
dojo.require("dojo.html.style");
dojo.require("dojo.string.extras");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.Tooltip");
dojo.require("dojo.widget.TreeV3");
dojo.require("dojo.widget.TreeNodeV3");
dojo.require("dojo.widget.TreeLoadingControllerV3");
dojo.require("dojo.widget.TreeDocIconExtension");
dojo.require("dojo.widget.TreeSelectorV3");
dojo.require("dojo.widget.TreeEmphasizeOnSelect");*/

dojo.declare(
	"drupal.form.SvnTree",
	dijit._Widget,
	{
		_tree: null,

		postCreate: function() {
			/*
			var controller = dojo.widget.createWidget("TreeLoadingControllerV3", { RpcUrl: "/dojo/svn" });
			var docIcons = dojo.widget.createWidget("TreeDocIconExtension");
			var selector = dojo.widget.createWidget("TreeSelectorV3");
			var emphasize = dojo.widget.createWidget("TreeEmphasizeOnSelect", { selector: selector.widgetId });

			dojo.event.connect("around", controller, "loadProcessResponse", this, "_onExpandResponse");
			dojo.event.topic.subscribe(selector.eventNames.select, this, "_onNodeSelect");
			*/

			var d = document.createElement("div");
			dojo.place(d, this.domNode, "after");

			/*
			[
				{ "type": "dir", "name": "branches", "revision": "9790", "author": "jaredj", "date": "July 25, 2007, 9:57 am" },
				{ "type": "dir", "name": "dijit", "revision": "9976", "author": "dante", "date": "August 6, 2007, 8:14 am" },
				{ "type": "dir", "name": "dojo", "revision": "9975", "author": "alex", "date": "August 6, 2007, 7:40 am" },
				{ "type": "dir", "name": "dojox", "revision": "9977", "author": "jaredj", "date": "August 6, 2007, 8:34 am" },
				{ "type": "dir", "name": "packages", "revision": "7557", "author": "dmachi", "date": "March 8, 2007, 4:31 pm" },
				{ "type": "dir", "name": "tags", "revision": "9464", "author": "jburke", "date": "July 3, 2007, 7:42 pm" },
				{ "type": "dir", "name": "trunk", "revision": "8887", "author": "alex", "date": "June 3, 2007, 3:37 pm" },
				{ "type": "dir", "name": "util", "revision": "9975", "author": "alex", "date": "August 6, 2007, 7:40 am" },
				{ "type": "dir", "name": "view", "revision": "7633", "author": "alex", "date": "March 17, 2007, 11:38 pm" }
			]
			*/

			var store = new dojo.data.ItemFileReadStore({data: { items: this.data } });
			this._tree = new dijit.Tree({store: store}, d); // { listeners: [controller.widgetId, docIcons.widgetId, selector.widgetId] });

			/*
			dojo.html.insertAfter(this._tree.domNode, this.domNode);
			dojo.html.addClass(this._tree.domNode, "DojoSvnTree");

			dojo.event.topic.subscribe(this._tree.eventNames.afterAddChild, this, "_onAddNode");
			this._tree.setChildren(this._buildNodes(this.data));
			*/
		},

 		/*
		_buildNodes: function(data, parentObjectId) {
			if (!parentObjectId) {
				parentObjectId = "";
			}
			var nodes = [];
			for (var i = 0; i < data.length; i++) {
				if (data[i].type == "dir") {
					nodes.push({
						title: data[i].name,
						isFolder: true,
						objectId: parentObjectId + "/" + data[i].name,
						revision: data[i].revision,
						author: data[i].author,
						date: data[i].date
					});
				}
			}
			return nodes;
		},

		_onExpandResponse: function(invocation) {
			invocation.args[1] = this._buildNodes(invocation.args[1], invocation.args[0].objectId);
			invocation.proceed();
		},
		*/

		_onNodeSelect: function(msg) {
			this.domNode.value = msg.node.objectId;
		},

		_onAddNode: function(msg) {
			var node = msg.child;

			var str = "<div><strong>" + node.objectId + "</strong></div>";
			str += "<div>Revision: " + node.revision + "</div>";
			str += "<div>Author: " + node.author + "</div>";
			str += "<div>Date: " + node.date + "</div>";

			var id = "TreeNode" + Math.round(Math.random()*10000000);
			node.domNode.id = id;

			var d = document.createElement("div");
			d.innerHTML = str;
			dojo.style(d, 'display', 'none');
			dojo.place(d, this.domNode, "after");
			var t = new dijit.Tooltip({ connectId: id }, d);
		}
	}
);

}