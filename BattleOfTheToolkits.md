# The Hammer #

Drupal chose [jQuery](http://jquery.com) as their Javascript toolkit of choice to handle those neat collapsible panes and check all boxes. It does the job, but simply Dojo is a better. Visit the [Why Dojo?](http://dojotoolkit.org/book/dojo-book-0-9/introduction/why-dojo) page over at the Dojo Toolkit's site for more info.

# The Sledgehammer #

While a hammer might get the job done, sometimes a sledgehammer can get the job done better. Dojo is like jQuery, but has a lot more stuff.  Dojo can do all the animation, event handling, and Ajax stuff, but it also has a 2D drawing library, offline storage, a custom build system, and much, much more.

Dojo and jQuery can coexist at the same time, but the problem is file sizes, transfer and load times, and memory usage. If you want to use the Dojo Toolkit to code something in a module or theme you are developing, why load an extra 45KB of Drupal and jQuery Javascript code?

# Giving jQuery the Heisman #

By enabling the Dojo Toolkit Module, most places that use jQuery have been replaced with Dojo code. This way, only the Dojo files need to be loaded and thus the page will load faster. If a non-core module requires an external script that uses jQuery, then jQuery will be automatically loaded.

For a full tour of the jQuery replacements, continue on to the [Tour of Features](TourOfFeatures.md).