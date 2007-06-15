dojo.hostenv.packageLoaded({depends:[["provide", "drupal.widget.AutoComplete"], ["require", "dojo.event.*"], ["require", "dojo.lfx.*"], ["require", "dojo.widget.*"], ["require", "dojo.widget.HtmlWidget"]], definePackage:function (dojo) {

dojo.provide("drupal.widget.AutoComplete");

dojo.require("dojo.event.*");
dojo.require("dojo.lfx.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");

dojo.widget.defineWidget(
	"drupal.widget.AutoComplete",
	dojo.widget.HtmlWidget,
	{
		isContainer: true,
		widgetType: "AutoComplete",

		url: "",
		cacheItemsCap: 9, // if the handler returns 9 items or less, cache them and locally filter

		_popup: null,
		_xhr: null,
		_anim: null,
		_selected: null,
		_cache: [],

		postCreate: function() {
			if (this.url[this.url.length - 1] != '/') {
				this.url += '/';
			}

			var n = this.domNode;
			dojo.event.connect(n, "onkeydown", this, "_onKeyDown");
			dojo.event.connect(n, "onkeypress", this, "_onKeyPress");
			dojo.event.connect(n, "onkeyup", this, "_onKeyUp");
			dojo.event.connect(n, "onblur", this, "_hidePopup");
		},

		_insert: function(evt) {
			if (evt || this._selected) {
				var n = evt ? evt.target : this._selected;
				this.domNode.value = n.val;
				this._hidePopup();
			}
		},

		_onKeyDown: function(/*object*/evt) {
			if (this._popup) {
				var k = evt.keyCode;
				if (k == 13) {
					dojo.event.browser.stopEvent(evt);
					this._insert();
					return false;
				} else if (k == 9) {
					this._insert();
				} else if (k == 38 || k == 40) {
					dojo.event.browser.stopEvent(evt);
					this._moveSelect(evt, k == 38);
					return false;
				}
			}
			return true;
		},

		_onKeyPress: function(/*object*/evt) {
			if (evt.keyCode == 13) {
				dojo.event.browser.stopEvent(evt);
				return false;
			}
			return true;
		},

		_onKeyUp: function(/*object*/evt) {
			var k = evt.keyCode;

			if (k == 3 || (k > 8 && k < 32) || (k > 32 && k < 46) || (k > 90 && k < 94) || (k > 111 && k < 146)) {
				dojo.event.browser.stopEvent(evt);
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

		_query: function(/*string*/str) {
			this._selected = null;

			if (this._xhr != null) {
				this._xhr.abort();
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
						if (dojo.string.startsWith(n[i], str, true)) {
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
			this._xhr = dojo.io.bind({
				url: this.url + escape(str),
				async: true,
				method: "get",
				load: function(type, data) {
					var d = [];
					for (var i in data) {
						d.push(data[i]);
					}
					self._cache[str] = d;
					self._showPopup(str);
				},
				error: function() { dojo.debug("error!"); },
				mimetype: "text/json",
				transport: "XMLHTTPTransport"
			});
		},

		_showPopup: function(/*string*/str) {
			this._throb(false);
			var data = this._cache[str];

			if (data.length == 0) {
				this._hidePopup();
				return;
			}

			var fadeIn = false;
			var d = this._popup;
			if (d) {
				dojo.html.removeChildren(d);
			} else {
				var dim = dojo.html.getMarginBox(this.domNode);

				d = this._popup = document.createElement("div");
				d.id = "autocomplete";
				d.style.marginTop = dim.height + "px";
				d.style.width = (dim.width - 4) + "px";

				dojo.html.setOpacity(d, 0);
				dojo.html.insertBefore(d, this.domNode);

				fadeIn = true;
			}

			var ul = document.createElement("ul");
			d.appendChild(ul);

			for (var i = 0; i < data.length; i++) {
				var li = document.createElement("li");
				li.val = data[i];
				li.innerHTML = data[i];
				ul.appendChild(li);

				dojo.event.connect(li, "onmousedown", this, "_insert");
				dojo.event.connect(li, "onmouseover", dojo.lang.hitch(this, function(evt) { this._highlight(evt.target); }));
				dojo.event.connect(li, "onmouseout", dojo.lang.hitch(this, function(evt) { this._unhighlight(evt.target); }));
			}

			if (fadeIn) {
				if (this._anim) {
					this._anim.stop();
				}
				this._anim = dojo.lfx.fadeIn(d, 200, dojo.lfx.easeInOut,
					dojo.lang.hitch(this, function() {
						this._anim = null;
					})).play();
			}
		},

		_hidePopup: function() {
			if (this._popup) {
				if (this._anim) {
					this._anim.stop();
				}
				this._anim = dojo.lfx.fadeOut(this._popup, 200, dojo.lfx.easeInOut,
					dojo.lang.hitch(this, function() {
						dojo.html.removeNode(this._popup);
						this._popup = null;
						this._anim = null;
						this._selected = null;
					})).play();
			}
		},

		_moveSelect: function(/*object*/evt, /*bool*/up) {
			if (this._popup) {
				if (up) {
					var prev = this._selected ? dojo.html.prevElement(this._selected, "li") : null;
					if (prev) {
						this._highlight(prev);
					}
				} else if (!up) {
					var next = this._selected ? dojo.html.nextElement(this._selected, "li") : null;
					if (next) {
						this._highlight(next);
					} else {
						var lis = this._popup.getElementsByTagName("li");
						if (lis.length) {
							this._highlight(lis[0]);
						}
					}
				}
			}
		},

		_highlight: function(/*object*/n) {
			if (this._selected) {
				dojo.html.removeClass(this._selected, "selected");
			}
			dojo.html.addClass(n, "selected");
			this._selected = n;
		},

		_unhighlight: function(/*object*/n) {
			dojo.html.removeClass(n, "selected");
			this._selected = null;
		},

		_throb: function(/*bool*/throbIt) {
			var n = this.domNode;
			dojo.html.removeClass(n, "throbbing");
			if (throbIt) {
				dojo.html.addClass(n, "throbbing");
			}
		}
	}
);

}});
