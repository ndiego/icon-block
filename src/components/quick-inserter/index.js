/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Popover, SearchControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, blockDefault } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import getIcons from './../../icons';
import { flattenIconsArray, parseIcon } from './../../utils';

export default function QuickInserterPopover( props ) {
	const [ searchInput, setSearchInput ] = useState( '' );
	const {
		setInserterOpen,
		isQuickInserterOpen,
		setQuickInserterOpen,
		setAttributes,
	} = props;

	if ( ! isQuickInserterOpen ) {
		return null;
	}

	function updateIconAtts( name, hasNoIconFill ) {
		setAttributes( {
			icon: '',
			iconName: name,
			hasNoIconFill,
		} );
		setInserterOpen( false );
	}

	const iconsByType = getIcons();
	const iconsAll = flattenIconsArray( iconsByType );

	// Get the icons of the default type, if there is one. Otherwise, just pull
	// from the first icon type.
	const iconsOfDefaultType =
		iconsByType.filter( ( t ) => t.isDefault )[ 0 ]?.icons ?? iconsAll;

	let shownIcons = [];

	if ( searchInput ) {
		shownIcons = iconsAll.filter( ( icon ) => {
			const input = searchInput.toLowerCase();
			const iconName = icon.title.toLowerCase();

			// First check if the name matches.
			if ( iconName.includes( input ) ) {
				return true;
			}

			// Then check if any keywords match.
			if ( icon?.keywords && ! isEmpty( icon?.keywords ) ) {
				const keywordMatches = icon.keywords.filter( ( keyword ) =>
					keyword.includes( input )
				);

				return ! isEmpty( keywordMatches );
			}

			return false;
		} );
	}

	if ( ! searchInput ) {
		// See if there is a default icon(s) set.
		const defaultIcons =
			iconsOfDefaultType.filter( ( i ) => i.isDefault ) ?? [];

		// Get the rest of the icons in the type excluding the default ones.
		const nonDefaultIcons =
			iconsOfDefaultType.filter( ( i ) => ! i.isDefault ) ?? [];

		// First show the default icons, then the rest.
		shownIcons = shownIcons.concat( defaultIcons, nonDefaultIcons );
	}

	// Only want to display 6 icons.
	shownIcons = shownIcons.slice( 0, 6 );

	const searchResults = (
		<div className="block-editor-inserter__panel-content">
			<div className="icons-list">
				{ shownIcons.map( ( icon ) => {
					let renderedIcon = icon.icon;

					if ( typeof renderedIcon === 'string' ) {
						renderedIcon = parseIcon( renderedIcon );
					}

					return (
						<Button
							key={ `icon-${ icon.name }` }
							label={ __( 'Insert Icon', 'icon-block' ) }
							className={ classnames(
								'icons-list__item',
								'block-editor-block-types-list__item',
								{
									'has-no-icon-fill': icon?.hasNoIconFill,
								}
							) }
							onClick={ () => {
								updateIconAtts(
									icon.name,
									icon?.hasNoIconFill
								);
								setQuickInserterOpen( false );
								setSearchInput( '' );
							} }
						>
							<span className="icons-list__item-icon">
								<Icon icon={ renderedIcon } />
							</span>
							<span className="icons-list__item-title">
								{ icon.title }
							</span>
						</Button>
					);
				} ) }
			</div>
		</div>
	);

	const noResults = (
		<div className="block-editor-inserter__no-results">
			<Icon
				icon={ blockDefault }
				className="block-editor-inserter__no-results-icon"
			/>
			<p>{ __( 'No results found.', 'block-icon' ) }</p>
		</div>
	);

	return (
		<Popover
			className="wp-block-outermost-icon-inserter__quick-inserter block-editor-inserter__popover is-quick"
			onClose={ () => setQuickInserterOpen( false ) }
			position="bottom center"
		>
			<div className="block-editor-inserter__quick-inserter">
				<SearchControl
					className="block-editor-inserter__search"
					label={ __( 'Search icons', 'icon-block' ) }
					hideLabelFromVision={ true }
					value={ searchInput }
					onChange={ ( value ) => setSearchInput( value ) }
				/>
				<div className="block-editor-inserter__quick-inserter-results">
					{ [
						isEmpty( shownIcons ) && noResults,
						! isEmpty( shownIcons ) && searchResults,
					] }
				</div>
				<Button
					className="block-editor-inserter__quick-inserter-expand"
					onClick={ () => {
						setInserterOpen( true );
						setQuickInserterOpen( false );
						setSearchInput( '' );
					} }
				>
					{ __( 'Browse all', 'icon-block' ) }
				</Button>
			</div>
		</Popover>
	);
}
