# The Default Config Profile #

You don't have to set up a config profile, but if you want to use a local Dojo build or enable debugging, you are going to have to bite the bullet and create yourself a config profile.

# Creating Your First Config Profile #

Begin by clicking the "Add new config profile" link. The config profile is divided into a bunch of groups.

## General Information ##

Give the profile a unique and beautiful name.

## Access Roles ##

You must tie the profile to at least one access role. Since it's possible to associate more than one config profile to a single access role, you can use the handy Access Weight to influence which profile should be used.

## Dijit Theme ##

Dijit is Dojo's widget system that was first introduced in Dojo 0.9. You can specify the name of the theme's class. This value is appended to the body's class attribute, so you can space delimit other classes if you'd like.
Visibility

This provides similar functionality as seen elsewhere in Drupal. Using the text area, enter the pages to use or not use this build profile.

## Toolkit Loading ##

By default, Dojo allows jQuery to load even though it is probably unnecessary since most of the jQuery functionality has been rewritten to use Dojo. So, unless you are using jQuery in a theme, module, or some content, it's probably best to only load Dojo. On the few pages Dojo does not replace jQuery, jQuery will automatically be loaded.

You may also choose which form elements you want to use the Dojo version instead of the original jQuery version. You may want to disable a particular Dojo form element as a workaround if there is a bug with the Dojo version. By not enabling the Dojo version of those elements, jQuery will need to be loaded and could slow the user's browser down.

Finally there is an option to force Dojo to load on all pages or only pages that require it. In the case that you want to use Dojo inside your content, it's best to force Dojo to load on every page. You'll want to make sure that your web server is configured properly to tell the browsers to cache the Dojo files.

## Dojo Build ##

Dojo is made up of a bunch of Javascript files. Downloading a bunch of Javascript files is slow, so selected Javascript files can be combined into a single file called a "build".

There are two types of builds: XDomain and local builds. The CDN build the default build used by the Dojo Toolkit Module and is hosted on AOL's Content Delivery Network. A local build is where you download Dojo and put the files on the server.

In order to do a local build, you must download the Dojo source release from the Dojo Toolkit download site:

  * http://download.dojotoolkit.org/release-1.0.0/dojo-release-1.0.0-src.tar.gz (14.5MB)

Extract the Dojo tarball into the Dojo Toolkit Module directory. I renamed my folder to "dojo-1.0", but it does't really matter. The source distribution of Dojo is actually not a build. That means that every single Dojo package is loaded on demand. This can have huge performance issues and so it is highly recommended you do a custom build. Please refer to the [Creating a Custom Build](CreatingCustomBuild.md) page for more information.

## Dojo Configuration ##

Before Dojo's Javascript files are loaded, a variable called djConfig is defined which tells Dojo important information about it's environment such as Dojo module paths. Additional settings may also be set include:

  * Debug: when enabled, prints Dojo debug messages.
  * Parse Widgets: when enabled, Dojo will scan the entire DOM tree at page load to find any widgets that need to be created. If you aren't declaratively using widgets, then you could turn this off and save a few milliseconds of processing time, but it won't hurt to enable it.
  * Google Map Key: if you want to use the Dojo Google Map Widget, you will need to enter all domain names that reference the site and each domain name's corresponding key. NOTE: as of Dojo 1.0.0, Dojo's Google Map Widget has not been ported to Dojox, but it's on the radar, so this feature will be patiently awaiting it's return.

# Setting Up Several Profiles #

One of the great things about the config profiles is you can set up one profile tied to an access role where users can see the debug messages and possibly use an alternative Dojo build and then set up another profile where everybody else has debug messages off.
Dojo Build Directories

The Dojo Toolkit Module will scan all subdirectories of its folder for any directory containing a file that begins with "dojo" and ends with ".js" exists within the the first 6 levels of folders. If it finds a dojo**.js, then it will assume that directory contains the Dojo Toolkit code base. These directories are displayed in the Dojo Build drop down list.**

# Custom Dojo Module Paths #

Often you will want to write your own Dojo widgets and modules. Since it's not the best idea to intermix your code in the same directory as Dojo's code, you can create your own namespace by creating a directory in either of the following directories:

  * All Sites directory: /sites/all
  * Specific Sites directory: /sites/<your site>

For example, all of CB1's Dojo code for CB1, INC. go in "/sites/default/cb1" directory. The namespace would be "cb1". You can name the directory whatever you like. The path is automatically discovered and added to the djConfig variable. Then you just require your package like dojo.require("cb1.myPackage") and Dojo will automatically load it.

To declare a folder as your Dojo namespace, create an empty file called ".dojo" and the Dojo Toolkit Module will know to add it to the djConfig. You may have as many directories/namespaces as you'd like. Refer to Dojo's documentation for more information about creating your own custom modules and widgets.