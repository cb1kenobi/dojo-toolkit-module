*******************************************************************************
Introduction
*******************************************************************************

The Dojo Module provides two build profiles: one for CDN builds and one for
local builds.  In order to perform a custom Dojo build, you need to download
the source from the Dojo Toolkit's website.

These instructions are intended for Linux/Unix like systems, but the concepts
should work under Windows.  The $ signifies the command prompt.

*******************************************************************************
Downloading the Dojo source
*******************************************************************************

In order to perform a custom Dojo build, download the source release from:

  http://download.dojotoolkit.org/release-0.9.0/dojo-release-0.9.0-src.tar.gz

Save the file in the Dojo Module's directory, then extract the files:

  $ tar xvfz dojo-release-0.9.0-src.tar.gz

*******************************************************************************
Building The dojo-module-local Profile
*******************************************************************************

Go to the buildscripts directory:

  $ cd dojo-release-0.9.0-src/util/buildscripts

Then execute the build:

  $ ./build.sh profileFile=../../../profiles/dojo-module-local.profile.js \
     action=clean,release version=0.9.0-2.0 releaseDir=../../../ \
     releaseName=MyBuild

You can change the "releaseName" to whatever you like, but don't use spaces.
When the build completes, go to the Dojo Module settings page and create a
build profile.  From the Dojo Build field, select your new build from the menu.

*******************************************************************************
Building The dojo-module-cdn Profile
*******************************************************************************

Go to the buildscripts directory:

  $ cd dojo-release-0.9.0-src/util/buildscripts

Then execute the build:

  $ ./build.sh profileFile=../../../profiles/dojo-module-cdn.profile.js \
    releaseName=delete-me action=clean,release loader=xdomain \
    xdDojoPath=http://o.aolcdn.com/dojo/0.9.0 version=0.9.0-2.0-xdomain

This will put the following files in the dojo-release-0.9.0-src/release
directory:

  DojoModuleAdmin.js
  DojoModuleAdmin.js.uncompressed.js
  DojoModuleAdmin.xd.js
  DojoModuleAdmin.xd.js.uncompressed.js
  DojoModuleMain.js
  DojoModuleMain.js.uncompressed.js
  DojoModuleMain.xd.js
  DojoModuleMain.xd.js.uncompressed.js

Since we only care about the compressed .xd versions, we are interested in:

  DojoModuleAdmin.xd.js
  DojoModuleMain.xd.js

Due to limitations in the build system, you must manually add the requires
to these two build files.  At the beginning of these files is an array of
provide()'s and we need to add the requires to the array.  The requires are
different for each file.

DojoModuleAdmin.xd.js
---------------------
Locate the following code which is actually on a single line:

  depends:[
    ["provide","drupal.form.AutoComplete"],
    ["provide","drupal.form.Editor"],
    ["provide","drupal.layout.CollapsiblePane"],
    ["provide","drupal.DojoModuleMain"]
  ]

After the last provide statement, change it so it looks like:

  depends:[
    ["provide","drupal.form.AutoComplete"],
    ["provide","drupal.form.Editor"],
    ["provide","drupal.layout.CollapsiblePane"],
    ["provide","drupal.DojoModuleMain"],
    ["require","dijit._Widget"],
    ["require","dijit._Templated"],
    ["require","dijit.form._FormWidget"],
    ["require","dijit.Dialog"],
    ["require","dijit.Tooltip"],
    ["require","dijit.Tree"],
    ["require","dojo.data.ItemFileWriteStore"]
  ]

Don't forget to put a comma after the last provide statement.  You'll want to
make those changes on a single line.

DojoModuleMain.xd.js
--------------------
Locate the following code which is actually on a single line:

  depends:[
    ["provide","drupal.form.AutoComplete"],
    ["provide","drupal.form.Editor"],
    ["provide","drupal.layout.CollapsiblePane"],
    ["provide","drupal.DojoModuleMain"]
  ]

After the last provide statement, change it so it looks like:

  depends:[
    ["provide","drupal.form.AutoComplete"],
    ["provide","drupal.form.Editor"],
    ["provide","drupal.layout.CollapsiblePane"],
    ["provide","drupal.DojoModuleMain"],
    ["require","dojo.fx"],
    ["require","dijit._Widget"],
    ["require","dijit.Editor"],
    ["require","dijit._editor.plugins.AlwaysShowToolbar"],
    ["require","dijit._editor.plugins.EnterKeyHandling"],
    ["require","dijit._editor.plugins.LinkDialog"],
    ["require","dojox.collections.ArrayList"]
  ]

Don't forget to put a comma after the last provide statement.  You'll want to
make those changes on a single line.

After the requires have been added, move the DojoModuleAdmin.xd.js and
DojoModuleMain.xd.js files to the "drupal" directory in the Dojo Module
directory.  You may delete the "release" directory in the
dojo-release-0.9.0-src directory.

When the build completes, go to the Dojo Module settings page and create a
build profile.  From the Dojo Build field, select your new build from the menu.
