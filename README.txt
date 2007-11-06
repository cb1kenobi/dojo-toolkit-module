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

After the Dojo Toolkit Module is configured, you can use Dojo in your content,
modules or themes.  But wait, there's more!  Now you can also start using other
Drupal modules and themes that benefit from Dojo!

For the latest version and documentation, please visit:

  http://cb1inc.com/open-source/dojo-toolkit-module

*******************************************************************************
Compatibility
*******************************************************************************

This module has been developed and tested on the following configuration:
 - Drupal 5.1 and PHP 5.1.8 on Linux
 - Drupal 5.2 and PHP 5.2.1 on Linux

It has not been tested with Windows, so it is very possible it won't work.
There are portions of PHP code that rely on PHP 5, but with minor changes
should work with PHP 4.

This module also includes a front-end to the Dojo Subversion repository.  In
order for this functionality to work, you must have the Subversion command-line
client installed.

*******************************************************************************
Install
*******************************************************************************

1. Extract the Dojo Toolkit Module into your Drupal modules directory.

2. Enable the Dojo Toolkit Module on the [Administer > Site building > Modules]
   page.

3. Go to the [Administer > Site configuration > Dojo Toolkit] page to define
   your config and editor profiles.  Refer to the online documentation for more
   information about how to configure and use the Dojo Toolkit Module.

*******************************************************************************
Upgrading
*******************************************************************************

1. Backup your existing "dojo" module directory.

2. Extract the Dojo Toolkit Module into your Drupal modules directory.

3. Go to the [Administer > Site configuration > Dojo Toolkit] page, then
   re-save each build profile.  Next, re-save each editor profile, but before
   saving, restore the default toolbar settings and redefine them.  Refer to
   the online documentation for more information about how to configure and use
   the Dojo Toolkit Module.

*******************************************************************************
Custom Builds
*******************************************************************************

You can perform a custom build of Dojo which will greatly improve the speed of
your site on pages that use Dojo.  Please refer to the README.txt file in the
"profiles" directory for instructions.

*******************************************************************************
License
*******************************************************************************

The Dojo Toolkit Module is licensed under the AFL and BSD licenses.  This
code does *not* include the actual Dojo Toolkit code.  Please refer to the
LICENSE.txt for more information.

Copyright (c) 2006-2007, Chris Barber <chris at cb1inc dot com>
CB1, INC. http://cb1inc.com
All Rights Reserved.
