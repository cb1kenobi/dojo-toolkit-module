dojo._xdResourceLoaded({
depends: [["provide", "drupal.PleaseWait"],
["provide", "drupal.data.SvnStore"],
["provide", "drupal.form.AutoComplete"],
["provide", "drupal.form.CustomizeToolbar"],
["provide", "drupal.form.Editor"],
["provide", "drupal.form.GoogleMapKeyTable"],
["provide", "drupal.form.SvnTree"],
["provide", "drupal.layout.CollapsiblePane"],
["provide", "drupal.drupal"]],
defineResource: function(dojo){/*
	Copyright (c) 2004-2007, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(!dojo._hasResource["drupal.PleaseWait"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drupal.PleaseWait"] = true;
dojo.provide("drupal.PleaseWait");




dojo.declare(
	"drupal.PleaseWait",
	[dijit._Widget, dijit._Templated],
	{
		templateString: '<span id="Shib"><input dojoAttachPoint="_button" type="button" /><div dojoAttachPoint="_contents"><span class="Indicator">Please wait...</span></div></span>',

		_button: null,
		_contents: null,
		_dialog: null,
		_form: null,

		postCreate: function() {
			var n = this.domNode;
			while (n && n.parentNode && n.tagName.toLowerCase() != "form") {
				n = n.parentNode;
			}
			if (n) {
				this._form = n;
			}

			var node = this.srcNodeRef;
			this._button.id = node.id;
			this._button.name = node.name;
			this._button.value = node.value;
			this._button.className = node.className;
			dojo.connect(this._button, "onclick", this, "_showDialog");

			this._dialog = new dijit.Dialog({
				templateString: "<div class=\"dijitDialogBox\"><div dojoAttachPoint=\"containerNode\"></div></div>",
			}, this._contents);
		},

		_showDialog: function(evt) {
			dojo.stopEvent(evt);
			this._dialog.show();
			setTimeout(dojo.hitch(this, "_submitForm"), 500);
		},

		_submitForm: function() {
			if (this._form) {
				this._form.submit();
			}
		}
	}
);

}

if(!dojo._hasResource["drupal.data.SvnStore"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drupal.data.SvnStore"] = true;
dojo.provide("drupal.data.SvnStore");


dojo.declare(
	"drupal.data.SvnStore",
	dojo.data.ItemFileWriteStore,
	{
		isItemLoaded: function(item) {
			if (this.getValue(item, "type") === "stub") {
				return false;
			}
			return true;
		},

		loadItem: function(keywordArgs){
			var item = keywordArgs.item;
			this._assertIsItem(item);

			var path = this.getValue(item, "path");
			var self = this;

			var d = dojo.xhrGet({
				url: this._jsonFileUrl + path,
				handleAs: "json-comment-optional"
			});

			d.addCallback(function(data){
				self.fetchItemByIdentity({
					identity: path,
					onItem: function(parentItem) {
						dojo.forEach(self.getValues(parentItem, "children"), function(item) { self.deleteItem(item); });
						self.unsetAttribute(parentItem, "children");

						for (var i = 0; i < data.length; i++) {
							var item = self.newItem(data[i], { parent: parentItem, attribute: "children" });
							var attributes = self.getAttributes(item);
							for (var a in attributes) {
								var values = self.getValues(item, attributes[a]);
								for (var j = 0; j < values.length; j++) {
									var stub = values[j];
									if (typeof stub === "object" && stub["type"] == "stub") {
										for (var k in stub) {
											if (!dojo.isArray(stub[k])) {
												stub[k] = [stub[k]];
											}
										}
										self._arrayOfAllItems.push(stub);
										stub[self._storeRefPropName] = self;
										stub[self._itemNumPropName] = self._arrayOfAllItems.length - 1;
										values[j] = stub;
									}
								}
							}
						}

						if (keywordArgs.onItem) {
							var scope = keywordArgs.scope ? keywordArgs.scope : dojo.global;
							keywordArgs.onItem.call(scope, null);
						}
					}
				});
			});

			d.addErrback(function(error) {
				if (keywordArgs.onError) {
					var scope = keywordArgs.scope ? keywordArgs.scope : dojo.global;
					keywordArgs.onError.call(scope, error);
				}
			});
		}
	}
);

}

if(!dojo._hasResource["drupal.form.AutoComplete"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drupal.form.AutoComplete"] = true;
dojo.provide("drupal.form.AutoComplete");



dojo.declare(
	"drupal.form.AutoComplete",
	dijit._Widget,
	{
		url: "",
		cacheItemsCap: 9, // if the handler returns 9 items or less, cache them and locally filter

		_popup: null,
		_toggler: null,
		_xhr: null,
		_anim: null,
		_selected: null,
		_cache: [],

		postCreate: function() {
			if (this.url[this.url.length - 1] != '/') {
				this.url += '/';
			}

			var d = document.createElement("div");
			d.id = "autocomplete";
			dojo.style(d, "display", "none");
			dojo.style(d, "opacity", 0);
			dojo.place(d, this.domNode, "before");
			this._popup = d;
			this._toggler = new dojo.fx.Toggler({
			    node: d,
			    hideDuration: 300
			});

			var n = this.domNode;
			dojo.connect(n, "onkeydown", this, "_onKeyDown");
			dojo.connect(n, "onkeypress", this, "_onKeyPress");
			dojo.connect(n, "onkeyup", this, "_onKeyUp");
			dojo.connect(n, "onblur", this, "_hidePopup");
		},

		_onKeyDown: function(evt) {
			if (this._popup) {
				var k = evt.keyCode;
				if (k == 13) {
					dojo.stopEvent(evt);
					this._insert();
					return false;
				} else if (k == 9) {
					this._insert();
				} else if (k == 38 || k == 40) {
					dojo.stopEvent(evt);
					this._moveSelect(evt, k == 38);
					return false;
				}
			}
			return true;
		},

		_onKeyPress: function(evt) {
			if (evt.keyCode == 13) {
				dojo.stopEvent(evt);
				return false;
			}
			return true;
		},

		_onKeyUp: function(evt) {
			var k = evt.keyCode;

			if (k == 3 || (k > 8 && k < 32) || (k > 32 && k < 46) || (k > 90 && k < 94) || (k > 111 && k < 146)) {
				dojo.stopEvent(evt);
				if (k == 27) {
					this._hidePopup();
				}
				return false;
			}

			var str = this.domNode.value;
			if (str.length) {
				this._query(str);
			} else {
				this._hidePopup();
			}

			return true;
		},

		_query: function(str) {
			this._selected = null;

			if (this._xhr != null) {
				this._xhr.cancel();
				this._xhr = null;
			}

			// check if we already have it cached
			if (this._cache[str]) {
				this._showPopup(str);
				return;
			}

			// check if we perform local filter
			if (str.length > 1) {
				var n = this._cache[str.substring(0, str.length - 1)];
				if (n && n.length <= this.cacheItemsCap) {
					var d = [];
					for (var i = 0; i < n.length; i++) {
						if (n[i].toLowerCase().indexOf(str.toLowerCase()) == 0) {
							d.push(n[i]);
						}
					}
					this._cache[str] = d
					this._showPopup(str);
					return;
				}
			}

			this._throb(true);

			var self = this;
			this._xhr = dojo.xhrGet({
				url: this.url + escape(str),
				handleAs: "json",
				load: function(response, ioArgs) {
					var d = [];
					for (var i in response) {
						d.push(response[i]);
					}
					self._cache[str] = d;
					self._showPopup(str);
				}
			});
		},

		_showPopup: function(str) {
			this._throb(false);
			var data = this._cache[str];

			if (data.length == 0) {
				this._hidePopup();
				return;
			}

			var show = dojo.style(this._popup, "display") == "none";
			var d = this._popup;
			while (d.firstChild) {
				dojo._destroyElement(d.firstChild);
			}

			var ul = document.createElement("ul");
			for (var i = 0; i < data.length; i++) {
				var li = document.createElement("li");
				li.val = data[i];
				li.innerHTML = data[i];
				ul.appendChild(li);

				dojo.connect(li, "onmousedown", this, "_insert");
				dojo.connect(li, "onmouseover", dojo.hitch(this, function(evt) { this._highlight(evt.target); }));
				dojo.connect(li, "onmouseout", dojo.hitch(this, function(evt) { this._unhighlight(evt.target); }));
			}
			d.appendChild(ul);

			this._highlight(dojo.query("li", ul)[0]);

			if (show) {
				var dim = dojo.coords(this.domNode);
				d.style.marginTop = dim.h + "px";
				d.style.width = (dim.w - 4) + "px";
				dojo.style(d, "display", "");
				this._toggler.show();
			}
		},

		_hidePopup: function() {
			this._toggler.hide();
			dojo.style(this._popup, "display", "none");
		},

		_moveSelect: function(evt, up) {
			if (this._popup) {
				if (!this._selected) {
					this._highlight(dojo.query("li:first-child", ul)[0]);
				} else {
					var lis = dojo.query("li", this._selected.parentNode);
					for (var i = 0; i < lis.length; i++) {
						if (lis[i] == this._selected) {
							if (up && i > 0) {
								this._highlight(lis[--i]);
							} else if (!up && i + 1 < lis.length) {
								this._highlight(lis[++i]);
							}
							break;
						}
					}
				}
			}
		},

		_insert: function(evt) {
			if (evt || this._selected) {
				if (evt) {
					dojo.stopEvent(evt);
				}
				var n = evt ? evt.target : this._selected;
				this.domNode.value = n.val;
				this._hidePopup();
			}
		},

		_highlight: function(n) {
			var s = this._selected;
			if (s && dojo.hasClass(s, "selected")) {
				dojo.removeClass(s, "selected");
			}
			dojo.addClass(n, "selected");
			this._selected = n;
		},

		_unhighlight: function(n) {
			dojo.removeClass(n, "selected");
			this._selected = null;
		},

		_throb: function(throbIt) {
			var n = this.domNode;
			var b = dojo.hasClass(n, "throbbing");
			if (b && !throbIt) {
				dojo.removeClass(n, "throbbing");
			} else if (!b && throbIt) {
				dojo.addClass(n, "throbbing");
			}
		}
	}
);

}

if(!dojo._hasResource["drupal.form.CustomizeToolbar"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drupal.form.CustomizeToolbar"] = true;
dojo.provide("drupal.form.CustomizeToolbar");




dojo.declare(
	"drupal.form.CustomizeToolbar",
	[dijit.form._FormWidget, dijit._Templated],
	{
		templateString:"<div class=\"dojoCustomizeToolbar\">\n\t<input dojoAttachPoint=\"_inputField\" type=\"hidden\"/>\n\t<div class=\"list\"><ul dojoAttachPoint=\"_availableList\"></ul></div>\n\t<div class=\"buttonColumn\">\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_addButton\" dojoAttachEvent=\"onclick:_addItem\" value=\"Add &gt;\"/><br/>\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_removeButton\" dojoAttachEvent=\"onclick:_removeItem\" value=\"&lt; Remove\"/><br/>\n\t\t<input type=\"button\" class=\"button\" dojoAttachEvent=\"onclick:_restoreDefaults\" value=\"Defaults\"/>\n\t</div>\n\t<div class=\"list\"><ul dojoAttachPoint=\"_selectedList\"></ul></div>\n\t<div class=\"buttonColumn\">\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_moveUpButton\" dojoAttachEvent=\"onclick:_moveItemUp\" value=\"Move Up\"/><br/>\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_moveDownButton\" dojoAttachEvent=\"onclick:_moveItemDown\" value=\"Move Down\"/>\n\t</div>\n</div>\n",

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

}

if(!dojo._hasResource["drupal.form.Editor"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drupal.form.Editor"] = true;
dojo.provide("drupal.form.Editor");






dojo.declare(
	"drupal.form.Editor",
	dijit._Widget,
	{
		// params
		showToggle: true,
		defaultState: false,
		plugins: null,

		// members
		_styleSheets: null,
		_textareaID: null,
		_containerTextArea: null,
		_containerEditor: null,
		_editor: null,
		_toggleLink: null,
		_grip: null,
		_offset: 0,
		_mouseMove: null,
		_mouseUp: null,

		postCreate: function() {
			var ss = [];
			for (var i = 0, a = null, elems = dojo.query("link"); a = elems[i]; i++) {
				var rel = a.getAttribute("rel");
				if(rel && rel.indexOf("style") != -1 && !a.disabled) {
					var h = a.getAttribute("href");
					if (h && !ss[h]) {
						ss[h] = h;
					}
				}
			}

			var regexImport = /@import\s*['"]?([\t\s\w-()\/.\\:#=&?]+)/i;
			var regexUrl = /url\(\s*([\t\s\w()\/.\\'"-:#=&?]+)\s*\)/i;
			for (var i = 0, a = null, elems = dojo.query("style"); a = elems[i]; i++) {
				var type = a.getAttribute("type");
				var media = a.getAttribute("media");
				if(type && type.toLowerCase() == "text/css" && (!media || media.toLowerCase() != "print") && !a.disabled && a.innerHTML.indexOf("@import") != -1) {
					var match = regexImport.exec(a.innerHTML);
					if (match && match.length > 1) {
						var str = match[1].replace(/(^\s*|\s*$)/g, "");
						match = regexUrl.exec(str);
						if (match && match.length > 1) {
							str = match[1].replace(/(^\s*|\s*$)/g, "");
						}
						if (!ss[str]) {
							ss[str] = str;
						}
					}
				}
			}

			var host = location.protocol + "//" + location.host;
			this._styleSheets = [];
			for (var k in ss) {
				this._styleSheets.push(host + k);
			}

			this._textareaID = this.domNode.id;

			var cta = document.createElement("div");
			cta.className = "resizable-textarea";
			dojo.place(cta, this.domNode, "after");
			cta.appendChild(this.domNode);
			this._containerTextArea = cta;

			var grip = document.createElement("div");
			grip.className = "grippie";
			cta.appendChild(grip);
			dojo.connect(grip, "onmousedown", this, "_startDrag");

			var ce = document.createElement("div");
			ce.className = "dijitEditor";
			dojo.place(ce, cta, "after");
			dojo.style(ce, 'display', 'none');
			this._containerEditor = ce;

			if (this.showToggle) {
				var a = document.createElement("a");
				a.href = "#";
				a.innerHTML = "Enable rich text editor";
				dojo.connect(a, "onclick", this, "_toggleEditor");
				this._toggleLink = a;

				var d = document.createElement("div");
				d.appendChild(a);
				dojo.place(d, ce, "after");
			}

			if (this.defaultState) {
				this._toggleEditor();
			}
		},

		_toggleEditor: function(evt) {
			if (evt) {
				dojo.stopEvent(evt);
			}

			if (this._editor) {
				this._onEditorBlur();
				this._editor.destroy();
				this._editor = null;

				dojo.style(this._containerTextArea, "display", "");
				dojo.style(this._containerEditor, "display", "none");

				this._setToggleLink("Enable rich text editor");
			} else {
				this._containerEditor.innerHTML = this.domNode.value;

				dojo.style(this._containerTextArea, "display", "none");
				dojo.style(this._containerEditor, "display", "");

				this._editor = new dijit.Editor(
					{ 	toolbarAlwaysVisible: true,
						focusOnLoad: true,
						minHeight: "15em", 
						height: "",
						plugins: this.plugins,
						extraPlugins: ['dijit._editor.plugins.AlwaysShowToolbar'],
						editingAreaStyleSheets: this._styleSheets,
						contentPreFilters: [ function(txt) { return txt.replace(/\n/g, "<br/>"); } ],
						contentPostFilters: [ function(txt) { return txt.replace(/\<br\s*\/?\>/ig, "\n"); } ]
					},
					this._containerEditor
				);

				dojo.query("html", this._editor.document)[0].className = "dijitEditorInner";
				dojo.connect(this._editor, "onBlur", this, "_onEditorBlur");
				setTimeout(dojo.hitch(this, function() { this._editor.onClick(); } ), 1000);

				this._setToggleLink("Disable rich text editor");
			}
		},

		_onEditorBlur: function() {
			var s = dojo.isFunction(this._editor.getValue) ? this._editor.getValue() : this._editor.getEditorContent();
			this.domNode.value = s.replace(/contenteditable="true"/ig, "");
		},

		_setToggleLink: function(str) {
			if (this._toggleLink) {
				this._toggleLink.innerHTML = str;
			}
		},

		_startDrag: function(evt) {
			dojo.stopEvent(evt);
			this._offset = dojo.coords(this.domNode).h - evt.pageY;
			dojo.style(this.domNode, "opacity", 0.25);

			this._mouseMove = dojo.connect(document, "onmousemove", this, "_onDrag");
			this._mouseUp = dojo.connect(document, "onmouseup", this, "_endDrag");
		},

		_onDrag: function(evt) {
			this.domNode.style.height = Math.max(32, this._offset + evt.pageY) + "px";
		},

		_endDrag: function() {
			dojo.disconnect(this._mouseMove);
			dojo.disconnect(this._mouseUp);

			dojo.style(this.domNode, "opacity", 1.0);
		}
	}
);

}

if(!dojo._hasResource["drupal.form.GoogleMapKeyTable"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drupal.form.GoogleMapKeyTable"] = true;
dojo.provide("drupal.form.GoogleMapKeyTable");



dojo.declare(
	"drupal.form.GoogleMapKeyTable",
	[dijit.form._FormWidget, dijit._Templated],
	{
		templateString: '<div><table class="dojoGoogleMapsKeyTable" dojoAttachPoint="_table"><thead><th colspan="2">URL</th><th>Key</th></thead><tbody dojoAttachPoint="_tbody"></tbody></table><div><a dojoAttachEvent="onclick:_addKey" href="#">Add new key</a></div><input type="hidden" dojoAttachPoint="_saveField" /></div>',

		// private vars
		_counter: 0,
		_keys: [],

		// attach points
		_table: null,
		_tbody: null,
		_saveField: null,

		postCreate: function() {
			var node = this.srcNodeRef;

			this._saveField.name = node.name;
			this._saveField.id = node.id;
			this._saveField.value = node.value;

			// the value contains a pipe delimited list of a key/url pair
			var pairs = node.value.split('|');
			for (var i = 0; i < pairs.length; i++) {
				if (pairs[i].length) {
					var p = pairs[i].indexOf(',');
					this._buildRow(pairs[i].substring(0, p), pairs[i].substring(p+1));
				}
			}

			this._displayTable();
		},

		_fillContent: function() { },

		_buildRow: function(key, url) {
			var idx = this._counter++;

			var tdHttp = document.createElement("td");
			tdHttp.innerHTML = "http:// ";

			var tdUrl = document.createElement("td");
			tdUrl.style.width = "40%";
			tdUrl.appendChild(this._buildInput("url", url, idx));

			var tdKey = document.createElement("td");
			tdKey.style.width = "60%";
			tdKey.appendChild(this._buildInput("key", key, idx));

			var tdDel = document.createElement("td");
			var a = document.createElement("a");
			a.href = "#";
			a.idx = idx;
			a.innerHTML = "delete";
			dojo.connect(a, "onclick", this, "_deleteKey");
			tdDel.appendChild(a);

			var tr = document.createElement("tr");
			tr.className = idx % 2 == 0 ? "even" : "odd";
			tr.appendChild(tdHttp);
			tr.appendChild(tdUrl);
			tr.appendChild(tdKey);
			tr.appendChild(tdDel);

			this._tbody.appendChild(tr);
			setTimeout(function() { dojo.query(":last-child", tdUrl)[0].focus(); }, 100);

			this._keys.push({idx: idx, key: key, url: url, row: tr});
		},

		_buildInput: function(fieldType, value, idx) {
			var i = document.createElement("input");
			i.className = "form-text";
			i.type = "text";
			i.value = value;
			i.fieldType = fieldType;
			i.idx = idx;
			dojo.connect(i, "onblur", this, "_updateKey");
			return i;
		},

		_addKey: function(evt) {
			dojo.stopEvent(evt);
			this._buildRow("", "");
			this._displayTable();
		},

		_deleteKey: function(evt) {
			dojo.stopEvent(evt);

			for (var i = 0; i < this._keys.length; i++) {
				if (this._keys[i].idx == evt.target.idx) {
					dojo._destroyElement(this._keys[i].row);
					this._keys.splice(i, 1);
				}
			}

			var j = 0;
			dojo.query("tr", this._tbody).forEach(function(e) { e.className = j++ % 2 == 0 ? "even" : "odd"; });

			this._serialize();
			this._displayTable();
		},

		_displayTable: function() {
			dojo.style(this._table, 'display', this._keys.length > 0 ? '' : 'none');
		},

		_updateKey: function(evt) {
			var t = evt.target;
			for (var i = 0; i < this._keys.length; i++) {
				if (this._keys[i].idx == t.idx) {
					this._keys[i][t.fieldType] = dojo.string.trim(t.value);
					this._serialize();
					break;
				}
			}
		},

		_serialize: function() {
			var b = "";
			for (var i = 0; i < this._keys.length; i++) {
				this._keys[i].key = dojo.string.trim(this._keys[i].key);
				this._keys[i].url = dojo.string.trim(this._keys[i].url);
				if (this._keys[i].key.length || this._keys[i].url.length) {
					b += (b.length ? "|" : "") + this._keys[i].key + "," + this._keys[i].url;
				}
			}
			this._saveField.value = b;
		}
	}
);

}

if(!dojo._hasResource["drupal.form.SvnTree"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drupal.form.SvnTree"] = true;
dojo.provide("drupal.form.SvnTree");




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

}

if(!dojo._hasResource["drupal.layout.CollapsiblePane"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drupal.layout.CollapsiblePane"] = true;
dojo.provide("drupal.layout.CollapsiblePane");



dojo.declare(
	"drupal.layout.CollapsiblePane",
	dijit._Widget,
	{
		_wrapper: null,
		_animating: false,

		postCreate: function() {
			var legend = dojo.query("legend", this.domNode)[0];

			var a = document.createElement("a");
			a.href = '#';
			a.innerHTML = legend.innerHTML;
			dojo.connect(a, "onclick", dojo.hitch(this, function(evt) {
				dojo.stopEvent(evt);
				if (!this._animating) {
					this._animating = true;
					this._toggleFieldset();
				}
			}));

			while (legend.firstChild) {
				dojo._destroyElement(legend.firstChild);
			}
			legend.appendChild(a);

			var d = document.createElement("div");
			d.className = "fieldset-wrapper";
			dojo.style(d, "display", dojo.hasClass(this.domNode, "collapsed") ? "none" : "");

			var children = this.domNode.childNodes;
			for (var j = 0; j < children.length; j++) {
				if (children[j].nodeType != 1 || !/legend/i.test(children[j].nodeName)) {
					d.appendChild(children[j--]);
				}
			}

			this.domNode.appendChild(d);
			this._wrapper = d;
		},

		_toggleFieldset: function() {
			var n = this.domNode;
			if (dojo.hasClass(n, "collapsed")) {
				n.className = n.className.replace(/ collapsed/i, "");
				var anim = dojo.fx.wipeIn({
					node: this._wrapper,
					duration: 300
				});
				dojo.connect(anim, "onEnd", dojo.hitch(this, function() {
					this._wrapper.style.height = "auto";
					this._scrollIntoView();
					this._animating = false;
				}));
				dojo.connect(anim, "onAnimate", this, "_scrollIntoView");
				anim.play();
			} else {
				var anim = dojo.fx.wipeOut({
					node: this._wrapper,
					duration: 300
				});
				dojo.connect(anim, "onEnd", dojo.hitch(this, function() {
					n.className += " collapsed";
					this._animating = false;
				}));
				anim.play();
			}
		},

		_scrollIntoView: function() {
			var n = this.domNode;
			var vh = dijit.getViewport().height;
			var c = dojo.coords(n, true);
			var ny = c.y;
			var nh = c.height;
			if (ny + nh + 55 > vh + dojo._docScroll().top) {
				window.scrollTo(0, (nh > vh ? ny : ny + nh - vh + 55));
			}
		}
	}
);

}

if(!dojo._hasResource["drupal.drupal"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drupal.drupal"] = true;
dojo.provide("drupal.drupal");










}


}});
