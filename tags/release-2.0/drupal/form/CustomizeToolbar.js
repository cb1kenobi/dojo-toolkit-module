dojo.provide("drupal.form.CustomizeToolbar");
dojo.require("drupal.DojoModuleAdminDeps");

dojo.declare(
	"drupal.form.CustomizeToolbar",
	[dijit.form._FormWidget, dijit._Templated],
	{
		templatePath: dojo.moduleUrl("drupal.form", "templates/CustomizeToolbar.html"),

		// attach points
		_inputField: null,
		_availableList: null,
		_selectedList: null,
		_addButton: null,
		_removeButton: null,
		_moveUpButton: null,
		_moveDownButton: null,

		// params
		toolbarPlugins: [],
		defaultPlugins: [],

		// members
		_selectedItem: null,

		postCreate: function() {
			var n = this.srcNodeRef;
			this._inputField.id = n.id;
			this._inputField.name = n.name;
			this._inputField.value = n.value;

			this._disableButtons();
			this._populateLists();
		},

		_populateLists: function() {
			// populate the available items list
			var selectedItems = new dojox.collections.ArrayList(this._inputField.value.split(','));

			dojo.query("li", this._availableList).forEach(function(n) { dojo._destroyElement(n); });
			dojo.query("li", this._selectedList).forEach(function(n) { dojo._destroyElement(n); });

			for (var i = 0; i < this.toolbarPlugins.length; i++) {
				if (i == 0 || !selectedItems.contains(i)) {
					this._availableList.appendChild(this._createListItem(i));
				}
			}

			// populate the selected items list
			for (var i = 0; i < selectedItems.count; i++) {
				this._selectedList.appendChild(this._createListItem(selectedItems.item(i)));
			}
		},

		_createListItem: function(idx) {
			var button = this.toolbarPlugins[idx];

			var icon = document.createElement("span");
			icon.className = (button.label || button.stylelist ? '' : "dijitEditorIcon") + (button["class"] ? ' ' + button["class"] : '');
			if (button.style) {
				icon.cssText = button.style;
			}
			icon.innerHTML = button.label ? button.label : "&nbsp;";

			var label = document.createElement("span");
			label.innerHTML = button.description;

			var li = document.createElement("li");
			li.idx = idx;
			li.style.clear = "both";
			li.appendChild(icon);
			li.appendChild(label);
			dojo.connect(li, "onmousedown", this, "_onClick");

			return li;
		},

		_disableButtons: function() {
			this._addButton.disabled = true;
			this._removeButton.disabled = true;
			this._moveUpButton.disabled = true;
			this._moveDownButton.disabled = true;
		},

		_enableButtons: function(isSelectedList) {
			this._addButton.disabled = isSelectedList;
			this._removeButton.disabled = !isSelectedList;
			this._moveUpButton.disabled = !isSelectedList;
			this._moveDownButton.disabled = !isSelectedList;
		},

		_restoreDefaults: function() {
			this._inputField.value = this.defaultPlugins;
			this._populateLists();
		},

		_onClick: function(evt) {
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
			li.className = "selected";
			this._enableButtons(li.parentNode == this._selectedList);
		},

		_scrollToBottom: function(node) {
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
					dojo.connect(cloned, "onmousedown", this, "_onClick");

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
					dojo._destroyElement(this._selectedItem);
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
				var prev = this._selectedItem;
				do {
					prev = prev.previousSibling;
				} while (prev && prev.nodeType != 1);
				if (prev) {
					dojo.place(this._selectedItem, prev, "before");
					this._serializeSelected();
				}
			}
		},

		_moveItemDown: function() {
			if (this._selectedItem) {
				var next = this._selectedItem;
				do {
					next = next.nextSibling;
				} while (next && next.nodeType != 1);
				if (next) {
					dojo.place(this._selectedItem, next, "after");
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