# Icon Block

![The Icon Block](https://github.com/ndiego/icon-block/blob/main/_wordpress-org/banner-1544x500.png)

[![Active Installs](https://img.shields.io/wordpress/plugin/installs/icon-block?logo=wordpress&logoColor=%23fff&label=Active%20Installs&labelColor=%2323282dA&color=%2323282dA)](https://wordpress.org/plugins/icon-block/) [![Playground Demo Link](https://img.shields.io/wordpress/plugin/v/icon-block?logo=wordpress&logoColor=%23fff&label=Playground%20Demo&labelColor=%233858e9&color=%233858e9)](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/ndiego/icon-block/main/_playground/blueprint.json)

The Icon Block plugin registers a single, easy-to-use block that allows you to add custom SVG icons and graphics to the WordPress block editor (Gutenberg). The plugin also includes the complete WordPress icon library with 290+ SVG icons.

### Key features

- 290+ native WordPress icons, including social logos
- Use any custom SVG icon or graphic
- Insert icons from your Media Library if SVG uploads are supported
- Includes handy icon controls (link, rotate, alignment, colors, border, padding, margin, etc.)
- Fully compatible with the Site Editor
- No block library required 🎉
- Built almost entirely with native WordPress components
- Will get additional functionality as it's added to WordPress core
- Register your own custom icon library. [Learn more](https://nickdiego.com/adding-custom-icons-to-the-icon-block/).

## Extensibility

The Icon Block includes several extensibility features that allow you to tailor the block to meet your needs.

### Hooks & Filters

#### `iconBlock.icons`

Filters all icons available in the built-in icon library. Use this filter to add or remove icons from the plugin. [Learn more](https://nickdiego.com/adding-custom-icons-to-the-icon-block/).

#### `iconBlock.enableCustomIcons`

Defaults to `true`, this filter allows you to enable or disable custom SVG icon functionality. When disabled, you are restricted from using the icon library.

```
wp.hooks.addFilter(
	'iconBlock.enableCustomIcons',
	'example-theme/disable-custom-icons',
	() => false
);
```

### theme.json

You can easily disable border and spacing settings in the Editor UI if your theme includes a theme.json file.

```
{
	...
	"settings": {
		...
		"blocks": {
			"outermost/icon-block": {
				"border": {
					"color": false,
					"radius": false,
					"style": false,
					"width": false
				},
				"spacing": {
					"margin": false,
					"padding": false
				}
			},
...
```

## Requirements

- WordPress 6.4+
- PHP 7.4+

## Development

1. Set up a local WordPress development environment.
2. Clone / download this repository into the `wp-content/plugins` folder.
3. Navigate to the `wp-content/plugins/icon-block` folder in the command line.
4. Run `npm install` to install the plugin's dependencies within a `/node_modules/` folder.
5. Run `composer install` to install the additional WordPress composer tools within a `/vendor/` folder.
6. Run `npm run start` to compile and watch source files for changes while developing.

Refer to `package.json` for additional commands.
