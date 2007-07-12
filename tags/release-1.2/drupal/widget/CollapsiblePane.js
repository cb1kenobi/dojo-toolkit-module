dojo.provide("drupal.widget.CollapsiblePane");

dojo.require("dojo.event.*");
dojo.require("dojo.lfx.*");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");

dojo.widget.defineWidget(
	"drupal.widget.CollapsiblePane",
	dojo.widget.HtmlWidget,
	{
		isContainer: false,
		widgetType: "CollapsiblePane",

		_wrapper: null,
		_animating: false,

		postCreate: function() {
			var legend = dojo.html.firstElement(this.domNode, "legend");

			var a = document.createElement("a");
			a.href = '#';
			a.innerHTML = legend.innerHTML;
			dojo.event.connect(a, "onclick", dojo.lang.hitch(this, function(evt) {
					dojo.event.browser.stopEvent(evt);
					if (!this._animating) {
						this._animating = true;
						this._toggleFieldset();
					}
				}));

			dojo.html.removeChildren(legend);
			legend.appendChild(a);

			var d = document.createElement("div");
			d.className = "fieldset-wrapper";

			var children = this.domNode.childNodes;
			for (var j = 0; j < children.length; j++) {
				if (children[j].nodeType != dojo.dom.ELEMENT_NODE || !/legend/i.test(children[j].nodeName)) {
					d.appendChild(children[j--]);
				}
			}

			this.domNode.appendChild(d);
			this._wrapper = d;
		},

		_toggleFieldset: function() {
			var n = this.domNode;
			if (n.className.indexOf("collapsed") != -1) {
				n.className = n.className.replace(/ collapsed/i, "");
				var anim = dojo.lfx.html.wipeIn(this._wrapper, 300);
				dojo.event.connect(anim, "onEnd", dojo.lang.hitch(this, function() {
						this._wrapper.style.height = "auto";
						this._scrollIntoView();
						this._animating = false;
					}));
				dojo.event.connect(anim, "onAnimate", this, "_scrollIntoView");
				anim.play();
			} else {
				var anim = dojo.lfx.html.wipeOut(this._wrapper, 300);
				dojo.event.connect(anim, "onEnd", dojo.lang.hitch(this, function() {
						n.className += " collapsed";
						this._animating = false;
					}));
				anim.play();
			}
		},

		_scrollIntoView: function() {
			var n = this.domNode;
			var vh = dojo.html.getViewport().height;
			var ny = dojo.html.abs(n, true).y;
			var nh = dojo.html.getMarginBox(n).height;
			if (ny + nh + 55 > vh + dojo.html.getScroll().top) {
				window.scrollTo(0, (nh > vh ? ny : ny + nh - vh + 55));
			}
		}
	}
);
