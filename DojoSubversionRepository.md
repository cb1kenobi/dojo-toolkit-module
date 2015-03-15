# What is Subversion and Why Do I Care? #

Subversion is a version control system and it's where the Dojo Toolkit folks store all of the Dojo code. The source code is organized into folders based on code branches, releases, development code, and so on. There are Subversion clients that allow you to checkout the code to your computer.

The Subversion front-end built into the Dojo Module is simply a web interface to the standard Linux Subversion command line client. So, in order for this to work, you must install a Subversion command line client. A note to those of you hosting this on Windows, this has never been tested in a Windows environment, so may the force be with you.

# Checking Out Code #

So, you got Subversion ready and you can hardly wait to check something out. But before you can, you need to make sure that Apache/PHP has write access to the Dojo Toolkit Module directory (i.e. /sites/all/modules/dojo). In a Linux environment you can simply open a terminal, go to the Drupal root directory, and execute:

```
chmod 757 sites/all/modules/dojo
```

OK, now go to the Dojo Subversion Repository page.

# Subversion Settings #

For the first step you must enter the path to the Subversion command line client and the URL to Dojo's Subversion repository. The Subversion repository URL should always be http://svn.dojotoolkit.org/dojo unless the Dojo guys decide to change it.

Click next and the server will attempt to get a listing of the Subversion root directory. When the listing appears, you may expand any folders and then you must select a folder before proceeding to check it out.

It is recommended that you check out /view/anon/all/trunk which will pull down the latest code in the dijit, dojo, dojox, and util directories.

# Take a Moment to Grab a Frosty Beverage #

If this is the first time you are checking a particular repository out, it may take a while for the files to download. When the transfer is done, the output is rendered to the browser. Be sure to check the output for any errors.

After the checkout is complete, you move the source directories around and rename them.