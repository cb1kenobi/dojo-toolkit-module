dojo.provide("drupal.form.AutoComplete");

dojo.require("dijit._Widget");
dojo.require("dojo.fx");

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