# Where Should I Use Dojo? #

There's lots of places you can put Dojo code:

  * Use it in a page's content
  * Use it in a module
  * Use it in a theme
  * Use it in a block

The uses for Dojo are virtually endless. As long as the Dojo Module is enabled, you don't need to worry about including the Dojo Javascript files or module paths.

# Dojo 1.0 #
The examples on this page use Dojo 1.0.

# Creating Dojo in Your Content #

Dojo has some really neat widgets that you can use pretty easily. For example, let's have some fun with the FisheyeList widget. Create a page and for the content, enter the following:

```
<script type="text/javascript">
dojo.require("dojox.widget.FisheyeList");
</script>
<style type="text/css">
.dojoxFisheyeListItemLabel {
	font-family: Arial, Helvetica, sans-serif;
	background-color: #eee;
	border: 2px solid #666;
	padding: 2px;
	text-align: center;
	position: absolute;
	display: none;
	white-space: pre; 
}
.dojoxFisheyeListItemLabel.dojoxFishSelected { display: block; }
.dojoxFisheyeListItemImage { border: 0px; position: absolute; }
.dojoxFisheyeListItem { position: absolute; z-index: 2; }
.dojoxFisheyeListBar { position: relative; margin: 0 auto; text-align: center; }
.outerbar { background-color: #666; text-align: center; border: 1px solid #333; }
</style>
<div class="outerbar">
<div dojoType="dojox.widget.FisheyeList" itemWidth="50" itemHeight="50"
    itemMaxWidth="200" itemMaxHeight="200" orientation="horizontal" effectUnits="2"
    itemPadding="10" attachEdge="top" labelEdge="bottom" id="fisheye1">
  <div dojoType="dojox.widget.FisheyeListItem" id="item1" label="Item 1"
      onclick="alert('click on ' + this.label + ' (from widget id ' + this.id + ')!');"
      iconSrc="/sites/all/modules/dojo/MyBuild/dojox/widget/tests/images/icon_browser.png">
  </div>
  <div dojoType="dojox.widget.FisheyeListItem" label="Item 2"
      iconSrc="/sites/all/modules/dojo/MyBuild/dojox/widget/tests/images/icon_calendar.png">
  </div>
  <div dojoType="dojox.widget.FisheyeListItem" label="Item 3"
      onclick="alert('click on ' + this.label + ' (from widget id ' + this.id + ')!');"
      iconSrc="/sites/all/modules/dojo/MyBuild/dojox/widget/tests/images/icon_email.png">
  </div>
  <div dojoType="dojox.widget.FisheyeListItem"
      iconSrc="/sites/all/modules/dojo/MyBuild/dojox/widget/tests/images/icon_texteditor.png">
  </div>
  <div dojoType="dojox.widget.FisheyeListItem" label="Really Long Item Label"
      iconSrc="/sites/all/modules/dojo/MyBuild/dojox/widget/tests/images/icon_update.png">
  </div>
  <div dojoType="dojox.widget.FisheyeListItem"
      iconSrc="/sites/all/modules/dojo/MyBuild/dojox/widget/tests/images/icon_users.png">
  </div>
</div>
</div>
<div style="clear:both;"></div>
```

You may need to change the iconSrc paths to reflect your directory structure. Save the page and check out the neat FisheyeList!

# Using Dojo in a Module's Form #

Probably the most powerful use of Dojo is to create widgets that can provide a better user interface than the simple form elements Drupal allows.

So, let's create a module called "dojodemo". The module is going to have a form where you enter your birthday. We are going to create 3 interations:

  * Create the form with a standard input field and no Dojo stuff
  * Add a Dojo date picker to the text field
  * Modularize the date picker text field for reuse

First, let's create the .info file:

```
; /sites/all/modules/dojodemo/dojodemo.info
name = "Dojo Demo Module"
description = "Demo of the Dojo Drupal module"
version = "1.0"
dependencies = dojo
```

Now let's create the .module file:

```
<?php
// /sites/all/modules/dojodemo/dojodemo.module

// first we create our hook_menu
function dojodemo_menu($may_cache) {
  $items = array();
  if ($may_cache) {
    $items[] = array(
      'path' => 'dojodemo',
      'title' => 'Dojo Demo!',
      'callback' => 'drupal_get_form',
      'callback arguments' => array('dojodemo_myform'),
      'access' => TRUE
    );
  }
  return $items;
}

// version 1 of the form with no Dojo
function dojodemo_myform() {
  $form = array();
  $form['birthday'] = array(
    '#type' => 'textfield',
    '#title' => t('Enter your birthday')
  );
  return $form;
}
```

Enable the module and take a peek. At this point the form looks pretty boring.

### !! Start of out-of-date info !! ###

Now, let's add a Dojo date picker widget. Most Drupal form elements support a '#suffix' argument and we'll use this to dump our Javascript code.

```
// version 2 of the form with Dojo
function dojodemo_myform() {
  $form = array();
  // note that in this version we have to give the form element
  // an '#id' so Dojo knows which form element to update
  $form['birthday'] = array(
    '#id' => 'birthday',
    '#type' => 'textfield',
    '#title' => t('Enter your birthday'),
    '#suffix' => <<<EOD
<div id="datepicker"></div>

<!-- need to override table styles defined by the theme -->
<style type="text/css">
  .datePickerContainer table { margin: 0; }
  .datePickerContainer td, .datePickerContainer th { padding: 0; }
  .datePickerContainer tbody { border: 0; }
</style>

<script type="text/javascript">
// tell Dojo to load the DatePicker widget
dojo.require("dijit.DatePicker");

// when the page loads, create the DatePicker widget and then
// connect an event to DatePicker that updates the text field
// when a date is selected
dojo.addOnLoad(function() {
  var w = dojo.widget.createWidget("DatePicker", {}, dojo.byId("datepicker"));
  dojo.connect(w, 'onValueChanged', function() {
    dojo.byId("birthday").value = w.getValue();
  });
});
</script>
EOD;
  return $form;
}
```

Save the module and reload the page and you'll see we have a cool date picker now. When you click the date, it will dump the value in the field.

But what if you want to reuse this on all pages? Not a problem. Drupal has an "elements" hook that gets fired every time a field is created on all pages. In order for this to work, we are going to add our own key to the form element called #dojo-datepicker. Any time a field with that key is created, it will create our data picker version. Below is the third version of our form and the elements hook.

```
function dojodemo_myform() {
  $form = array();
  $form['birthday'] = array(
    '#dojo-datepicker' => TRUE,
    '#type' => 'textfield',
    '#title' => t('Enter your birthday')
  );
  return $form;
}

function dojodemo_elements() {
  $type = array();
  $type['textfield'] = array('#process' =>
    array('dojodemo_process_textfield' => array())
  );
  return $type;
}

function dojodemo_process_textfield($element) {
  if ($element['#dojo-datepicker']) {
    // use the Dojo Module's helper function to require the Dojo
    // files this will ensure the DatePicker is only requested
    // once to load per page
    dojo_require_js('dijit.DatePicker');

    // get the element's id and if doesn't have one, generate one
    $elem_id = $element['#id'];
    if (!$elem_id) {
      $elem_id = 'temp_id_' . md5(mt_rand());
      $element['#attributes']['id'] = $elem_id;
    }

    // generate a unique id for our placeholder div
    $div_id = 'temp_id_' . md5(mt_rand());

    $element['#suffix'] .= <<<EOD
<div id="$div_id"></div>

<!-- need to override table styles defined by the theme -->
<style type="text/css">
.datePickerContainer table { margin: 0; }
.datePickerContainer td, .datePickerContainer th { padding: 0; }
.datePickerContainer tbody { border: 0; }
</style>

<script type="text/javascript">
// when the page loads, create the DatePicker widget and then
// connect an event to DatePicker that updates the text field
//  when a date is selected
dojo.addOnLoad(function(){
  var w = dojo.widget.createWidget("DatePicker", {}, dojo.byId("$div_id"));
  dojo.connect(w, 'onValueChanged', function() {
    dojo.byId("$elem_id").value = w.getValue();
  });
});
</script>
EOD;
  }
  return $element;
}
```

That's not so bad, was it?

### !! End of out-of-date info !! ###

# Dojo Module Helpers #

There are 4 functions that the Dojo Toolkit Module defines that are really helpful:

**dojo\_add\_js($data, $type)**

This function is just like drupal\_add\_js(), except it forces it to be added to the header only. Additionally, it will check the current config profile and see if it should allow jQuery to be loaded. If you need to output some Javascript code or include a external script that references Dojo, you should use this function instead of Drupal's.

**dojo\_register\_module\_path\_js($module, $path)**

This functions allows you to tell Dojo where to find your custom namespaces. For example, say you have a module called "test" and you'd like to use a Dojo widget called "MyWidget", then you would do something like this:

```
// PHP
dojo_register_module_path_js('test', drupal_get_path('module', 'test'));
dojo_require_js('test.MyWidget');
// now you your Javascript you can do:
//   var myWidget = new test.MyWidget();
```

**dojo\_require\_js($package)**

This function will add the dojo.require() in the page header and will ensure that it is only added once. You will need to require all Dojo packages that you want to use, so this will come in handy.

**dojo\_create\_widget\_js($element, $type, $params = NULL)**

This function will help create a widget and assumes that the $element is the placeholder. If the element does not have an ID, one will be generated. $type is the name of the widget to be created such as "DatePicker" or "cb1:MyWidget". $params is an optional argument that must be a simple value or array that will be serialized into JSON and passed into the widget.

This is meant to be used for simple scenarios. There are circumstances where you may need more control over the widget creation process and you will need to write your own function.

# What next? #

That's up to you! Be creative. Read code in the Dojo examples and tests as well as the code behind the Dojo Module. There's lots of good stuff in there, so have fun with it!