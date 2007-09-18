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

if(!dojo._hasResource["drupal.PleaseWait"]){dojo._hasResource["drupal.PleaseWait"]=true;dojo.provide("drupal.PleaseWait");dojo.declare("drupal.PleaseWait",[dijit._Widget,dijit._Templated],{templateString:"<span id=\"Shib\"><input dojoAttachPoint=\"_button\" type=\"button\" /><div dojoAttachPoint=\"_contents\"><span class=\"Indicator\">Please wait...</span></div></span>",_button:null,_contents:null,_dialog:null,_form:null,postCreate:function(){var n=this.domNode;while(n&&n.parentNode&&n.tagName.toLowerCase()!="form"){n=n.parentNode;}if(n){this._form=n;}var _2=this.srcNodeRef;this._button.id=_2.id;this._button.name=_2.name;this._button.value=_2.value;this._button.className=_2.className;dojo.connect(this._button,"onclick",this,"_showDialog");this._dialog=new dijit.Dialog({templateString:"<div class=\"dijitDialogBox\"><div dojoAttachPoint=\"containerNode\"></div></div>",},this._contents);},_showDialog:function(_3){dojo.stopEvent(_3);this._dialog.show();setTimeout(dojo.hitch(this,"_submitForm"),500);},_submitForm:function(){if(this._form){this._form.submit();}}});}if(!dojo._hasResource["drupal.data.SvnStore"]){dojo._hasResource["drupal.data.SvnStore"]=true;dojo.provide("drupal.data.SvnStore");dojo.declare("drupal.data.SvnStore",dojo.data.ItemFileWriteStore,{isItemLoaded:function(_4){if(this.getValue(_4,"type")==="stub"){return false;}return true;},loadItem:function(_5){var _6=_5.item;this._assertIsItem(_6);var _7=this.getValue(_6,"path");var _8=this;var d=dojo.xhrGet({url:this._jsonFileUrl+_7,handleAs:"json-comment-optional"});d.addCallback(function(_a){_8.fetchItemByIdentity({identity:_7,onItem:function(_b){dojo.forEach(_8.getValues(_b,"children"),function(_c){_8.deleteItem(_c);});_8.unsetAttribute(_b,"children");for(var i=0;i<_a.length;i++){var _e=_8.newItem(_a[i],{parent:_b,attribute:"children"});var _f=_8.getAttributes(_e);for(var a in _f){var _11=_8.getValues(_e,_f[a]);for(var j=0;j<_11.length;j++){var _13=_11[j];if(typeof _13==="object"&&_13["type"]=="stub"){for(var k in _13){if(!dojo.isArray(_13[k])){_13[k]=[_13[k]];}}_8._arrayOfAllItems.push(_13);_13[_8._storeRefPropName]=_8;_13[_8._itemNumPropName]=_8._arrayOfAllItems.length-1;_11[j]=_13;}}}}if(_5.onItem){var _15=_5.scope?_5.scope:dojo.global;_5.onItem.call(_15,null);}}});});d.addErrback(function(_16){if(_5.onError){var _17=_5.scope?_5.scope:dojo.global;_5.onError.call(_17,_16);}});}});}if(!dojo._hasResource["drupal.form.AutoComplete"]){dojo._hasResource["drupal.form.AutoComplete"]=true;dojo.provide("drupal.form.AutoComplete");dojo.declare("drupal.form.AutoComplete",dijit._Widget,{url:"",cacheItemsCap:9,_popup:null,_toggler:null,_xhr:null,_anim:null,_selected:null,_cache:[],postCreate:function(){if(this.url[this.url.length-1]!="/"){this.url+="/";}var d=document.createElement("div");d.id="autocomplete";dojo.style(d,"display","none");dojo.style(d,"opacity",0);dojo.place(d,this.domNode,"before");this._popup=d;this._toggler=new dojo.fx.Toggler({node:d,hideDuration:300});var n=this.domNode;dojo.connect(n,"onkeydown",this,"_onKeyDown");dojo.connect(n,"onkeypress",this,"_onKeyPress");dojo.connect(n,"onkeyup",this,"_onKeyUp");dojo.connect(n,"onblur",this,"_hidePopup");},_onKeyDown:function(evt){if(this._popup){var k=evt.keyCode;if(k==13){dojo.stopEvent(evt);this._insert();return false;}else{if(k==9){this._insert();}else{if(k==38||k==40){dojo.stopEvent(evt);this._moveSelect(evt,k==38);return false;}}}}return true;},_onKeyPress:function(evt){if(evt.keyCode==13){dojo.stopEvent(evt);return false;}return true;},_onKeyUp:function(evt){var k=evt.keyCode;if(k==3||(k>8&&k<32)||(k>32&&k<46)||(k>90&&k<94)||(k>111&&k<146)){dojo.stopEvent(evt);if(k==27){this._hidePopup();}return false;}var str=this.domNode.value;if(str.length){this._query(str);}else{this._hidePopup();}return true;},_query:function(str){this._selected=null;if(this._xhr!=null){this._xhr.cancel();this._xhr=null;}if(this._cache[str]){this._showPopup(str);return;}if(str.length>1){var n=this._cache[str.substring(0,str.length-1)];if(n&&n.length<=this.cacheItemsCap){var d=[];for(var i=0;i<n.length;i++){if(n[i].toLowerCase().indexOf(str.toLowerCase())==0){d.push(n[i]);}}this._cache[str]=d;this._showPopup(str);return;}}this._throb(true);var _24=this;this._xhr=dojo.xhrGet({url:this.url+escape(str),handleAs:"json",load:function(_25,_26){var d=[];for(var i in _25){d.push(_25[i]);}_24._cache[str]=d;_24._showPopup(str);}});},_showPopup:function(str){this._throb(false);var _2a=this._cache[str];if(_2a.length==0){this._hidePopup();return;}var _2b=dojo.style(this._popup,"display")=="none";var d=this._popup;while(d.firstChild){dojo._destroyElement(d.firstChild);}var ul=document.createElement("ul");for(var i=0;i<_2a.length;i++){var li=document.createElement("li");li.val=_2a[i];li.innerHTML=_2a[i];ul.appendChild(li);dojo.connect(li,"onmousedown",this,"_insert");dojo.connect(li,"onmouseover",dojo.hitch(this,function(evt){this._highlight(evt.target);}));dojo.connect(li,"onmouseout",dojo.hitch(this,function(evt){this._unhighlight(evt.target);}));}d.appendChild(ul);this._highlight(dojo.query("li",ul)[0]);if(_2b){var dim=dojo.coords(this.domNode);d.style.marginTop=dim.h+"px";d.style.width=(dim.w-4)+"px";dojo.style(d,"display","");this._toggler.show();}},_hidePopup:function(){this._toggler.hide();dojo.style(this._popup,"display","none");},_moveSelect:function(evt,up){if(this._popup){if(!this._selected){this._highlight(dojo.query("li:first-child",ul)[0]);}else{var lis=dojo.query("li",this._selected.parentNode);for(var i=0;i<lis.length;i++){if(lis[i]==this._selected){if(up&&i>0){this._highlight(lis[--i]);}else{if(!up&&i+1<lis.length){this._highlight(lis[++i]);}}break;}}}}},_insert:function(evt){if(evt||this._selected){if(evt){dojo.stopEvent(evt);}var n=evt?evt.target:this._selected;this.domNode.value=n.val;this._hidePopup();}},_highlight:function(n){var s=this._selected;if(s&&dojo.hasClass(s,"selected")){dojo.removeClass(s,"selected");}dojo.addClass(n,"selected");this._selected=n;},_unhighlight:function(n){dojo.removeClass(n,"selected");this._selected=null;},_throb:function(_3c){var n=this.domNode;var b=dojo.hasClass(n,"throbbing");if(b&&!_3c){dojo.removeClass(n,"throbbing");}else{if(!b&&_3c){dojo.addClass(n,"throbbing");}}}});}if(!dojo._hasResource["drupal.form.CustomizeToolbar"]){dojo._hasResource["drupal.form.CustomizeToolbar"]=true;dojo.provide("drupal.form.CustomizeToolbar");dojo.declare("drupal.form.CustomizeToolbar",[dijit.form._FormWidget,dijit._Templated],{templateString:"<div class=\"dojoCustomizeToolbar\">\n\t<input dojoAttachPoint=\"_inputField\" type=\"hidden\"/>\n\t<div class=\"list\"><ul dojoAttachPoint=\"_availableList\"></ul></div>\n\t<div class=\"buttonColumn\">\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_addButton\" dojoAttachEvent=\"onclick:_addItem\" value=\"Add &gt;\"/><br/>\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_removeButton\" dojoAttachEvent=\"onclick:_removeItem\" value=\"&lt; Remove\"/><br/>\n\t\t<input type=\"button\" class=\"button\" dojoAttachEvent=\"onclick:_restoreDefaults\" value=\"Defaults\"/>\n\t</div>\n\t<div class=\"list\"><ul dojoAttachPoint=\"_selectedList\"></ul></div>\n\t<div class=\"buttonColumn\">\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_moveUpButton\" dojoAttachEvent=\"onclick:_moveItemUp\" value=\"Move Up\"/><br/>\n\t\t<input type=\"button\" class=\"button\" dojoAttachPoint=\"_moveDownButton\" dojoAttachEvent=\"onclick:_moveItemDown\" value=\"Move Down\"/>\n\t</div>\n</div>\n",_inputField:null,_availableList:null,_selectedList:null,_addButton:null,_removeButton:null,_moveUpButton:null,_moveDownButton:null,toolbarPlugins:[],defaultPlugins:[],_selectedItem:null,postCreate:function(){var n=this.srcNodeRef;this._inputField.id=n.id;this._inputField.name=n.name;this._inputField.value=n.value;this._disableButtons();this._populateLists();},_populateLists:function(){var _40=new dojox.collections.ArrayList(this._inputField.value.split(","));dojo.query("li",this._availableList).forEach(function(n){dojo._destroyElement(n);});dojo.query("li",this._selectedList).forEach(function(n){dojo._destroyElement(n);});for(var i=0;i<this.toolbarPlugins.length;i++){if(i==0||!_40.contains(i)){this._availableList.appendChild(this._createListItem(i));}}for(var i=0;i<_40.count;i++){this._selectedList.appendChild(this._createListItem(_40.item(i)));}},_createListItem:function(idx){var _45=this.toolbarPlugins[idx];var _46=document.createElement("span");_46.className=(_45.label||_45.stylelist?"":"dijitEditorIcon")+(_45["class"]?" "+_45["class"]:"");if(_45.style){_46.cssText=_45.style;}_46.innerHTML=_45.label?_45.label:"&nbsp;";var _47=document.createElement("span");_47.innerHTML=_45.description;var li=document.createElement("li");li.idx=idx;li.style.clear="both";li.appendChild(_46);li.appendChild(_47);dojo.connect(li,"onmousedown",this,"_onClick");return li;},_disableButtons:function(){this._addButton.disabled=true;this._removeButton.disabled=true;this._moveUpButton.disabled=true;this._moveDownButton.disabled=true;},_enableButtons:function(_49){this._addButton.disabled=_49;this._removeButton.disabled=!_49;this._moveUpButton.disabled=!_49;this._moveDownButton.disabled=!_49;},_restoreDefaults:function(){this._inputField.value=this.defaultPlugins;this._populateLists();},_onClick:function(evt){var li=evt.target;while(li&&li.parentNode&&li.tagName.toLowerCase()!="li"){li=li.parentNode;}if(!li){return;}if(this._selectedItem){this._selectedItem.className="";this._selectedItem=null;this._disableButtons();}this._selectedItem=li;li.className="selected";this._enableButtons(li.parentNode==this._selectedList);},_scrollToBottom:function(_4c){while(_4c&&_4c.parentNode&&_4c.tagName.toLowerCase()!="div"){_4c=_4c.parentNode;}if(_4c){_4c.scrollTop=999;}},_addItem:function(){if(this._selectedItem){if(this._selectedItem.idx==0){var _4d=this._selectedItem.cloneNode(true);_4d.idx=0;dojo.connect(_4d,"onmousedown",this,"_onClick");this._selectedItem.className="";this._selectedItem=_4d;this._selectedList.appendChild(_4d);}else{this._selectedList.appendChild(this._selectedItem);}this._scrollToBottom(this._selectedList);this._enableButtons(true);}this._serializeSelected();},_removeItem:function(){if(this._selectedItem){if(this._selectedItem.idx==0){dojo._destroyElement(this._selectedItem);this._selectedItem=null;this._disableButtons();}else{this._availableList.appendChild(this._selectedItem);this._scrollToBottom(this._availableList);this._enableButtons(false);}}this._serializeSelected();},_moveItemUp:function(){if(this._selectedItem){var _4e=this._selectedItem;do{_4e=_4e.previousSibling;}while(_4e&&_4e.nodeType!=1);if(_4e){dojo.place(this._selectedItem,_4e,"before");this._serializeSelected();}}},_moveItemDown:function(){if(this._selectedItem){var _4f=this._selectedItem;do{_4f=_4f.nextSibling;}while(_4f&&_4f.nodeType!=1);if(_4f){dojo.place(this._selectedItem,_4f,"after");this._serializeSelected();}}},_serializeSelected:function(){var _50=[];var lis=this._selectedList.getElementsByTagName("li");for(var i=0;i<lis.length;i++){_50.push(lis[i].idx);}this._inputField.value=_50.join(",");}});}if(!dojo._hasResource["drupal.form.Editor"]){dojo._hasResource["drupal.form.Editor"]=true;dojo.provide("drupal.form.Editor");dojo.declare("drupal.form.Editor",dijit._Widget,{showToggle:true,defaultState:false,plugins:null,_styleSheets:null,_textareaID:null,_containerTextArea:null,_containerEditor:null,_editor:null,_toggleLink:null,_grip:null,_offset:0,_mouseMove:null,_mouseUp:null,postCreate:function(){var ss=[];for(var i=0,a=null,_56=dojo.query("link");a=_56[i];i++){var rel=a.getAttribute("rel");if(rel&&rel.indexOf("style")!=-1&&!a.disabled){var h=a.getAttribute("href");if(h&&!ss[h]){ss[h]=h;}}}var _59=/@import\s*['"]?([\t\s\w-()\/.\\:#=&?]+)/i;var _5a=/url\(\s*([\t\s\w()\/.\\'"-:#=&?]+)\s*\)/i;for(var i=0,a=null,_56=dojo.query("style");a=_56[i];i++){var _5b=a.getAttribute("type");var _5c=a.getAttribute("media");if(_5b&&_5b.toLowerCase()=="text/css"&&(!_5c||_5c.toLowerCase()!="print")&&!a.disabled&&a.innerHTML.indexOf("@import")!=-1){var _5d=_59.exec(a.innerHTML);if(_5d&&_5d.length>1){var str=_5d[1].replace(/(^\s*|\s*$)/g,"");_5d=_5a.exec(str);if(_5d&&_5d.length>1){str=_5d[1].replace(/(^\s*|\s*$)/g,"");}if(!ss[str]){ss[str]=str;}}}}var _5f=location.protocol+"//"+location.host;this._styleSheets=[];for(var k in ss){this._styleSheets.push(_5f+k);}this._textareaID=this.domNode.id;var cta=document.createElement("div");cta.className="resizable-textarea";dojo.place(cta,this.domNode,"after");cta.appendChild(this.domNode);this._containerTextArea=cta;var _62=document.createElement("div");_62.className="grippie";cta.appendChild(_62);dojo.connect(_62,"onmousedown",this,"_startDrag");var ce=document.createElement("div");ce.className="dijitEditor";dojo.place(ce,cta,"after");dojo.style(ce,"display","none");this._containerEditor=ce;if(this.showToggle){var a=document.createElement("a");a.href="#";a.innerHTML="Enable rich text editor";dojo.connect(a,"onclick",this,"_toggleEditor");this._toggleLink=a;var d=document.createElement("div");d.appendChild(a);dojo.place(d,ce,"after");}if(this.defaultState){this._toggleEditor();}},_toggleEditor:function(evt){if(evt){dojo.stopEvent(evt);}if(this._editor){this._onEditorBlur();this._editor.destroy();this._editor=null;dojo.style(this._containerTextArea,"display","");dojo.style(this._containerEditor,"display","none");this._setToggleLink("Enable rich text editor");}else{this._containerEditor.innerHTML=this.domNode.value;dojo.style(this._containerTextArea,"display","none");dojo.style(this._containerEditor,"display","");this._editor=new dijit.Editor({toolbarAlwaysVisible:true,focusOnLoad:true,minHeight:"15em",height:"",plugins:this.plugins,extraPlugins:["dijit._editor.plugins.AlwaysShowToolbar"],editingAreaStyleSheets:this._styleSheets,contentPreFilters:[function(txt){return txt.replace(/\n/g,"<br/>");};],contentPostFilters:[function(txt){return txt.replace(/\<br\s*\/?\>/ig,"\n");};]},this._containerEditor);dojo.query("html",this._editor.document)[0].className="dijitEditorInner";dojo.connect(this._editor,"onBlur",this,"_onEditorBlur");setTimeout(dojo.hitch(this,function(){this._editor.onClick();}),1000);this._setToggleLink("Disable rich text editor");}},_onEditorBlur:function(){var s=dojo.isFunction(this._editor.getValue)?this._editor.getValue():this._editor.getEditorContent();this.domNode.value=s.replace(/contenteditable="true"/ig,"");},_setToggleLink:function(str){if(this._toggleLink){this._toggleLink.innerHTML=str;}},_startDrag:function(evt){dojo.stopEvent(evt);this._offset=dojo.coords(this.domNode).h-evt.pageY;dojo.style(this.domNode,"opacity",0.25);this._mouseMove=dojo.connect(document,"onmousemove",this,"_onDrag");this._mouseUp=dojo.connect(document,"onmouseup",this,"_endDrag");},_onDrag:function(evt){this.domNode.style.height=Math.max(32,this._offset+evt.pageY)+"px";},_endDrag:function(){dojo.disconnect(this._mouseMove);dojo.disconnect(this._mouseUp);dojo.style(this.domNode,"opacity",1);}});}if(!dojo._hasResource["drupal.form.GoogleMapKeyTable"]){dojo._hasResource["drupal.form.GoogleMapKeyTable"]=true;dojo.provide("drupal.form.GoogleMapKeyTable");dojo.declare("drupal.form.GoogleMapKeyTable",[dijit.form._FormWidget,dijit._Templated],{templateString:"<div><table class=\"dojoGoogleMapsKeyTable\" dojoAttachPoint=\"_table\"><thead><th colspan=\"2\">URL</th><th>Key</th></thead><tbody dojoAttachPoint=\"_tbody\"></tbody></table><div><a dojoAttachEvent=\"onclick:_addKey\" href=\"#\">Add new key</a></div><input type=\"hidden\" dojoAttachPoint=\"_saveField\" /></div>",_counter:0,_keys:[],_table:null,_tbody:null,_saveField:null,postCreate:function(){var _6c=this.srcNodeRef;this._saveField.name=_6c.name;this._saveField.id=_6c.id;this._saveField.value=_6c.value;var _6d=_6c.value.split("|");for(var i=0;i<_6d.length;i++){if(_6d[i].length){var p=_6d[i].indexOf(",");this._buildRow(_6d[i].substring(0,p),_6d[i].substring(p+1));}}this._displayTable();},_fillContent:function(){},_buildRow:function(key,url){var idx=this._counter++;var _73=document.createElement("td");_73.innerHTML="http:// ";var _74=document.createElement("td");_74.style.width="40%";_74.appendChild(this._buildInput("url",url,idx));var _75=document.createElement("td");_75.style.width="60%";_75.appendChild(this._buildInput("key",key,idx));var _76=document.createElement("td");var a=document.createElement("a");a.href="#";a.idx=idx;a.innerHTML="delete";dojo.connect(a,"onclick",this,"_deleteKey");_76.appendChild(a);var tr=document.createElement("tr");tr.className=idx%2==0?"even":"odd";tr.appendChild(_73);tr.appendChild(_74);tr.appendChild(_75);tr.appendChild(_76);this._tbody.appendChild(tr);setTimeout(function(){dojo.query(":last-child",_74)[0].focus();},100);this._keys.push({idx:idx,key:key,url:url,row:tr});},_buildInput:function(_79,_7a,idx){var i=document.createElement("input");i.className="form-text";i.type="text";i.value=_7a;i.fieldType=_79;i.idx=idx;dojo.connect(i,"onblur",this,"_updateKey");return i;},_addKey:function(evt){dojo.stopEvent(evt);this._buildRow("","");this._displayTable();},_deleteKey:function(evt){dojo.stopEvent(evt);for(var i=0;i<this._keys.length;i++){if(this._keys[i].idx==evt.target.idx){dojo._destroyElement(this._keys[i].row);this._keys.splice(i,1);}}var j=0;dojo.query("tr",this._tbody).forEach(function(e){e.className=j++%2==0?"even":"odd";});this._serialize();this._displayTable();},_displayTable:function(){dojo.style(this._table,"display",this._keys.length>0?"":"none");},_updateKey:function(evt){var t=evt.target;for(var i=0;i<this._keys.length;i++){if(this._keys[i].idx==t.idx){this._keys[i][t.fieldType]=dojo.string.trim(t.value);this._serialize();break;}}},_serialize:function(){var b="";for(var i=0;i<this._keys.length;i++){this._keys[i].key=dojo.string.trim(this._keys[i].key);this._keys[i].url=dojo.string.trim(this._keys[i].url);if(this._keys[i].key.length||this._keys[i].url.length){b+=(b.length?"|":"")+this._keys[i].key+","+this._keys[i].url;}}this._saveField.value=b;}});}if(!dojo._hasResource["drupal.form.SvnTree"]){dojo._hasResource["drupal.form.SvnTree"]=true;dojo.provide("drupal.form.SvnTree");dojo.declare("drupal.form.SvnTree",dijit._Widget,{_tree:null,postCreate:function(){var _87=this;var _88="dojoSvnTreeFolderOpened";var _89="dojoSvnTreeFolderClosed";var d=document.createElement("div");dojo.place(d,this.domNode,"after");this._tree=new dijit.Tree({query:{type:"dir"},labelAttr:"name",typeAttr:"type",store:new drupal.data.SvnStore({url:"/dojo/svn"}),getIconClass:function(){return _89;}},d);dojo.connect(this._tree,"addChild",this,"_createToolTip");dojo.subscribe(this._tree.id,null,function(e){var n=e.node;if(/^toggleOpen$|^zoomIn$|^zoomOut$/i.test(e.event)){var b=(n.isExpanded||/loading/i.test(n.state));dojo.removeClass(n.iconNode,b?_89:_88);dojo.addClass(n.iconNode,b?_88:_89);}else{if(e.event=="execute"){_87.domNode.value=n.item.id;}}});dojo.addClass(this._tree.domNode,"dojoSvnTree");},_createToolTip:function(_8e){var d=document.createElement("div");d.innerHTML="<div><strong>"+_8e.label+"</strong></div><div>Revision: "+_8e.item.revision+"</div><div>Author: "+_8e.item.author+"</div><div>Date: "+_8e.item.date+"</div>";dojo.style(d,"display","none");dojo.place(d,self.domNode,"after");_8e.labelNode.id="node"+Math.round(Math.random()*10000000);var t=new dijit.Tooltip({connectId:_8e.labelNode.id},d);dojo.connect(_8e,"addChild",this,"_createToolTip");}});}if(!dojo._hasResource["drupal.layout.CollapsiblePane"]){dojo._hasResource["drupal.layout.CollapsiblePane"]=true;dojo.provide("drupal.layout.CollapsiblePane");dojo.declare("drupal.layout.CollapsiblePane",dijit._Widget,{_wrapper:null,_animating:false,postCreate:function(){var _91=dojo.query("legend",this.domNode)[0];var a=document.createElement("a");a.href="#";a.innerHTML=_91.innerHTML;dojo.connect(a,"onclick",dojo.hitch(this,function(evt){dojo.stopEvent(evt);if(!this._animating){this._animating=true;this._toggleFieldset();}}));while(_91.firstChild){dojo._destroyElement(_91.firstChild);}_91.appendChild(a);var d=document.createElement("div");d.className="fieldset-wrapper";dojo.style(d,"display",dojo.hasClass(this.domNode,"collapsed")?"none":"");var _95=this.domNode.childNodes;for(var j=0;j<_95.length;j++){if(_95[j].nodeType!=1||!/legend/i.test(_95[j].nodeName)){d.appendChild(_95[j--]);}}this.domNode.appendChild(d);this._wrapper=d;},_toggleFieldset:function(){var n=this.domNode;if(dojo.hasClass(n,"collapsed")){n.className=n.className.replace(/ collapsed/i,"");var _98=dojo.fx.wipeIn({node:this._wrapper,duration:300});dojo.connect(_98,"onEnd",dojo.hitch(this,function(){this._wrapper.style.height="auto";this._scrollIntoView();this._animating=false;}));dojo.connect(_98,"onAnimate",this,"_scrollIntoView");_98.play();}else{var _98=dojo.fx.wipeOut({node:this._wrapper,duration:300});dojo.connect(_98,"onEnd",dojo.hitch(this,function(){n.className+=" collapsed";this._animating=false;}));_98.play();}},_scrollIntoView:function(){var n=this.domNode;var vh=dijit.getViewport().height;var c=dojo.coords(n,true);var ny=c.y;var nh=c.height;if(ny+nh+55>vh+dojo._docScroll().top){window.scrollTo(0,(nh>vh?ny:ny+nh-vh+55));}}});}if(!dojo._hasResource["drupal.drupal"]){dojo._hasResource["drupal.drupal"]=true;dojo.provide("drupal.drupal");}