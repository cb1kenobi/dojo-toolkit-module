dojo.hostenv.packageLoaded({depends:[["provide", "drupal.widget.CustomizeToolbar"], ["require", "dojo.collections.ArrayList"], ["require", "dojo.event.*"], ["require", "dojo.html.common"], ["require", "dojo.widget.*"], ["require", "dojo.widget.HtmlWidget"]], definePackage:function (dojo) {

dojo.provide("drupal.widget.CustomizeToolbar");

dojo.require("dojo.collections.ArrayList");
dojo.require("dojo.event.*");
dojo.require("dojo.html.common");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");

dojo.widget.defineWidget(
	"drupal.widget.CustomizeToolbar",
	dojo.widget.HtmlWidget,
	{
		isContainer: false,
		widgetType: "CustomizeToolbar",

		templatePath: dojo.uri.moduleUri("drupal.widget", "templates/CustomizeToolbar.html"),
		templateCssPath: dojo.uri.moduleUri("drupal.widget", "templates/EditorToolbar.css"),

		// attach points
		_inputField: null,
		_availableList: null,
		_selectedList: null,
		_addButton: null,
		_removeButton: null,
		_moveUpButton: null,
		_moveDownButton: null,

		// params
		toolbarButtons: [],

		// members
		_selectedItem: null,

		postCreate: function(/*object*/frag) {
			var node = this.getFragNodeRef(frag);
			this._inputField.id = node.id;
			this._inputField.name = node.name;
			this._inputField.value = node.value;

			this._disableButtons();

			// populate the available items list
			var selectedItems = new dojo.collections.ArrayList(node.value.split(','));
			for (var i = 0; i < this.toolbarButtons.length; i++) {
				if (i == 0 || !selectedItems.contains(i)) {
					this._availableList.appendChild(this._createListItem(i));
				}
			}

			// populate the selected items list
			for (var i = 0; i < selectedItems.count; i++) {
				this._selectedList.appendChild(this._createListItem(selectedItems.item(i)));
			}

			dojo.event.connect(this._addButton, "onclick", this, "_addItem");
			dojo.event.connect(this._removeButton, "onclick", this, "_removeItem");
			dojo.event.connect(this._moveUpButton, "onclick", this, "_moveItemUp");
			dojo.event.connect(this._moveDownButton, "onclick", this, "_moveItemDown");
		},

		_createListItem: function(/*int*/idx) {
			var button = this.toolbarButtons[idx];

			var icon = document.createElement("span");
			icon.className = (button.label ? '' : "dojoE2TBIcon") + (button["class"] ? ' ' + button["class"] : '');
			if (button.style) {
				icon.cssText = button.style;
			}
			icon.innerHTML = button.label ? button.label : "&nbsp;";

			var iconOuter = document.createElement("span");
			iconOuter.className = "iconContainer dojoEditorToolbarItem";
			iconOuter.appendChild(icon);

			var label = document.createElement("span");
			label.innerHTML = button.description;

			var li = document.createElement("li");
			li.idx = idx;
			li.appendChild(iconOuter);
			li.appendChild(label);
			dojo.event.connect(li, "onmousedown", this, "_onClick");

			return li;
		},

		_disableButtons: function() {
			this._addButton.disabled = true;
			this._removeButton.disabled = true;
			this._moveUpButton.disabled = true;
			this._moveDownButton.disabled = true;
		},

		_enableButtons: function(/*bool*/isSelectedList) {
			this._addButton.disabled = isSelectedList;
			this._removeButton.disabled = !isSelectedList;
			this._moveUpButton.disabled = !isSelectedList;
			this._moveDownButton.disabled = !isSelectedList;
		},

		_onClick: function(/*object*/evt) {
			var li = evt.target;
			while (li && li.parentNode && li.tagName.toLowerCase() != "li") {
				li = li.parentNode;
			}
			if (!li) {
				return;
			}

			if (this._selectedItem) {
				this._selectedItem.className = "";
				this._selectedItem = null;
				this._disableButtons();
			}

			this._selectedItem = li;
			li.className = "Selected";
			this._enableButtons(li.parentNode == this._selectedList);
		},

		_scrollToBottom: function(/*object*/node) {
			while (node && node.parentNode && node.tagName.toLowerCase() != "div") {
				node = node.parentNode;
			}
			if (node) {
				node.scrollTop = 999;
			}
		},

		_addItem: function() {
			if (this._selectedItem) {
				if (this._selectedItem.idx == 0) {
					var cloned = this._selectedItem.cloneNode(true);
					cloned.idx = 0;
					dojo.event.connect(cloned, "onmousedown", this, "_onClick");

					this._selectedItem.className = "";
					this._selectedItem = cloned;
					this._selectedList.appendChild(cloned);
				} else {
					this._selectedList.appendChild(this._selectedItem);
				}
				this._scrollToBottom(this._selectedList);
				this._enableButtons(true);
			}
			this._serializeSelected();
		},

		_removeItem: function() {
			if (this._selectedItem) {
				if (this._selectedItem.idx == 0) {
					dojo.dom.destroyNode(this._selectedItem);
					this._selectedItem = null;
					this._disableButtons();
				} else {
					this._availableList.appendChild(this._selectedItem);
					this._scrollToBottom(this._availableList);
					this._enableButtons(false);
				}
			}
			this._serializeSelected();
		},

		_moveItemUp: function() {
			if (this._selectedItem) {
				var prev = dojo.dom.prevElement(this._selectedItem);
				if (prev) {
					dojo.dom.insertBefore(this._selectedItem, prev);
					this._serializeSelected();
				}
			}
		},

		_moveItemDown: function() {
			if (this._selectedItem) {
				var next = dojo.dom.nextElement(this._selectedItem);
				if (next) {
					dojo.dom.insertAfter(this._selectedItem, next);
					this._serializeSelected();
				}
			}
		},

		_serializeSelected: function() {
			var items = [];
			var lis = this._selectedList.getElementsByTagName("li");

			for (var i = 0; i < lis.length; i++) {
				items.push(lis[i].idx);
			}

			this._inputField.value = items.join(',');
		}
	}
);

}});
