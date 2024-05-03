=== The Icon Block ===
Contributors:      ndiego, outermostdesign
Tags:              icon, icon block, SVG, SVG block, block
Requires at least: 6.3
Tested up to:      6.5
Requires PHP:      7.0
Stable tag:        1.8.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Effortlessly add SVG icons and graphics to the WordPress block editor.

== Description ==

The Icon Block plugin registers a single, easy-to-use block that allows you to add custom SVG icons and graphics to the WordPress block editor (Gutenberg). 

The plugin also includes the complete WordPress icon library with 290+ SVG icons.

=== Key Features ===

* 290+ native WordPress icons, including social logos
* Use any custom SVG icon or graphic
* Insert icons from your Media Library if SVG uploads are supported
* Includes handy icon controls (link, rotate, alignment, colors, border, padding, margin, etc.)
* Fully compatible with the Site Editor
* No block library required 🎉
* Built almost entirely with native WordPress components
* Will get additional functionality as it's added to WordPress core
* Register your own custom icon library. [Learn more](https://nickdiego.com/adding-custom-icons-to-the-icon-block/)

=== Stay Connected ===

* [View on GitHub](https://github.com/ndiego/icon-block)
* [Visit plugin project page](https://nickdiego.com/projects/icon-block/)
* [Follow on Twitter](https://twitter.com/theiconblock)

== Installation ==

1. You have a couple of options:
	* Go to Plugins &rarr; Add New and search for "Icon Block". Once found, click "Install".
	* Download the Icon Block from wordpress.org and make sure the folder is zipped. Then upload via Plugins &rarr; Add New &rarr; Upload.
    * Open the block inserter within the Block Editor (Gutenberg) and search for "icon". The plugin should appear and allow you to install it directly. Skip steps 2 and 3.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Search for the block within the Block Editor (Gutenberg) and begin using it.

== Frequently Asked Questions ==

= Where can I get more icons? =

Currently, the Icon Block only includes the WordPress icon library. That said, the plugin allows you to render **any** SVG-based icon by simply copying/pasting the code into the icon text area when using the "Add custom icon" option! See the screenshots for reference. This gives you complete flexibility and allows you to use practically any icon you want. A great source for free SVG icons is Google's Material Icons project, Font Awesome, and Iconic, to name a few.

The Icon Block also allows you to register your own custom block library. This needs to be done externally in your theme or via a plugin but provides complete flexibility over the icons available in the plugin. [Learn more](https://nickdiego.com/adding-custom-icons-to-the-icon-block/).

= Why is my icon not changing color? =

The Icon Block includes controls for the icon's color and background. However, if your SVG icon has hard-coded color/fill values, the plugin will respect those instead of any applied custom colors.

= Why can't I add SVG icons from my Media Library? =

By default, WordPress does not allow you to add SVG files to your Media Library, but you can enable this functionality using plugins like [Safe SVG](https://wordpress.org/plugins/safe-svg/). If SVG uploads are enabled, you will see the option to insert icons from Media Library in the Icon Block.

= Why is the block not working for certain users? =

WordPress only allows Administrators and Editors to save "Unfiltered HTML" content, which includes SVGs. The Icon Block will not work properly for users who are at the Author level or lower.

Note that WordPress multisite installations have additional restrictions. "Unfiltered HTML" is restricted to Super Admins on multisite. To enable "Unfiltered HTML" content for site Administrators and Editors, you will need to use a [code snippet](https://kellenmace.com/add-unfiltered_html-capability-to-admins-or-editors-in-wordpress-multisite/), the [Unfiltered MU](https://wordpress.org/plugins-wp/unfiltered-mu/) plugin, or something similar. Regrettably, this is a WordPress restriction and needs to be handled outside of the Icon Block.

== Screenshots ==

1. The Icon Block includes the WordPress icon library, allowing you to insert 270+ graphics.
2. Create your own custom icons by simply copying/pasting the SVG code. Then, modify the icon to suit your needs.
3. The Icon Block includes icon controls such as color, rotation, alignment, padding, and border-radius.
4. The Icon Block adapts to your layout, whether you need a big or small icon.
5. Use the "quick inserter" to pick the WordPress icon you need.
6. The WordPress icon library modal has categories, search, and preview size functionality.
7. Custom icons are added via their own insertion modal with a large text area and the ability to preview the SVG code.
8. You are not limited to traditional icons. Any SVG-based graphic will work as well. The block will respect any hard-coded color/fill values in the provided SVG.

== Changelog ==

= 1.9.0 = 2024-05-TBD

**Fixed**

- Fix the bug causing icon categories to become unalphabetized after the search.
- Fix text overflow bug caused by custom icon categories with long names.
- Fix the bug where the icon color input would get duplicated when setting the icon label. This occurred when `blockInspectorTabs` was set to `false`.

= 1.8.0 = 2024-03-24

**Added**

* The Icon Block can now be added to Navigation blocks (requires WordPress 6.5 or Gutenberg 17.6+)
* Add Playground blueprint for live preview in the Plugin Directory.

**Changed**

* Update "Tested up to" to WordPress 6.5. 
* Update "Requires at least" to WordPress 6.3.

= 1.7.0 - 2024-01-02 =

**Added**

* Add X social icon.

**Changed**

* Bump the "Tested up to" version to WordPress 6.4.
* Update hover styles in icon pickers to match Core styling.
* Remove custom placeholder illustration.

**Fixed**

* Fix the text area height in the custom icon editor modal.

= 1.6.0 - 2023-07-29 =

**Added**

* Add Threads and WhatsApp social icons.
* Add Core icons new in WordPress 6.2: Border, Caption, Chevron Up/Down, Comment Edit Link, Copy, Drawer Left, Drawer Right, Filter, Justify Stretch, Line Dashed, Line Dotted, Line Solid, List Item, Lock Outline, Lock Small, Seen, Shadow, Shuffle, and Unseen

**Changed**

* **Update minimum required WordPress version to 6.2**. We want to be utilizing the latest functionality in WordPress.
* Update to block API v3 for better 6.3 compatibility.
* Disable dimension and border default controls for better 6.3 compatibility.
* Move color controls to the native "color" panel. ([#35](https://github.com/ndiego/icon-block/pull/35))
* Simplify transform CSS. ([#32](https://github.com/ndiego/icon-block/pull/32))

= 1.5.0 - 2023-03-09 =

**Added**

* Add dropzone support for media library uploads and custom SVGs.
* Add support for style elements in custom SVGs.
* Add the ability to insert an SVG icon from the Media Library if SVG uploads are enabled on the website.
* Add the ability to clear the current icon.

**Changed**

* Update the block inspector panels for WordPress 6.2 compatibility.
* Update the replace dropdown to use the native DropDownMenu component for improved WordPress 6.2 compatibility.

**Fixed**

* Fix invalid DOM properties error. Thanks @DeoThemes for reporting this issue and suggesting a solution! ([#25](https://github.com/ndiego/icon-block/pull/25))
* Fix a few minor CSS issues for WordPress 6.2 compatibility.

= 1.4.0 - 2023-01-03 =

**Added**

* Add icon height control.

**Changed**

* Update WordPress version requirement to 6.0+.
* Update icon color handling to better support Global Styles.
* Update icon width control to support additional units.
* Update settings panel to mirror Core `ToolsPanel` implementations and support setting resets.

= 1.3.2 - 2022-10-17 =

**Fixed**

* Fix incorrect class specification.
* Fix placeholder background color in prep for WordPress 6.1.

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
