=== The Icon Block ===
Contributors:      ndiego, outermostdesign
Tags:              icon, icon block, SVG, SVG block, block
Requires at least: 5.9
Tested up to:      6.1
Requires PHP:      7.0
Stable tag:        1.3.1
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Effortlessly add an SVG icon or graphic to your website or choose one from the WordPress icon library.

== Description ==

A simple little block that allows you to add a custom SVG icon or graphic to the Block Editor (Gutenberg).

The plugin also includes the complete WordPress icon library with 270+ SVG icons to choose from!

=== Key Features ===

* 270+ native WordPress icons, including social logos
* Use any custom SVG icon or graphic
* Includes some handy icon controls (link, rotate, alignment, colors, border, padding, margin, etc.)
* No block library required 🎉
* Built almost entirely with native WordPress components
* Will get additional functionality as it's added to WordPress core
* Register your own custom icon library. [Learn more](https://nickdiego.com/adding-custom-icons-to-the-icon-block/)

=== Stay Connected ===

* [Follow on Twitter](https://twitter.com/theiconblock)
* [View on GitHub](https://github.com/ndiego/icon-block)

== Installation ==

1. You have a couple options:
	* Go to Plugins &rarr; Add New and search for "Icon Block". Once found, click "Install".
	* Download the Icon Block from wordpress.org and make sure the folder us zipped. Then upload via Plugins &rarr; Add New &rarr; Upload.
    * Open the block inserter within the Block Editor (Gutenberg) and search for "icon". The plugin should appear and allow you to it install directly. Skip steps 2 and 3.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Search for the block within the Block Editor (Gutenberg) and begin using.

== Frequently Asked Questions ==

= Where can I get more icons? =

Currently, the Icon Block only includes the WordPress icon library. That said, the plugin allows you to render **any** SVG-based icon by simply copy/pasting the code into the icon textarea when using the "Add custom icon" option! See the screenshots for reference. This gives you complete flexibility and allows you to use practically any icon you want. A great source for free SVG icons is Google's Material Icons project, Font Awesome, and Iconic, just to name a few.

The Icon Block also allows you to register your own custom block library. This needs to be done externally in your theme, or via a plugin, but provides complete flexibility over the icons available in the plugin. [Learn more](https://nickdiego.com/adding-custom-icons-to-the-icon-block/).

= Why is my icon not changing color? =

The Icon Block includes controls for the icon's color and background. However, if your SVG icon has hard coded color/fill values, the plugin will respect those instead of any applied custom colors.

= Why is the block not working for certain users? =

WordPress only allows Administrators and Editors to save "Unfiltered HTML" content, which includes SVGs. The Icon Block will not work properly for users who are at the Author level or lower.

Note that WordPress multisite installations have additional restrictions. "Unfiltered HTML" is restricted to Super Admins on multisite. To enable "Unfiltered HTML" content for site Administrators and Editors, you will need to use a [code snippet](https://kellenmace.com/add-unfiltered_html-capability-to-admins-or-editors-in-wordpress-multisite/), the [Unfiltered MU](https://wordpress.org/plugins-wp/unfiltered-mu/) plugin, or something similar. Regrettably, this is a WordPress restriction and needs to be handled outside of the Icon Block.

== Screenshots ==

1. The Icon Block includes the WordPress icon library allowing you to quickly and easily insert 270+ graphics.
2. Create your own custom icons by simply copy/pasting the SVG code. Then modify the icon to suit your needs.
3. The Icon Block comes with numerous icon controls such as color, rotation, alignment, padding, and border radius.
4. Whether you need a big icon, or a small one, the Icon Block adapts to your layout. Give it a try with the Row block in Gutenberg!
5. Use the "quick inserter", to quickly pick the WordPress icon you need.
6. The WordPress icon library modal is complete with categories, search, and preview size functionality.
7. Custom icons are added via their own insertion modal with a large textarea and the ability to preview the SVG code.
8. You are not limited to traditional icons. Any SVG-based graphic will work as well. The block will respect any hard coded color/fill values in the provided SVG.

== Changelog ==

= 1.3.1 - 2022-10-01 =

**Fixed**

* Fix alignment classes not getting applied in the correct spot.

= 1.3.0 - 2022-09-20 =

**Added**

* Add the ability to toggle icon color fill. Useful for SVG icons that use stroke.
* Add the ability to disable custom icons using the `iconBlock.enableCustomIcons` filter.
* Add title attribute support.
* Add alternative Reddit icon to match WordPress core.
* Add new WordPress icon: `title`

**Changed**

* Update block architecture to support features in WordPress 6.1.
* Update block placeholder to be more consistent with core placeholders.
* Improve support for custom icons without a fill color.
* Improve the UI in various places.

**Removed**

* Remove deprecated WordPress icons: `archiveTitle`, `commentTitle`, `postTitle`, and `queryTitle`

**Fixed**

* Fix bug where icon color and fill were overridden by theme colors.
* Fix visual inconsistency between the frontend and Editor due to box-sizing not getting applied in the Editor.

= 1.2.0 - 2022-05-02 =

**Added**

* Add alpha support for icon and background colors.
* Add link rel support.
* Add support for custom icon types.
* Add new WordPress icons: `post`, `postTerms`, `queryTitle`, `removeSubmenu`, and `row`

**Changed**

* Remove deprecated WordPress icons: `alignJustifyAlt`, `cogAlt`, and `trashFilled`

= 1.1.2 - 2022-01-27 =

**Fixed**

* Fix bug where custom SVG icons with `style` attributes would not render correctly. Thanks @endres for reporting this issue.

= 1.1.1 - 2022-01-25 =

**Changed**

* Include both theme and WordPress default color palettes in the icon and background color picker.

= 1.1.0 - 2022-01-25 =

**Added**

* Add additional border support (color, width, style)
* Add margin support
* Add the ability to set an `aria-label` on the icon and link.
* Add the core Unlock icon.
* Add the core Comment Author Avatar icon.
* Add the core Comment Author Name icon.
* Add the core Comment Content icon.
* Add the core Comment Edit Link icon.
* Add the core Comment Reply Link icon.

**Changed**

* Update inserter modal components to use `isFullScreen` to better resemble core modals.
* Update styling on inserter modals for improved mobile responsiveness.
* Import the Align None, Color, Reset, and Styles icons directly from @wordpress/icons.
* Remove the custom search component in favor of the core component from @wordpress/components.
* Restructure stylesheets to better conform with block standards.

**Fixed**

* Fix bug where hyphens and colons would be incorrectly stripped from attribute names in custom icons. Thanks @stokesman for the PR. ([#5](https://github.com/ndiego/icon-block/pull/5))

= 1.0.0 - 2021-10-06 =

**Added**

* Added the WordPress icon library featuring 270+ icons.
* Add new placeholder and quick icon insertion experience.
* Added new custom icon editing modal for an improved insertion experience.

= 0.1.2 - 2021-09-27 =

**Added**

* Added scale transform on the frontend when an icon is linked to improve a11y. This matches the hover styling in the core WordPress Social Icons block. Future improvements are planned, including dedicated hover/focus settings within the block itself.

**Fixed**

* Fixed translation file.
* Fixed version in block.json so block can be added to the Block Directory.

= 0.1.1 - 2021-09-25 =

**Fixed**

* Fixed SVG sanitization for non-standard SVGs.

= 0.1.0 - 2021-09-25 =

* Initial release 🎉
