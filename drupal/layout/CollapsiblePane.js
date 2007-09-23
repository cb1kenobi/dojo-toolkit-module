dojo.provide("drupal.layout.CollapsiblePane");

dojo.require("dijit._Widget");
dojo.require("dojo.fx");

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