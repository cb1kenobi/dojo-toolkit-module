*******************************************************************************
Dojo Toolkit Module
*******************************************************************************
The Dojo Toolkit (http://dojotoolkit.org) is the open source Javascript toolkit
that makes professional web development better, easier, and faster. This module
enhances Drupal by allowing content and modules to use the Dojo Toolkit to
create advanced functionality and user interfaces.

Once this module is enabled, you can immediately benefit from Dojo's rich text
editor.  To better control settings, you can define Config Profiles and Editor
Profiles and associate them to access roles.

After the Dojo Toolkit module is configured, you can use Dojo in your content,
modules or themes.  But wait, there's more!  Now you can also start using other
Drupal modules and themes that benefit from Dojo!

For the latest version and documentation, please visit:

  http://cb1inc.com/projects/drupal/dojo-module

*******************************************************************************
Compatibility
*******************************************************************************
This module has been developed and tested on Drupal 5.1 and PHP 5.1.6 on Linux.

This module also includes a front-end to the Dojo Subversion repository.  In
order for this functionality to work, you must have the Subversion command-line
client installed.  This feature has only been tested with the Linux version.

*******************************************************************************
Install
*******************************************************************************
1. Extract the Dojo Toolkit Module into your Drupal modules directory.

2. Enable the Dojo Toolkit Module on the [Administer > Site building > Modules]
   page.

3. Go to the [Administer > Site configuration > Dojo Toolkit] page to define
   your config and editor profiles.  Refer to the online documentation for more
   information about how to configure and use the Dojo Toolkit module.

*******************************************************************************
Patching Dojo
*******************************************************************************
Not everything is perfect including the Dojo 0.9 release.  If you download a
local copy of Dojo, and want the SVN repository to work, you need to manually
patch the file /dojo-release-0.9.0/dijit/_tree/Controller.js.

Find and replace

    function onItem(item){
        if(--_waitCount == 0){
            // all nodes have been loaded, send them to the tree
            node.unmarkProcessing();
            _this._onLoadAllItems(node, childItems);
        }
    }

with

    function onItem(item){
        if(--_waitCount == 0){
            // all nodes have been loaded, send them to the tree
            childItems = store.getValues(parentItem, _this.childrenAttr);
            node.isFolder = childItems.length > 0;
            node.unmarkProcessing();
            if (node.isFolder) {
                _this._onLoadAllItems(node, childItems);
            }
        }
    }

*******************************************************************************
License
*******************************************************************************
The Dojo Toolkit Module is licensed under GPL version 2.  This module does
*not* include the actual Dojo Toolkit code, which is licensed under the
Academic Free License v2.1.

*******************************************************************************
Credits
*******************************************************************************
Developed by Chris Barber <chris at cb1inc dot com>
CB1, INC. http://cb1inc.com
