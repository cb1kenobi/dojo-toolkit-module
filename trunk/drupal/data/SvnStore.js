dojo.provide("drupal.data.SvnStore");
dojo.require("dojo.data.ItemFileWriteStore");

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

			var itemName = this.getValue(item, "name").substring(1);
			var path   = this.getValue(item, "path");
			var dataUrl  = this._jsonFileUrl;
			if (path) {
				dataUrl += path;
			}
			dataUrl += '/' + itemName;

//console.debug("item = " + itemName + " path = " + path + " url = " + dataUrl);

			var self = this;

			var d = dojo.xhrGet({
				url: dataUrl,
				handleAs: "json-comment-optional"
			});

			d.addCallback(function(data){
				var crap = self.fetchItemByIdentity({
					identity: itemName,
					onItem: function(parentItem) {
						//console.debug("found parent " + self.getValue(parentItem, "name"));
						//console.debug("parent has " + children.length + " items");

						dojo.forEach(self.getValues(parentItem, "children"), function(item) {
							//console.debug("deleting item " + self.getValue(item, "name"));
							self.deleteItem(item);
						});

						self.setValue(parentItem, "children", []);

						//var children = self.getValues(parentItem, "children");
						//console.debug("now parent has " + children.length + " items");

						//console.debug("adding " + data.length + " items");
						for (var i = 0; i < data.length; i++) {
							var item = self.newItem(data[i], { parent: parentItem, attribute: "children" });
							var attributes = self.getAttributes(item);
							for (var a in attributes) {
								var values = self.getValues(item, attributes[a]);
								for (var j = 0; j < values.length; j++) {
									var stub = values[j];
									if (typeof stub === "object" && stub["type"] == "stub") {
										self._arrayOfAllItems.push(stub);
										stub[self._storeRefPropName] = self;
										stub[self._itemNumPropName] = self._arrayOfAllItems.length - 1;
										values[j] = stub;
									}
								}
							}
						}

						if(keywordArgs.onItem){
							var scope = keywordArgs.scope ? keywordArgs.scope : dojo.global;
							keywordArgs.onItem.call(scope, null);
						}

						//console.debug("done!");
					}
				});
/*
				delete item.type;
				delete item.parent;

				//Set up the loaded values in the format ItemFileReadStore uses for attributes.
				for (i in data) {
					if (dojo.isArray(data[i])) {
						item[i] = data[i];
					}else{
						item[i] = [data[i]];
					}
				}

				//Reset the item in the reference.  
				self._arrayOfAllItems[item[self._itemId]] = item;

				//Scan the new values in the item for extra stub items we need to 
				//add to the items array of the store so they can be lazy-loaded later...
				var attributes = self.getAttributes(item);
				for(i in attributes){
					var values = self.getValues(item, attributes[i]);
					for (var j = 0; j < values.length; j++) {
						var value = values[j];
						
						if(typeof value === "object"){
							if(value["stub"] ){
								//We have a stub reference here, we need to create the stub item
								var stub = {
									type: ["stub"],
									name: [value["stub"]],	//
									parent: [itemName]		//The child stub item is parented by this item name...
								};
								if (parent) {
									//Add in any parents to your parent so URL construstruction is accurate.
									stub.parent[0] = parent + "/" + stub.parent[0]; 
								}
								//Finalize the addition of the new stub item into the ItemFileReadStore list.
								self._arrayOfAllItems.push(stub);
								stub[self._storeRefPropName] = self;
								stub[self._itemNumPropName] = (self._arrayOfAllItems.length - 1); //Last one pushed in should be the item
								values[j] = stub; //Set the stub item back in its place and replace the stub notation.
							}
						}
					}
				}
*/
			});

			d.addErrback(function(error){
				if(keywordArgs.onError){
					var scope = keywordArgs.scope ? keywordArgs.scope : dojo.global;
					keywordArgs.onError.call(scope, error);
				}
			});
		}
	}
);