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
import getIcons from './../icons';
import parseIcon from './../utils/parse-icon';
import {
	flattenIconsArray,
	getIconTypes,
	simplifyCategories,
} from './../utils/icon-functions';

export default function InserterModal( props ) {
	const {
		isInserterOpen,
		setInserterOpen,
		attributes,
		setAttributes,
	} = props;
	const iconsByType = getIcons();
	const iconTypes = getIconTypes( iconsByType );

	// Get the default type, and if there is none, get the first type.
	let defaultType = iconTypes.filter( ( type ) => type.isDefault );
	defaultType = defaultType.length !== 0 ? defaultType : [ iconTypes[ 0 ] ];

	const [ searchInput, setSearchInput ] = useState( '' );
	const [ currentCategory, setCurrentCategory ] = useState(
		'all__' + defaultType[ 0 ]?.type
	);
	const [ iconSize, setIconSize ] = useState( 24 );

	if ( ! isInserterOpen ) {
		return null;
	}

	const iconsAll = flattenIconsArray( iconsByType );
	let shownIcons = [];

	// Filter by search input.
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

	// Filter by category if we are not searching.
	if ( ! searchInput ) {
		// If an "all" category, fetch all icons of the correct type.
		if ( currentCategory.startsWith( 'all__' ) ) {
			const categoryType = currentCategory.replace( 'all__', '' );
			const allIconsOfType =
				iconsByType.filter(
					( type ) => type.type === categoryType
				)[ 0 ]?.icons ?? [];
			shownIcons = allIconsOfType;
		} else {
			shownIcons = iconsAll.filter( ( icon ) => {
				const iconCategories = icon?.categories ?? [];

				// First check if the category matches.
				if ( iconCategories.includes( currentCategory ) ) {
					return true;
				}

				return false;
			} );
		}
	}

	const preparedTypes = [];

	iconsByType.forEach( ( type ) => {
		const title = type?.title ?? type.type;
		const categoriesFull = type?.categories ?? [];
		const categories = simplifyCategories( categoriesFull );
		const allCategory = 'all__' + type.type;
		const iconsOfType = type?.icons ?? [];

		// Sort alphabetically and then add the "all" category.
		if ( ! categories.includes( allCategory ) ) {
			categories.sort().unshift( allCategory );
			categoriesFull.unshift( {
				name: allCategory,
				title: __( 'All', 'icon-block' ),
			} );
		}

		preparedTypes.push( {
			type: type.type,
			title,
			categoriesFull,
			categories,
			count: iconsOfType.length,
		} );
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
			<MenuGroup
				className="icon-inserter__sidebar__category-type"
				label={ type.title }
			>
				{ type.categories.map( ( category ) => {
					const isActive = currentCategory
						? category === currentCategory
						: category === 'all__' + type.type;

					const categoryIcons = iconsAll.filter( ( icon ) => {
						const iconCats = icon?.categories ?? [];
						return (
							icon.type === type.type &&
							iconCats.includes( category )
						);
					} );

					const categoryTitle =
						type.categoriesFull.filter(
							( c ) => c.name === category
						)[ 0 ]?.title ?? category;

					return (
						<MenuItem
							key={ `category-${ category }` }
							className={ classnames( {
								'is-active': isActive,
							} ) }
							onClick={ () => onClickCategory( category ) }
							isPressed={ isActive }
						>
							{ categoryTitle }
							<span>
								{ category === 'all__' + type.type
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
				let renderedIcon = icon.icon;

				// Icons provided by third-parties are generally strings.
				if ( typeof renderedIcon === 'string' ) {
					renderedIcon = parseIcon( renderedIcon );
				}

				return (
					<Button
						key={ `icon-${ icon.name }` }
						className={ classnames( 'icons-list__item', {
							'is-active': icon.name === attributes?.iconName,
						} ) }
						onClick={ () => updateIconName( icon.name ) }
					>
						<span className="icons-list__item-icon">
							<Icon icon={ renderedIcon } size={ iconSize } />
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
				className={ classnames( 'icon-inserter', {
					'is-searching': searchInput,
				} ) }
			>
				<div className="icon-inserter__sidebar">
					<div className="icon-inserter__sidebar__search">
						<SearchControl
							value={ searchInput }
							onChange={ setSearchInput }
						/>
					</div>
					{ preparedTypes.map( ( type ) =>
						renderIconTypeCategories( type )
					) }
				</div>
				<div className="icon-inserter__content">
					<div className="icon-inserter__content-header">
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
					<div className="icon-inserter__content-grid">
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
