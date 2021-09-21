=== Icon Block ===
Contributors:      ndiego, outermostdesign
Tags:              icon, icon block, SVG, SVG block, block
Requires at least: 5.8.0
Tested up to:      5.8.0
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A simple little block that allows you add an SVG icon or graphic to your website.

== Description ==

A simple little block that allows you add an SVG icon or graphic to the Block Editor (Gutenberg).

=== Key Features ===

* Use your own SVG icon or graphic
* Includes some handy controls (link, rotate, alignment, colors, etc.)
* No block library required
* Built almost entirely with native WordPress components
* Will get additional functionality as its added to WordPress core (margin, borders, responsive controls etc.)

=== Stay Connected ===

* [Follow on Twitter](https://twitter.com/nickmdiego)
* [View on GitHub](https://github.com/ndiego/icon-block)

== Installation ==

1. You have a couple options:
	* Go to Plugins &rarr; Add New and search for "Icon Block". Once found, click "Install".
	* Download the Icon Block from wordpress.org and make sure the folder us zipped. Then upload via Plugins &rarr; Add New &rarr; Upload.
    * Open the block inserter within the Block Editor (Gutenberg) and search for "icon". The plugin should appear and allow you to it install directly. Skip steps 2 and 3.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Search for the block within the Block Editor (Gutenberg) and begin using.

== Frequently Asked Questions ==

= Wait, where are all the icons? =

Currently, the Icon Block does not include its own library of icons for users to choose from. If that's what you are looking for, my apologies. The there are many other icon blocks out there that have this functionality.

Instead, this plugin allows you to render **any** SVG-based icon by simply copy/pasting the code into the icon textarea! See the screenshots for reference. This give you complete flexibility and allows you to use practically any icon you want. A great source for free SVG icons is Google's Material Icons project.

= Why is my icon not changing color? =

The Icon Block includes controls for the icon's color and background. However, if your SVG icon has hard coded color/fill values, the plugin will respect those instead of any applied custom colors.

= Why is the block not working for certain users? =

WordPress only allows Administrators and Editors to save SVG content. The Icon Block will not work properly for users who are at the Author level or lower.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 0.1.0 =
* Initial release 🎉
