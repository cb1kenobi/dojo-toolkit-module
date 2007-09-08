dojo.provide("drupal.form.GoogleMapKeyTable");
dojo.require("dijit.form._FormWidget");
dojo.require("dijit._Templated");

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