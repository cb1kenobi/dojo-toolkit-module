dojo.provide("drupal.widget.PleaseWait");

dojo.require("dojo.event.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");
dojo.require("dojo.widget.Dialog");

dojo.widget.defineWidget(
	"drupal.widget.PleaseWait",
	dojo.widget.HtmlWidget,
	{
		isContainer: false,
		widgetType: "PleaseWait",

		templateString: '<span id="Shib"><input dojoAttachPoint="_button" type="button" /><div dojoAttachPoint="_contents"><span class="Indicator">Please wait...</span></div></span>',

		_button: null,
		_contents: null,
		_dialog: null,
		_form: null,

		postCreate: function(/*object*/frag) {
			var n = this.domNode;
			while (n && n.parentNode && n.tagName.toLowerCase() != "form") {
				n = n.parentNode;
			}
			if (n) {
				this._form = n;
			}

			var node = this.getFragNodeRef(frag);
			this._button.id = node.id;
			this._button.name = node.name;
			this._button.value = node.value;
			this._button.className = node.className;
			dojo.event.connect(this._button, "onclick", this, "_showDialog");

			this._dialog = dojo.widget.createWidget("Dialog", {}, this._contents);
		},

		_showDialog: function(evt) {
			dojo.event.browser.stopEvent(evt);
			this._dialog.show();
			dojo.lang.setTimeout(this, "_submitForm", 500);
		},

		_submitForm: function() {
			if (this._form) {
				this._form.submit();
			}
		}
	}
);
