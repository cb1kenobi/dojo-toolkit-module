dojo.provide("drupal.widget.GoogleMapKeyTable");

dojo.require("dojo.event.*");
dojo.require("dojo.string.common");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.HtmlWidget");

dojo.widget.defineWidget(
	"drupal.widget.GoogleMapKeyTable",
	dojo.widget.HtmlWidget,
	{
		isContainer: false,
		widgetType: "GoogleMapKeyTable",

		templateString: '<div><table class="DojoGoogleMapsKeyTable" dojoAttachPoint="_table"><thead><th colspan="2">URL</th><th>Key</th></thead><tbody dojoAttachPoint="_tbody"></tbody></table><div><a dojoAttachEvent="onclick:_addKey" href="#">Add new key</a></div><input type="hidden" dojoAttachPoint="_saveField" /></div>',

		// private vars
		_name: "",
		_id: "",
		_keyCounter: 0,
		_keys: [],

		// attach points
		_table: null,
		_tbody: null,
		_saveField: null,

		postCreate: function(/*object*/args, /*object*/frag) {
			var node = this.getFragNodeRef(frag);

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

		_buildRow: function(/*string*/key, /*string*/url) {
			var idx = this._keys.length;

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
			dojo.event.connect(a, "onclick", this, "_deleteKey");
			tdDel.appendChild(a);

			var tr = document.createElement("tr");
			tr.className = ++this._keyCounter % 2 == 0 ? "even" : "odd";
			tr.appendChild(tdHttp);
			tr.appendChild(tdUrl);
			tr.appendChild(tdKey);
			tr.appendChild(tdDel);

			this._tbody.appendChild(tr);
			setTimeout(function() { dojo.html.lastElement(tdUrl).focus(); }, 100);

			this._keys.push({idx: idx, key: key, url: url, row: tr});
		},

		_buildInput: function(/*string*/fieldType, /*string*/value, /*int*/idx) {
			var i = document.createElement("input");
			i.className = "form-text";
			i.type = "text";
			i.value = value;
			i.fieldType = fieldType;
			i.idx = idx;
			dojo.event.connect(i, "onblur", this, "_updateKey");
			return i;
		},

		_addKey: function(/*object*/evt) {
			dojo.event.browser.stopEvent(evt);
			this._buildRow("", "");
			this._displayTable();
		},

		_deleteKey: function(/*object*/evt) {
			dojo.event.browser.stopEvent(evt);

			var idx = evt.target.idx;
			dojo.html.destroyNode(this._keys[idx].row);
			this._keyCounter--;
			this._keys.splice(idx, 1);
			this._serialize();
			this._displayTable();
		},

		_displayTable: function() {
			dojo.html.setDisplay(this._table, this._keys.length > 0);
		},

		_updateKey: function(/*object*/evt) {
			var t = evt.target;
			this._keys[t.idx][t.fieldType] = dojo.string.trim(t.value);
			this._serialize();
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
