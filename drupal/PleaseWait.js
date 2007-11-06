dojo.provide("drupal.PleaseWait");
dojo.require("drupal.DojoModuleAdminDeps");

dojo.declare(
	"drupal.PleaseWait",
	[dijit._Widget, dijit._Templated],
	{
		templateString: '<span id="Shib"><input dojoAttachPoint="_button" type="button"/><div dojoAttachPoint="_contents"><span class="Indicator">Please wait...</span></div></span>',

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
				templateString: '<div class="dijitDialogBox"><div dojoAttachPoint="containerNode"></div></div>'
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
