/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import {
	Button,
	MenuGroup,
	MenuItem,
	Modal,
	RangeControl,
	SearchControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, blockDefault } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './../icons';

export default function InserterModal( props ) {
	const {
		isInserterOpen,
		setInserterOpen,
		attributes,
		setAttributes,
	} = props;
	const [ searchInput, setSearchInput ] = useState( '' );
	const [ currentCategory, setCurrentCategory ] = useState( 'all' );
	const [ iconSize, setIconSize ] = useState( 24 );

	if ( ! isInserterOpen ) {
		return null;
	}

	let shownIcons = icons;

	// Filter by search input.
	if ( searchInput ) {
		shownIcons = icons.filter( ( icon ) => {
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

	// Filter by category if one select and we are not searching.
	if ( currentCategory !== 'all' && ! searchInput ) {
		shownIcons = icons.filter( ( icon ) => {
			const iconCategories = icon?.categories ?? [];

			// First check if the category matches.
			if ( iconCategories.includes( currentCategory ) ) {
				return true;
			}

			return false;
		} );
	}

	let iconTypes = [];

	// Get all icon types.
	icons.forEach( ( icon ) => {
		const type = icon?.type;

		if ( type && isEmpty( iconTypes ) ) {
			iconTypes.push( type );
		} else if ( type && ! isEmpty( iconTypes ) ) {
			iconTypes = iconTypes.filter( ( i ) => i !== type ).concat( type );
		}

		return iconTypes;
	} );

	const preparedTypes = [];

	// Add any found categories to each icon type.
	iconTypes.forEach( ( type ) => {
		const iconsOfType = icons.filter( ( i ) => i.type === type );
		const categories = [];

		iconsOfType.forEach( ( iconOfType ) => {
			const iconCategories = iconOfType?.categories;

			if ( ! isEmpty( iconCategories ) ) {
				iconCategories.forEach( ( category ) => {
					if ( ! categories.includes( category ) ) {
						categories.push( category );
					}
				} );
			}
		} );

		// Sort alphabetically and then add the "all" category.
		categories.sort().unshift( 'all' );

		preparedTypes.push( { type, categories, count: iconsOfType.length } );
	} );

	function updateIconName( name ) {
		setAttributes( {
			icon: '',
			iconName: name,
		} );
		setInserterOpen( false );
	}

	function onClickCategory( category ) {
		setCurrentCategory( category );
	}

	function renderIconTypeCategories( type ) {
		return (
			<MenuGroup label={ type.type }>
				{ type.categories.map( ( category ) => {
					const isActive = currentCategory
						? category === currentCategory
						: category === 'all';

					const categoryIcons = icons.filter( ( icon ) => {
						const iconCats = icon?.categories ?? [];
						return (
							icon.type === type.type &&
							iconCats.includes( category )
						);
					} );

					return (
						<MenuItem
							key={ `category-${ category }` }
							className={ classnames( {
								'is-active': isActive,
							} ) }
							onClick={ () => onClickCategory( category ) }
						>
							{ category }
							<span>
								{ category === 'all'
									? type.count
									: categoryIcons.length }
							</span>
						</MenuItem>
					);
				} ) }
			</MenuGroup>
		);
	}

	const searchResults = (
		<div className="icons-list">
			{ shownIcons.map( ( icon ) => {
				return (
					<Button
						key={ `icon-${ icon.name }` }
						className={ classnames( 'icons-list__item', {
							'is-active': icon.name === attributes?.iconName,
						} ) }
						onClick={ () => updateIconName( icon.name ) }
					>
						<span className="icons-list__item-icon">
							<Icon icon={ icon.icon } size={ iconSize } />
						</span>
						<span className="icons-list__item-title">
							{ icon?.title ?? icon.name }
						</span>
					</Button>
				);
			} ) }
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
		<Modal
			className="wp-block-outermost-icon-inserter__modal"
			title={ __( 'Icon Library', 'icon-block' ) }
			onRequestClose={ () => setInserterOpen( false ) }
			isFullScreen
		>
			<div
				className={ classnames( 'icon-inserter__panel', {
					'is-searching': searchInput,
				} ) }
			>
				<div className="icon-inserter__panel-sidebar">
					<SearchControl
						value={ searchInput }
						onChange={ setSearchInput }
					/>
					{ preparedTypes.map( ( type ) =>
						renderIconTypeCategories( type )
					) }
				</div>
				<div className="icon-inserter__panel-content">
					<div className="icon-inserter__panel-content-header">
						<div className="search-results">
							{ searchInput &&
								sprintf(
									// translators: %1$s: Number of icons retruned from search, %2$s: the search input
									_n(
										'%1$s search result for "%2$s"',
										'%1$s search results for "%2$s"',
										shownIcons.length,
										'icon-block'
									),
									shownIcons.length,
									searchInput
								) }
						</div>
						<div className="icon-controls">
							<div className="icon-controls__size">
								<span>
									{ __( 'Preview size', 'icon-block' ) }
								</span>
								<RangeControl
									min={ 24 }
									max={ 72 }
									initialPosition={ 24 }
									withInputField={ false }
									onChange={ ( value ) =>
										setIconSize( value )
									}
								/>
							</div>
						</div>
					</div>
					<div className="icon-inserter__panel-content-grid">
						{ [
							isEmpty( shownIcons ) && noResults,
							! isEmpty( shownIcons ) && searchResults,
						] }
					</div>
				</div>
			</div>
		</Modal>
	);
}
