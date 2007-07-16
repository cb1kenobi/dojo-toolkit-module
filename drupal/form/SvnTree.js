dojo.provide("drupal.widget.SvnTree");

dojo.require("dojo.event.*");
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
dojo.require("dojo.widget.TreeEmphasizeOnSelect");

dojo.widget.defineWidget(
	"drupal.widget.SvnTree",
	dojo.widget.HtmlWidget,
	{
		isContainer: true,
		widgetType: "SvnTree",

		data: [],
		_tree: null,

		postCreate: function() {
			var controller = dojo.widget.createWidget("TreeLoadingControllerV3", { RpcUrl: "/dojo/svn" });
			var docIcons = dojo.widget.createWidget("TreeDocIconExtension");
			var selector = dojo.widget.createWidget("TreeSelectorV3");
			var emphasize = dojo.widget.createWidget("TreeEmphasizeOnSelect", { selector: selector.widgetId });

			dojo.event.connect("around", controller, "loadProcessResponse", this, "_onExpandResponse");
			dojo.event.topic.subscribe(selector.eventNames.select, this, "_onNodeSelect");

			this._tree = dojo.widget.createWidget("TreeV3", { listeners: [controller.widgetId, docIcons.widgetId, selector.widgetId] });

			dojo.html.insertAfter(this._tree.domNode, this.domNode);
			dojo.html.addClass(this._tree.domNode, "DojoSvnTree");

			dojo.event.topic.subscribe(this._tree.eventNames.afterAddChild, this, "_onAddNode");
			this._tree.setChildren(this._buildNodes(this.data));
		},

		_buildNodes: function(/*array*/data, /*string*/parentObjectId) {
			if (!parentObjectId)
				parentObjectId = "";
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

		_onExpandResponse: function(/*object*/invocation) {
			invocation.args[1] = this._buildNodes(invocation.args[1], invocation.args[0].objectId);
			invocation.proceed();
		},

		_onNodeSelect: function(/*object*/message) {
			this.domNode.value = message.node.objectId;
		},

		_onAddNode: function(/*object*/message) {
			var node = message.child;

			var str = "<div><strong>" + node.objectId + "</strong></div>";
			str += "<div>Revision: " + node.revision + "</div>";
			str += "<div>Author: " + node.author + "</div>";
			str += "<div>Date: " + node.date + "</div>";

			var id = "TreeNode" + Math.round(Math.random()*10000000);
			node.domNode.id = id;

			var d = document.createElement("div");
			d.innerHTML = str;
			dojo.html.setDisplay(d, false);
			dojo.html.insertAfter(d, this.domNode);
			var tooltip = dojo.widget.createWidget("Tooltip", { connectId: id }, d);
		}
	}
);
