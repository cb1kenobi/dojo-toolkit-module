if(!dojo._hasResource["drupal.form.SvnTree"]){
dojo._hasResource["drupal.form.SvnTree"] = true;
dojo.provide("drupal.form.SvnTree");

dojo.require("dojox.data.demos.stores.LazyLoadJSIStore");
//dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dijit.Tree");
dojo.require("dijit.Tooltip");

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

			this._tree = new dijit.Tree({
				query: { type: "dir" },
				labelAttr: "name",
				typeAttr: "type",
				store: new dojox.data.demos.stores.LazyLoadJSIStore({ url: "/dojo/svn" })
			}, d);

			// { listeners: [controller.widgetId, docIcons.widgetId, selector.widgetId] });

			dojo.addClass(this._tree.domNode, "dojoSvnTree");
			/*
			dojo.event.topic.subscribe(this._tree.eventNames.afterAddChild, this, "_onAddNode");
			*/
			//this._tree.setChildren(this._buildNodes(this.data));
		},

/*
		_buildNodes: function(data, parentObjectId) {
			if (!parentObjectId) {
				parentObjectId = "";
			}
			var nodes = [];
			for (var i = 0; i < data.length; i++) {
				nodes.push({
					item: {
						label: data[i].name,
						isFolder: true,
						objectId: parentObjectId + "/" + data[i].name,
						revision: data[i].revision,
						author: data[i].author,
						date: data[i].date
					}
				});
			}
			return nodes;
		},
*/
 		/*
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