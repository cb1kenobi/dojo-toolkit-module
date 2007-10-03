dojo.provide("drupal.form.Editor");
dojo.require("drupal.DojoModuleMainDeps");

dojo.declare(
	"drupal.form.Editor",
	dijit._Widget,
	{
		// params
		showToggle: true,
		defaultState: false,
		plugins: [],

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
				this._styleSheets.push((k.toLowerCase().indexOf("http") != -1 ? "" : host) + k);
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

				var a = function(txt) { return txt.replace(/\n/g, "<br/>"); };
				var b = function(txt) { return txt.replace(/\<br\s*\/?\>/ig, "\n"); };

				this._editor = new dijit.Editor(
					{ 	toolbarAlwaysVisible: true,
						focusOnLoad: true,
						minHeight: "15em", 
						height: "",
						plugins: this.plugins,
						extraPlugins: ['dijit._editor.plugins.AlwaysShowToolbar'],
						editingAreaStyleSheets: this._styleSheets,
						contentPreFilters: [ a ],
						contentPostFilters: [ b ]
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