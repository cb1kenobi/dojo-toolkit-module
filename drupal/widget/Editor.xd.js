dojo.hostenv.packageLoaded({depends:[["provide", "drupal.widget.Editor"], ["require", "dojo.event.*"], ["require", "dojo.html.common"], ["require", "dojo.html.style"], ["require", "dojo.lang.common"], ["require", "dojo.lang.extras"], ["require", "dojo.widget.*"], ["require", "dojo.widget.Button"], ["require", "dojo.widget.Editor2"], ["require", "dojo.widget.Editor2Plugin.CreateLinkDialog"], ["require", "dojo.widget.Editor2Plugin.InsertImageDialog"], ["require", "dojo.widget.HtmlWidget"]], definePackage:function (dojo) {

dojo.provide("drupal.widget.Editor");

dojo.require("dojo.event.*");
dojo.require("dojo.html.common");
dojo.require("dojo.html.style");
dojo.require("dojo.lang.common");
dojo.require("dojo.lang.extras");
dojo.require("dojo.string.common");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.Button");
dojo.require("dojo.widget.Editor2");
dojo.require("dojo.widget.Editor2Plugin.CreateLinkDialog");
dojo.require("dojo.widget.Editor2Plugin.InsertImageDialog");
dojo.require("dojo.widget.HtmlWidget");

dojo.widget.defineWidget(
	"drupal.widget.Editor",
	dojo.widget.HtmlWidget,
	function() {
		this._styleSheets = [];
	},
	{
		isContainer: true,
		widgetType: "Editor",

		// params
		showToggle: true,
		defaultState: false,

		// members
		_textareaID: null,
		_containerTextArea: null,
		_containerEditor: null,
		_editor: null,
		_toggleLink: null,
		_grip: null,
		_offset: 0,

		postCreate: function() {
			var ss = [];
			for (var i = 0, a = null, elems = dojo.doc().getElementsByTagName("link"); a = elems[i]; i++) {
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
			for (var i = 0, a = null, elems = dojo.doc().getElementsByTagName("style"); a = elems[i]; i++) {
				var type = a.getAttribute("type");
				var media = a.getAttribute("media");
				if(type && type.toLowerCase() == "text/css" && (!media || media.toLowerCase() != "print") && !a.disabled && a.innerHTML.indexOf("@import") != -1) {
					var match = regexImport.exec(a.innerHTML);
					if (match && match.length > 1) {
						var str = dojo.string.trim(match[1]);
						match = regexUrl.exec(str);
						if (match && match.length > 1) {
							str = dojo.string.trim(match[1]);
						}
						if (!ss[str]) {
							ss[str] = str;
						}
					}
				}
			}

			var host = location.protocol + "//" + location.host;
			for (var k in ss) {
				this._styleSheets.push(host + k);
			}

			if (djConfig["useXDomain"]) {
				dojo.widget.Editor2CreateLinkDialog.prototype.templatePath = djConfig["dojoCreateLinkUrl"]; dojo.widget.Editor2InsertImageDialog.prototype.templatePath = djConfig["dojoInsertImageUrl"];
			}

			this._textareaID = this.domNode.id;

			var cta = document.createElement("div");
			cta.className = "resizable-textarea";
			dojo.html.insertAfter(cta, this.domNode);
			cta.appendChild(this.domNode);
			this._containerTextArea = cta;

			var grip = document.createElement("div");
			grip.className = "grippie";
			cta.appendChild(grip);
			dojo.event.connect(grip, "onmousedown", this, "_startDrag");

			var ce = document.createElement("div");
			ce.className = "DojoEditor";
			dojo.html.insertAfter(ce, cta);
			dojo.html.setDisplay(ce, false);
			this._containerEditor = ce;

			if (this.showToggle) {
				var a = document.createElement("a");
				a.href = "#";
				a.innerHTML = "Enable rich text editor";
				dojo.event.connect(a, "onclick", this, "_toggleEditor");
				this._toggleLink = a;

				var d = document.createElement("div");
				d.appendChild(a);
				dojo.html.insertAfter(d, ce);
			}

			if (this.defaultState) {
				this._toggleEditor();
			}
		},

		_toggleEditor: function(/*object*/evt) {
			if (evt) {
				dojo.event.browser.stopEvent(evt);
			}

			if (this._editor) {
				this._onEditorBlur();
				this._editor.destroy();
				this._editor = null;

				dojo.html.setDisplay(this._containerTextArea, true);
				dojo.html.setDisplay(this._containerEditor, false);

				this._setToggleLink("Enable rich text editor");
			} else {
				this._containerEditor.innerHTML = this.domNode.value;

				dojo.html.setDisplay(this._containerTextArea, false);
				dojo.html.setDisplay(this._containerEditor, true);

				this._editor = dojo.widget.createWidget("Editor2", 
					{ 	shareToolbar: false, 
						toolbarAlwaysVisible: true,
						focusOnLoad: true,
						minHeight: "10em",
						editingAreaStyleSheets: this._styleSheets,
						toolbarTemplatePath: "/dojo/toolbar",
						contentPreFilters: [ function(txt) { return txt.replace(/\n/g, "<br/>"); } ],
						contentPostFilters: [ function(txt) { return txt.replace(/\<br\s*\/?\>/ig, "\n"); } ]
					},
					this._containerEditor);

				dojo.event.connect(this._editor, "onBlur", this, "_onEditorBlur");
				dojo.lang.setTimeout(this._editor, "onClick", 1000);

				this._setToggleLink("Disable rich text editor");
			}
		},

		_onEditorBlur: function() {
			var s = dojo.lang.isFunction(this._editor.getValue) ? this._editor.getValue() : this._editor.getEditorContent();
			this.domNode.value = s.replace(/contenteditable="true"/ig, "");
		},

		_setToggleLink: function(/*string*/str) {
			if (this._toggleLink) {
				this._toggleLink.innerHTML = str;
			}
		},

		_startDrag: function(/*object*/evt) {
			dojo.event.browser.stopEvent(evt);

			this._offset = dojo.html.getContentBox(this.domNode).height - evt.pageY;
			dojo.html.setOpacity(this.domNode, 0.25);

			dojo.event.connect(document, "onmousemove", this, "_onDrag");
			dojo.event.connect(document, "onmouseup", this, "_endDrag");
		},

		_onDrag: function(/*object*/evt) {
			this.domNode.style.height = Math.max(32, this._offset + evt.pageY) + "px";
		},

		_endDrag: function() {
			dojo.event.disconnect(document, "onmousemove", this, "_onDrag");
			dojo.event.disconnect(document, "onmouseup", this, "_endDrag");

			dojo.html.setOpacity(this.domNode, 1.0);
		}
	}
);

}});
