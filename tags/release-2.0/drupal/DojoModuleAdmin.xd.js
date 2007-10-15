/*
	Copyright (c) 2004-2007, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/community/licensing.shtml
*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

dojo._xdResourceLoaded({depends:[["provide","drupal.PleaseWait"],["provide","drupal.data.SvnStore"],["provide","drupal.form.CustomizeToolbar"],["provide","drupal.form.GoogleMapKeyTable"],["provide","drupal.form.SvnTree"],["provide","drupal.DojoModuleAdmin"],["require","dijit._Widget"],["require","dijit._Templated"],["require","dijit.form._FormWidget"],["require","dijit.Dialog"],["require","dijit.Tooltip"],["require","dijit.Tree"],["require","dojo.data.ItemFileWriteStore"]],defineResource:function(_1){if(!_1._hasResource["drupal.PleaseWait"]){_1._hasResource["drupal.PleaseWait"]=true;_1.provide("drupal.PleaseWait");_1.declare("drupal.PleaseWait",[dijit._Widget,dijit._Templated],{templateString:"<span id=\"Shib\"><input dojoAttachPoint=\"_button\" type=\"button\" /><div dojoAttachPoint=\"_contents\"><span class=\"Indicator\">Please wait...</span></div></span>",_button:null,_contents:null,_dialog:null,_form:null,postCreate:function(){var n=this.domNode;while(n&&n.parentNode&&n.tagName.toLowerCase()!="form"){n=n.parentNode;}if(n){this._form=n;}var _3=this.srcNodeRef;this._button.id=_3.id;this._button.name=_3.name;this._button.value=_3.value;this._button.className=_3.className;_1.connect(this._button,"onclick",this,"_showDialog");this._dialog=new dijit.Dialog({templateString:"<div class=\"dijitDialogBox\"><div dojoAttachPoint=\"containerNode\"></div></div>",},this._contents);},_showDialog:function(_4){_1.stopEvent(_4);this._dialog.show();setTimeout(_1.hitch(this,"_submitForm"),500);},_submitForm:function(){if(this._form){this._form.submit();}}});}if(!_1._hasResource["drupal.data.SvnStore"]){_1._hasResource["drupal.data.SvnStore"]=true;_1.provide("drupal.data.SvnStore");_1.declare("drupal.data.SvnStore",_1.data.ItemFileWriteStore,{isItemLoaded:function(_5){if(this.getValue(_5,"type")==="stub"){return false;}return true;},loadItem:function(_6){var _7=_6.item;this._assertIsItem(_7);var _8=this.getValue(_7,"path");var _9=this;var d=_1.xhrGet({url:this._jsonFileUrl+_8,handleAs:"json-comment-optional"});d.addCallback(function(_b){_9.fetchItemByIdentity({identity:_8,onItem:function(_c){_1.forEach(_9.getValues(_c,"children"),function(_d){_9.deleteItem(_d);});_9.unsetAttribute(_c,"children");for(var i=0;i<_b.length;i++){var _f=_9.newItem(_b[i],{parent:_c,attribute:"children"});var _10=_9.getAttributes(_f);for(var a in _10){var _12=_9.getValues(_f,_10[a]);for(var j=0;j<_12.length;j++){var _14=_12[j];if(typeof _14==="object"&&_14["type"]=="stub"){for(var k in _14){if(!_1.isArray(_14[k])){_14[k]=[_14[k]];}}_9._arrayOfAllItems.push(_14);_14[_9._storeRefPropName]=_9;_14[_9._itemNumPropName]=_9._arrayOfAllItems.length-1;_12[j]=_14;}}}}if(_6.onItem){var _16=_6.scope?_6.scope:_1.global;_6.onItem.call(_16,null);}}});});d.addErrback(function(_17){if(_6.onError){var _18=_6.scope?_6.scope:_1.global;_6.onError.call(_18,_17);}});}});}if(!_1._hasResource["drupal.form.CustomizeToolbar"]){_1._hasResource["drupal.form.CustomizeToolbar"]=true;_1.provide("drupal.form.CustomizeToolbar");_1.declare("drupal.form.CustomizeToolbar",[dijit.form._FormWidget,dijit._Templated],{templateString:"<div class=\"dojoCustomizeToolbar\">\n\t<input dojoAttachPoint=\"_inputField\" type=\"hidden\"/>\n\t<div class=\"list\"><ul dojoAttachPoint=\"_availableList\"></ul></div>\n\t<div class=\"buttonColumn\">\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_addButton\" dojoAttachEvent=\"onclick:_addItem\" value=\"Add &gt;\"/><br/>\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_removeButton\" dojoAttachEvent=\"onclick:_removeItem\" value=\"&lt; Remove\"/><br/>\n\t\t<input type=\"button\" class=\"button\" dojoAttachEvent=\"onclick:_restoreDefaults\" value=\"Defaults\"/>\n\t</div>\n\t<div class=\"list\"><ul dojoAttachPoint=\"_selectedList\"></ul></div>\n\t<div class=\"buttonColumn\">\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_moveUpButton\" dojoAttachEvent=\"onclick:_moveItemUp\" value=\"Move Up\"/><br/>\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_moveDownButton\" dojoAttachEvent=\"onclick:_moveItemDown\" value=\"Move Down\"/>\n\t</div>\n</div>\n",_inputField:null,_availableList:null,_selectedList:null,_addButton:null,_removeButton:null,_moveUpButton:null,_moveDownButton:null,toolbarPlugins:[],defaultPlugins:[],_selectedItem:null,postCreate:function(){var n=this.srcNodeRef;this._inputField.id=n.id;this._inputField.name=n.name;this._inputField.value=n.value;this._disableButtons();this._populateLists();},_populateLists:function(){var _1a=new dojox.collections.ArrayList(this._inputField.value.split(","));_1.query("li",this._availableList).forEach(function(n){_1._destroyElement(n);});_1.query("li",this._selectedList).forEach(function(n){_1._destroyElement(n);});for(var i=0;i<this.toolbarPlugins.length;i++){if(i==0||!_1a.contains(i)){this._availableList.appendChild(this._createListItem(i));}}for(var i=0;i<_1a.count;i++){this._selectedList.appendChild(this._createListItem(_1a.item(i)));}},_createListItem:function(idx){var _1f=this.toolbarPlugins[idx];var _20=document.createElement("span");_20.className=(_1f.label||_1f.stylelist?"":"dijitEditorIcon")+(_1f["class"]?" "+_1f["class"]:"");if(_1f.style){_20.cssText=_1f.style;}_20.innerHTML=_1f.label?_1f.label:"&nbsp;";var _21=document.createElement("span");_21.innerHTML=_1f.description;var li=document.createElement("li");li.idx=idx;li.style.clear="both";li.appendChild(_20);li.appendChild(_21);_1.connect(li,"onmousedown",this,"_onClick");return li;},_disableButtons:function(){this._addButton.disabled=true;this._removeButton.disabled=true;this._moveUpButton.disabled=true;this._moveDownButton.disabled=true;},_enableButtons:function(_23){this._addButton.disabled=_23;this._removeButton.disabled=!_23;this._moveUpButton.disabled=!_23;this._moveDownButton.disabled=!_23;},_restoreDefaults:function(){this._inputField.value=this.defaultPlugins;this._populateLists();},_onClick:function(evt){var li=evt.target;while(li&&li.parentNode&&li.tagName.toLowerCase()!="li"){li=li.parentNode;}if(!li){return;}if(this._selectedItem){this._selectedItem.className="";this._selectedItem=null;this._disableButtons();}this._selectedItem=li;li.className="selected";this._enableButtons(li.parentNode==this._selectedList);},_scrollToBottom:function(_26){while(_26&&_26.parentNode&&_26.tagName.toLowerCase()!="div"){_26=_26.parentNode;}if(_26){_26.scrollTop=999;}},_addItem:function(){if(this._selectedItem){if(this._selectedItem.idx==0){var _27=this._selectedItem.cloneNode(true);_27.idx=0;_1.connect(_27,"onmousedown",this,"_onClick");this._selectedItem.className="";this._selectedItem=_27;this._selectedList.appendChild(_27);}else{this._selectedList.appendChild(this._selectedItem);}this._scrollToBottom(this._selectedList);this._enableButtons(true);}this._serializeSelected();},_removeItem:function(){if(this._selectedItem){if(this._selectedItem.idx==0){_1._destroyElement(this._selectedItem);this._selectedItem=null;this._disableButtons();}else{this._availableList.appendChild(this._selectedItem);this._scrollToBottom(this._availableList);this._enableButtons(false);}}this._serializeSelected();},_moveItemUp:function(){if(this._selectedItem){var _28=this._selectedItem;do{_28=_28.previousSibling;}while(_28&&_28.nodeType!=1);if(_28){_1.place(this._selectedItem,_28,"before");this._serializeSelected();}}},_moveItemDown:function(){if(this._selectedItem){var _29=this._selectedItem;do{_29=_29.nextSibling;}while(_29&&_29.nodeType!=1);if(_29){_1.place(this._selectedItem,_29,"after");this._serializeSelected();}}},_serializeSelected:function(){var _2a=[];var lis=this._selectedList.getElementsByTagName("li");for(var i=0;i<lis.length;i++){_2a.push(lis[i].idx);}this._inputField.value=_2a.join(",");}});}if(!_1._hasResource["drupal.form.GoogleMapKeyTable"]){_1._hasResource["drupal.form.GoogleMapKeyTable"]=true;_1.provide("drupal.form.GoogleMapKeyTable");_1.declare("drupal.form.GoogleMapKeyTable",[dijit.form._FormWidget,dijit._Templated],{templateString:"<div><table class=\"dojoGoogleMapsKeyTable\" dojoAttachPoint=\"_table\"><thead><th colspan=\"2\">URL</th><th>Key</th></thead><tbody dojoAttachPoint=\"_tbody\"></tbody></table><div><a dojoAttachEvent=\"onclick:_addKey\" href=\"#\">Add new key</a></div><input type=\"hidden\" dojoAttachPoint=\"_saveField\" /></div>",_counter:0,_keys:[],_table:null,_tbody:null,_saveField:null,postCreate:function(){var _2d=this.srcNodeRef;this._saveField.name=_2d.name;this._saveField.id=_2d.id;this._saveField.value=_2d.value;var _2e=_2d.value.split("|");for(var i=0;i<_2e.length;i++){if(_2e[i].length){var p=_2e[i].indexOf(",");this._buildRow(_2e[i].substring(0,p),_2e[i].substring(p+1));}}this._displayTable();},_fillContent:function(){},_buildRow:function(key,url){var idx=this._counter++;var _34=document.createElement("td");_34.innerHTML="http:// ";var _35=document.createElement("td");_35.style.width="40%";_35.appendChild(this._buildInput("url",url,idx));var _36=document.createElement("td");_36.style.width="60%";_36.appendChild(this._buildInput("key",key,idx));var _37=document.createElement("td");var a=document.createElement("a");a.href="#";a.idx=idx;a.innerHTML="delete";_1.connect(a,"onclick",this,"_deleteKey");_37.appendChild(a);var tr=document.createElement("tr");tr.className=idx%2==0?"even":"odd";tr.appendChild(_34);tr.appendChild(_35);tr.appendChild(_36);tr.appendChild(_37);this._tbody.appendChild(tr);setTimeout(function(){_1.query(":last-child",_35)[0].focus();},100);this._keys.push({idx:idx,key:key,url:url,row:tr});},_buildInput:function(_3a,_3b,idx){var i=document.createElement("input");i.className="form-text";i.type="text";i.value=_3b;i.fieldType=_3a;i.idx=idx;_1.connect(i,"onblur",this,"_updateKey");return i;},_addKey:function(evt){_1.stopEvent(evt);this._buildRow("","");this._displayTable();},_deleteKey:function(evt){_1.stopEvent(evt);for(var i=0;i<this._keys.length;i++){if(this._keys[i].idx==evt.target.idx){_1._destroyElement(this._keys[i].row);this._keys.splice(i,1);}}var j=0;_1.query("tr",this._tbody).forEach(function(e){e.className=j++%2==0?"even":"odd";});this._serialize();this._displayTable();},_displayTable:function(){_1.style(this._table,"display",this._keys.length>0?"":"none");},_updateKey:function(evt){var t=evt.target;for(var i=0;i<this._keys.length;i++){if(this._keys[i].idx==t.idx){this._keys[i][t.fieldType]=_1.string.trim(t.value);this._serialize();break;}}},_serialize:function(){var b="";for(var i=0;i<this._keys.length;i++){this._keys[i].key=_1.string.trim(this._keys[i].key);this._keys[i].url=_1.string.trim(this._keys[i].url);if(this._keys[i].key.length||this._keys[i].url.length){b+=(b.length?"|":"")+this._keys[i].key+","+this._keys[i].url;}}this._saveField.value=b;}});}if(!_1._hasResource["drupal.form.SvnTree"]){_1._hasResource["drupal.form.SvnTree"]=true;_1.provide("drupal.form.SvnTree");_1.declare("drupal.form.SvnTree",dijit._Widget,{_tree:null,postCreate:function(){var _48=this;var _49="dojoSvnTreeFolderOpened";var _4a="dojoSvnTreeFolderClosed";var d=document.createElement("div");_1.place(d,this.domNode,"after");this._tree=new dijit.Tree({query:{type:"dir"},labelAttr:"name",typeAttr:"type",store:new drupal.data.SvnStore({url:"/dojo/svn"}),getIconClass:function(){return _4a;}},d);_1.connect(this._tree,"addChild",this,"_createToolTip");_1.subscribe(this._tree.id,null,function(e){var n=e.node;if(/^toggleOpen$|^zoomIn$|^zoomOut$/i.test(e.event)){var b=(n.isExpanded||/loading/i.test(n.state));_1.removeClass(n.iconNode,b?_4a:_49);_1.addClass(n.iconNode,b?_49:_4a);}else{if(e.event=="execute"){_48.domNode.value=n.item.id;}}});_1.addClass(this._tree.domNode,"dojoSvnTree");},_createToolTip:function(_4f){var d=document.createElement("div");d.innerHTML="<div><strong>"+_4f.label+"</strong></div><div>Revision: "+_4f.item.revision+"</div><div>Author: "+_4f.item.author+"</div><div>Date: "+_4f.item.date+"</div>";_1.style(d,"display","none");_1.place(d,self.domNode,"after");_4f.labelNode.id="node"+Math.round(Math.random()*10000000);var t=new dijit.Tooltip({connectId:_4f.labelNode.id},d);_1.connect(_4f,"addChild",this,"_createToolTip");}});}if(!_1._hasResource["drupal.DojoModuleAdmin"]){_1._hasResource["drupal.DojoModuleAdmin"]=true;_1.provide("drupal.DojoModuleAdmin");}}});
