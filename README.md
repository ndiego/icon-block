# Icon Block

[![License](https://img.shields.io/badge/license-GPL--2.0%2B-blue.svg)](https://github.com/ndiego/icon-block/blob/master/LICENSE.txt)

![The Icon Block](https://github.com/ndiego/icon-block/blob/main/.wordpress-org/banner-1544x500.png)

A simple little block that allows you add a custom SVG icon or graphic to the Block Editor (Gutenberg). The plugin also includes the complete WordPress icon library with 270+ SVG icons to choose from!

### Key Features

- 270+ native WordPress icons, including social logos
- Use any custom SVG icon or graphic
- Includes some handy icon controls (link, rotate, alignment, colors, border, padding, margin, etc.)
- No block library required 🎉
- Built almost entirely with native WordPress components
- Will get additional functionality as it's added to WordPress core
- Register your own custom icon library. [Learn more](https://nickdiego.com/adding-custom-icons-to-the-icon-block/).

## Requirements

- WordPress 5.9+ or 5.8+ with [Gutenberg](https://wordpress.org/plugins/gutenberg/) active
- PHP 7.0+

## Development

1. Set up a local WordPress development environment.
2. Clone / download this repository into the `wp-content/plugins` folder.
3. Navigate to the `wp-content/plugins/icon-block` folder in the command line.
4. Run `npm install` to install the plugin's dependencies within a `/node_modules/` folder.
5. Run `composer install` to install the additional WordPress composer tools within a `/vendor/` folder.
6. Run `npm run start` to compile and watch source files for changes while developing.

Refer to `package.json` and `composer.json` for additional commands.

## Extensibility

The Icon Block includes a handful of extensibility features allowing you to tailor the block to meet your needs.

### `iconBlock.icons`

Filters all icons available in the built-in icon library. Use this filter add or remove icons from the plugin. [Learn more](https://nickdiego.com/adding-custom-icons-to-the-icon-block/).

### `iconBlock.enableCustomIcons`

Defaults to `true`, this filter allows you to enable or disable custom SVG icon functionality. When disabled, your are restricted to using the icon library.

```
wp.hooks.addFilter(
    'iconBlock.enableCustomIcons',
    'example-theme/disable-custom-icons',
    () => false
);
```


