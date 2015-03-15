Version 2.1

  * Upgraded Dojo code to Dojo 1.0.0
  * Added option to force Dojo to load on all pages
  * Fixed bug with applying profile weights
  * Fixed bug with Dojo Toolkit Module settings page in IE
  * Fixed bug displaying duplicate roles for each profile on settings page
  * Fixed typos in documentation
  * Added stripos() function for PHP4 users

Version 2.0

  * Added support for Dojo 0.9.0
  * Added support for defining a Dijit theme
  * Includes build profiles for local and CDN custom builds
  * Fixed bug with support for prefixed table names

Version 1.2

  * Added uninstall logic
  * Fixed access roles for both config and editor profiles
  * Fixed visibility for both config and editor profiles
  * Fixed tree images pre-loading URLs on Subversion repository page
  * Added support for Dojo Toolkit 0.4.3
  * Added ability to tie config profiles to pages
  * Removed support for djConfig.debugAtAllCosts

Version 1.1

  * Added the Dojo Module to the Status Report page
  * Added dojo\_register\_module\_path\_js($module, $path) helper function for adding Dojo module paths
  * Added ability to disable Dojo enhanced form elements (see note below)
  * Fixed bug when editing profiles with a name that contains a forward slash
  * Cleaned up deprecated code in the Editor widget

Important Note: If you are upgrading from v1.0, Dojo form elements (rich text editor, collapsible panes, & autocomplete fields) will be turned off. Just resave your config profiles with those features enabled.
Version 1.0

This is the initial public release. Features include:

  * Rewritten resizable textarea, collapsible pane, and autocomplete to use Dojo instead of jQuery
  * Allows resizable textareas to become rich text editors
  * Ability to add multiple config profiles to control Dojo build, debugging, and more
  * Ability to add multiple editor profiles to control visibility options, toolbars, and more
  * Web front-end to Dojo's Subversion repository
  * Auto discovery of Dojo builds and Dojo module paths