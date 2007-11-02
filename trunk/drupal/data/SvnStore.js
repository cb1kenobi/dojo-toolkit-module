dojo.provide("drupal.data.SvnStore");
dojo.require("drupal.DojoModuleAdminDeps");

dojo.declare(
	"drupal.data.SvnStore",
	dojo.data.ItemFileWriteStore,
	{
		getValues: function(/* item */ parentItem, 
							/* attribute-name-string */ attribute){
			//	summary: 
			//		See dojo.data.api.Read.getValues()
	
			this._assertIsItem(parentItem);
			this._assertIsAttribute(attribute);

			if (attribute == "children" && parentItem.id) {
				var self = this;
				var d = dojo.xhrGet({
					url: this._jsonFileUrl + parentItem.id,
					sync: true,
					handleAs: "json",
					load: function(data, ioArgs) {
						for (var i=0; i<data.length; i++) {
							data[i]["name"] = [ data[i]["name"] ];
							self._arrayOfAllItems.push(data[i]);
							data[i][self._storeRefPropName] = self;
							data[i][self._itemNumPropName] = self._arrayOfAllItems.length - 1;
							parentItem["children"].push(data[i]);
						}
					}
				});
			}

			return parentItem[attribute] || []; // Array
		},

		hasAttribute: function(item, attr) {
			if (attr == "children") {
				return true;
			}
			return this.getValues(item, attribute).length > 0;
		}
	}
);
