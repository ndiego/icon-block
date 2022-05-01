/**
 * External dependencies
 */
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
import iconsByType from './../icons';

function getAllIcons( icons ) {
	let allIcons = [];

	icons.forEach( ( type ) => {
		const iconType = type?.type;
		const iconsOfType = type?.icons;

		if ( ! isEmpty( iconsOfType ) ) {
			// Append the type to the icon name and add the type parameter.
			iconsOfType.forEach( ( icon ) => {
				icon.name = iconType + '-' + icon.name;
				icon.type = iconType;
			} );

			// Sort the icons alphabetically.
			iconsOfType.sort( function ( a, b ) {
				return a.name.localeCompare( b.name );
			} );

			allIcons = allIcons.concat( iconsOfType );
		}
	} );

	return allIcons;
}

export function QuickInserterPopover( props ) {
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

	function updateIconName( name ) {
		setAttributes( {
			icon: '',
			iconName: name,
		} );
		setInserterOpen( false );
	}

	const iconsAll = getAllIcons( iconsByType );

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
		// See if there is a default icon set.
		const defaultIcons =
			iconsOfDefaultType.filter( ( i ) => i.isDefault ) ?? [];

		shownIcons = shownIcons.concat( defaultIcons, iconsOfDefaultType );
	}

	shownIcons = shownIcons.slice( 0, 6 );

	const searchResults = (
		<div className="block-editor-inserter__panel-content">
			<div className="icons-list">
				{ shownIcons.map( ( icon ) => {
					return (
						<Button
							key={ `icon-${ icon.name }` }
							label={ __( 'Insert Icon', 'icon-block' ) }
							className="icons-list__item"
							onClick={ () => {
								updateIconName( icon.name );
								setQuickInserterOpen( false );
								setSearchInput( '' );
							} }
						>
							<span className="icons-list__item-icon">
								<Icon icon={ icon.icon } />
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
