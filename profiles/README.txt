*******************************************************************************
Introduction
*******************************************************************************

In order to perform a custom Dojo build, you need to download the source from
the Dojo Toolkit's website.  The Dojo Module provides two build profiles:

1. dojo-0.9.0.profile.js
   This build will create two files dojo-module-public.js and
   dojo-module-admin.js.  The dojo-module-public.js contains the Dojo Module
   Javascript code that is on public facing pages plus the required Dojo, Dijit,
   and Dojox packages.  The second file is dojo-module-admin.js and contains
   the Dojo Module Javascript code that is on Dojo Module settings pages.  This
   profile is ideal for local builds.

2. dojo-module.profile.js
   This build will create a single dojo-module.js that bundles up all of the 
   Javascript for the Dojo Module.  This profile comes with the Dojo Module and
   is ideal when using a CDN build.

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
Checking the Dojo Module Source
*******************************************************************************

In the /dojo/drupal directory, are four files called:

  dojo-module-main.js
  dojo-module-main.original.js
  dojo-module-admin.js
  dojo-module-admin.original.js

When you perform a build, the original dojo-module-main.js and
dojo-module-admin.js are destroyed and replaced with the new builds.  If you
try to run a build again, it will fail.  Delete the dojo-module-main.js and the
dojo-module-admin.js, then copy the dojo-module-main.build.js and
dojo-module-admin.build.js and remove the ".original" from the file name.

*******************************************************************************
Building The dojo-0.9.0 Profile
*******************************************************************************

Go to the buildscripts directory:

  $ cd dojo-release-0.9.0-src/util/buildscripts

Then execute the build:

  $ ./build.sh profileFile=../../../profiles/dojo-0.9.0.profile.js \
    releaseName=delete-me action=clean,release version=0.9.0-2.0

*******************************************************************************
Building The dojo-module Profile
*******************************************************************************

Go to the buildscripts directory:

  $ cd dojo-release-0.9.0-src/util/buildscripts

Then execute the build:

  $ ./build.sh profileFile=../../../profiles/dojo-module.profile.js \
    releaseName=delete-me action=clean,release version=0.9.0-2.0

and then

  $ ./build.sh profileFile=../../../profiles/dojo-module.profile.js \
    releaseName=delete-me action=clean,release loader=xdomain \
    xdDojoPath=http://o.aolcdn.com/dojo/0.9.0 version=0.9.0-2.0-xdomain

After the build is complete, you may delete the "release" directory in the
dojo-release-0.9.0-src directory.

This will put the following files in the dojo/drupal directory:

  dojo-module.js
  dojo-module.js.uncompressed.js
  dojo-module.xd.js
  dojo-module.xd.js.uncompressed.js

From a web browser, go to the Dojo Toolit Module settings page, then update your
build profile to select the build.  The "xd" files are used for the CDN and will
be automatically loaded when a CDN Dojo build is selected.


