dojo.provide("drupal.data.SvnStore");
dojo.require("drupal.DojoModuleAdminDeps");

dojo.declare(
	"drupal.data.SvnStore",
	dojo.data.ItemFileWriteStore,
	{
		isItemLoaded: function(item) {
			if (this.getValue(item, "type") === "stub") {
				return false;
			}
			return true;
		},

		loadItem: function(keywordArgs){
			var item = keywordArgs.item;
			this._assertIsItem(item);

			var path = this.getValue(item, "path");
			var self = this;

			var d = dojo.xhrGet({
				url: this._jsonFileUrl + path,
				handleAs: "json-comment-optional"
			});

			d.addCallback(function(data){
				self.fetchItemByIdentity({
					identity: path,
					onItem: function(parentItem) {
						dojo.forEach(self.getValues(parentItem, "children"), function(item) { self.deleteItem(item); });
						self.unsetAttribute(parentItem, "children");

						for (var i = 0; i < data.length; i++) {
							var item = self.newItem(data[i], { parent: parentItem, attribute: "children" });
							var attributes = self.getAttributes(item);
							for (var a in attributes) {
								var values = self.getValues(item, attributes[a]);
								for (var j = 0; j < values.length; j++) {
									var stub = values[j];
									if (typeof stub === "object" && stub["type"] == "stub") {
										for (var k in stub) {
											if (!dojo.isArray(stub[k])) {
												stub[k] = [stub[k]];
											}
										}
										self._arrayOfAllItems.push(stub);
										stub[self._storeRefPropName] = self;
										stub[self._itemNumPropName] = self._arrayOfAllItems.length - 1;
										values[j] = stub;
									}
								}
							}
						}

						if (keywordArgs.onItem) {
							var scope = keywordArgs.scope ? keywordArgs.scope : dojo.global;
							keywordArgs.onItem.call(scope, null);
						}
					}
				});
			});

			d.addErrback(function(error) {
				if (keywordArgs.onError) {
					var scope = keywordArgs.scope ? keywordArgs.scope : dojo.global;
					keywordArgs.onError.call(scope, error);
				}
			});
		}
	}
);