<?php
/**
 * Plugin Name:       The Icon Block
 * Description:       A simple little block that allows you add an SVG icon or graphic to your website.
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Version:           1.3.1
 * Author:            Nick Diego
 * Author URI:        https://www.nickdiego.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       icon-block
 *
 * @package           The Icon Block
 */

/**
 * Registers the Icon Block using the metadata loaded from the `block.json`
 * file. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 */
function create_outermost_icon_block_init() {
	register_block_type( __DIR__ . '/build' );

	// Load available translations.
	wp_set_script_translations( 'outermost-icon-block-editor-script-js', 'icon-block' );
}
add_action( 'init', 'create_outermost_icon_block_init' );
