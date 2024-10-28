<?php
/**
 * Plugin Name:       The Icon Block
 * Description:       Easily add SVG icons and graphics to the WordPress block editor.
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Version:           2.0.0
 * Author:            Nick Diego
 * Author URI:        https://www.nickdiego.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       icon-block
 *
 * @package           The Icon Block
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers the Icon Block using the metadata loaded from the `block.json`
 * file. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 */
function outermost_icon_block_init() {
	register_block_type( __DIR__ . '/build' );

	// Load available translations.
	wp_set_script_translations( 'outermost-icon-block-editor-script-js', 'icon-block' );
}
add_action( 'init', 'outermost_icon_block_init' );

/**
 * Adds the Icon Block to the list of blocks that should be wrapped in a list item
 * if the block is placed in a Navigation menu. This ensures that custom blocks like
 * the Icon Block are correctly formatted within Navigation blocks.
 *
 * @since 1.8.0
 * 
 * @param array $blocks An array of block names that are allowed to be listed within a Navigation block.
 * @return array The modified array of block names, including 'outermost/icon-block'.
 */
function outermost_icon_block_add_to_navigation_listable_blocks( $blocks ) {
    $blocks[] = 'outermost/icon-block';
    return $blocks;
}
add_filter( 'block_core_navigation_listable_blocks', 'outermost_icon_block_add_to_navigation_listable_blocks' );