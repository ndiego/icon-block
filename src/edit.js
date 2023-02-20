/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Dropdown,
	ExternalLink,
	MenuItem,
	NavigableMenu,
	Popover,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue, // eslint-disable-line
} from '@wordpress/components';
import {
	BlockControls,
	ContrastChecker,
	InspectorControls,
	JustifyToolbar,
	useBlockProps,
	withColors,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings, // eslint-disable-line
	__experimentalUseGradient as useGradient, // eslint-disable-line
	__experimentalLinkControl as LinkControl, // eslint-disable-line
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles, // eslint-disable-line
} from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import {
	flipHorizontal as flipH,
	flipVertical as flipV,
	link,
	rotateRight,
} from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import getIcons from './icons';
import { flattenIconsArray } from './utils/icon-functions';
import { bolt as defaultIcon } from './icons/bolt';
import parseIcon from './utils/parse-icon';
import InserterModal from './inserters/inserter';
import CustomInserterModal from './inserters/custom-inserter';
import IconPlaceholder from './placeholder';
import DimensionControl from './components/dimension-control';
import OptionsPanel from './components/options-panel';

const NEW_TAB_REL = 'noreferrer noopener';

/**
 * The edit function for the Icon Block.
 *
 * @param {Object} props All props passed to this function.
 * @return {WPElement}   Element to render.
 */
export function Edit( props ) {
	const {
		attributes,
		iconBackgroundColor,
		iconColor,
		setAttributes,
		setIconBackgroundColor,
		setIconColor,
	} = props;
	const {
		flipHorizontal,
		flipVertical,
		hasNoIconFill,
		icon,
		iconBackgroundColorValue,
		iconColorValue,
		iconName,
		itemsJustification,
		label,
		linkRel,
		linkTarget,
		linkUrl,
		rotate,
		title,
		width,
		height,
		// Deprecated
		percentWidth,
	} = attributes;

	useEffect( () => {
		// If percentWidth is set (deprecated in v1.4.0), set as width value
		// and remove the attribute.
		if ( percentWidth ) {
			setAttributes( {
				width: `${ percentWidth }%`,
				percentWidth: undefined,
			} );
		}
	} );

	const { gradientClass, gradientValue, setGradient } = useGradient();

	const [ isInserterOpen, setInserterOpen ] = useState( false );
	const [ isQuickInserterOpen, setQuickInserterOpen ] = useState( false );
	const [ isCustomInserterOpen, setCustomInserterOpen ] = useState( false );
	const [ isEditingURL, setIsEditingURL ] = useState( false );

	// Allow users to disable custom SVG icons.
	const enableCustomIcons = applyFilters(
		'iconBlock.enableCustomIcons',
		true
	);

	const ref = useRef();
	const iconRef = useRef();
	const isURLSet = !! linkUrl;
	const opensInNewTab = linkTarget === '_blank';

	const iconsAll = flattenIconsArray( getIcons() );
	const namedIcon = iconsAll.filter( ( i ) => i.name === iconName );
	let customIcon = defaultIcon;

	if ( icon && isEmpty( namedIcon ) ) {
		customIcon = parseIcon( icon );

		if ( isEmpty( customIcon?.props ) ) {
			customIcon = defaultIcon;
		}
	}

	let printedIcon = ! isEmpty( namedIcon ) ? namedIcon[ 0 ].icon : customIcon;

	// Icons provided by third-parties are generally strings.
	if ( typeof printedIcon === 'string' ) {
		printedIcon = parseIcon( printedIcon );
	}

	function setRotate() {
		let newRotate = 90;

		if ( rotate === 90 ) {
			newRotate = 180;
		} else if ( rotate === 180 ) {
			newRotate = 270;
		} else if ( rotate === 270 ) {
			newRotate = 0;
		}

		setAttributes( { rotate: newRotate } );
	}

	function startEditing( event ) {
		event.preventDefault();
		setIsEditingURL( true );
	}

	function unlink() {
		setAttributes( {
			linkUrl: undefined,
			linkTarget: undefined,
			linkRel: undefined,
		} );
		setIsEditingURL( false );
	}

	function onToggleOpenInNewTab( value ) {
		const newLinkTarget = value ? '_blank' : undefined;

		let updatedRel = linkRel;
		if ( newLinkTarget && ! linkRel ) {
			updatedRel = NEW_TAB_REL;
		} else if ( ! newLinkTarget && linkRel === NEW_TAB_REL ) {
			updatedRel = undefined;
		}

		setAttributes( {
			linkTarget: newLinkTarget,
			linkRel: updatedRel,
		} );
	}

	function onKeyDown( event ) {
		if ( isKeyboardEvent.primary( event, 'k' ) ) {
			startEditing( event );
		} else if ( isKeyboardEvent.primaryShift( event, 'k' ) ) {
			unlink();
			iconRef.current?.focus();
		}
	}

	const blockControls = (
		<>
			<BlockControls group="block">
				<JustifyToolbar
					allowedControls={ [ 'left', 'center', 'right' ] }
					value={ itemsJustification }
					onChange={ ( value ) =>
						setAttributes( { itemsJustification: value } )
					}
				/>
			</BlockControls>
			{ ( icon || iconName ) && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							name="link"
							icon={ link }
							title={ __( 'Link', 'icon-block' ) }
							shortcut={ displayShortcut.primary( 'k' ) }
							onClick={ startEditing }
							isActive={ isURLSet }
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						<ToolbarButton
							className={ `outermost-icon-block__rotate-button-${ rotate }` }
							icon={ rotateRight }
							label={ __( 'Rotate', 'icon-block' ) }
							onClick={ setRotate }
							isPressed={ rotate }
						/>
						<ToolbarButton
							icon={ flipH }
							label={ __( 'Flip Horizontal', 'icon-block' ) }
							onClick={ () =>
								setAttributes( {
									flipHorizontal: ! flipHorizontal,
								} )
							}
							isPressed={ flipHorizontal }
						/>
						<ToolbarButton
							icon={ flipV }
							label={ __( 'Flip Vertical', 'icon-block' ) }
							onClick={ () =>
								setAttributes( {
									flipVertical: ! flipVertical,
								} )
							}
							isPressed={ flipVertical }
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						{ enableCustomIcons ? (
							<Dropdown
								renderToggle={ ( { onToggle } ) => (
									<ToolbarButton onClick={ onToggle }>
										{ __( 'Replace' ) }
									</ToolbarButton>
								) }
								renderContent={ ( { onClose } ) => (
									<NavigableMenu>
										<MenuItem
											onClick={ () => {
												setInserterOpen( true );
												onClose( true );
											} }
										>
											{ __(
												'Browse icon library',
												'icon-block'
											) }
										</MenuItem>
										<MenuItem
											onClick={ () => {
												setCustomInserterOpen( true );
												onClose( true );
											} }
										>
											{ __(
												'Add/edit custom icon',
												'icon-block'
											) }
										</MenuItem>
									</NavigableMenu>
								) }
							/>
						) : (
							<ToolbarButton
								onClick={ () => {
									setInserterOpen( true );
								} }
							>
								{ __( 'Replace', 'icon-block' ) }
							</ToolbarButton>
						) }
					</ToolbarGroup>
				</BlockControls>
			) }
			{ isEditingURL && (
				<Popover
					position="bottom center"
					onClose={ () => {
						setIsEditingURL( false );
						iconRef.current?.focus();
					} }
					anchorRef={ ref?.current }
					focusOnMount={ isEditingURL ? 'firstElement' : false }
				>
					<LinkControl
						className="wp-block-navigation-link__inline-link-input"
						value={ { url: linkUrl, opensInNewTab } }
						onChange={ ( {
							url: newURL = '',
							opensInNewTab: newOpensInNewTab,
						} ) => {
							setAttributes( { linkUrl: newURL } );

							if ( opensInNewTab !== newOpensInNewTab ) {
								onToggleOpenInNewTab( newOpensInNewTab );
							}
						} }
						onRemove={ () => {
							unlink();
							iconRef.current?.focus();
						} }
					/>
				</Popover>
			) }
		</>
	);

	const inspectorControls = ( icon || iconName ) && (
		<>
			<InspectorControls group="settings">
				<OptionsPanel
					label={ __( 'Settings', 'icon-block' ) }
					options={ [
						{
							attributeSlug: 'label',
							label: __( 'Label', 'icon-block' ),
							isDefault: true,
						},
						{
							attributeSlug: 'width',
							label: __( 'Width', 'icon-block' ),
							isDefault: true,
						},
						{
							attributeSlug: 'height',
							label: __( 'Height', 'icon-block' ),
						},
					] }
					{ ...props }
				>
					<TextControl
						label={ __( 'Label', 'icon-block' ) }
						help={ __(
							'Briefly describe the icon to help screen reader users.',
							'icon-block'
						) }
						value={ label || '' }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>
					<DimensionControl
						label={ __( 'Width', 'icon-block' ) }
						value={ width }
						onChange={ ( value ) =>
							setAttributes( { width: value } )
						}
					/>
					{ height !== undefined && (
						<DimensionControl
							label={ __( 'Height', 'icon-block' ) }
							value={ height }
							onChange={ ( value ) =>
								setAttributes( { height: value } )
							}
							units={ [ 'px', 'em', 'rem', 'vh', 'vw' ] }
						/>
					) }
				</OptionsPanel>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelColorGradientSettings
					className="outermost-icon-block__color-settings"
					title={ __( 'Color' ) }
					initialOpen={ true }
					enableAlpha={ true }
					settings={ [
						{
							colorValue: iconColor.color || iconColorValue,
							onColorChange: ( colorValue ) => {
								setIconColor( colorValue );
								setAttributes( {
									iconColorValue: colorValue,
								} );
							},
							label: __( 'Icon color', 'icon-block' ),
						},
						{
							colorValue:
								iconBackgroundColor.color ||
								iconBackgroundColorValue,
							onColorChange: ( colorValue ) => {
								setIconBackgroundColor( colorValue );
								setAttributes( {
									iconBackgroundColorValue: colorValue,
								} );
							},
							gradientValue,
							onGradientChange: setGradient,
							label: __( 'Background color', 'icon-block' ),
						},
					] }
					__experimentalHasMultipleOrigins={ true }
				>
					{ ( iconColor.color || iconColorValue ) && (
						<>
							<p className="outermost-icon-block__color-settings__help">
								{ __(
									'Any color or fill values in the SVG icon itself will take precedent over the chosen color.',
									'icon-block'
								) }
							</p>
							<ToggleControl
								checked={ ! hasNoIconFill }
								label={ __(
									`Apply icon color to fill`,
									'icon-block'
								) }
								help={ __(
									'Set the SVG fill value to the chosen icon color. Disable as needed.',
									'icon-block'
								) }
								onChange={ () =>
									setAttributes( {
										hasNoIconFill: ! hasNoIconFill,
									} )
								}
							/>
						</>
					) }
					<ContrastChecker
						{ ...{
							textColor: iconColorValue,
							backgroundColor: iconBackgroundColorValue,
						} }
						isLargeText={ false }
					/>
				</PanelColorGradientSettings>
			</InspectorControls>
			<InspectorControls __experimentalGroup="advanced">
				<TextControl
					label={ __( 'Link rel', 'icon-block' ) }
					value={ linkRel || '' }
					onChange={ ( value ) =>
						setAttributes( { linkRel: value } )
					}
				/>
				<TextControl
					label={ __( 'Title attribute', 'icon-block' ) }
					className="outermost-icon-block__title-control"
					value={ title || '' }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					help={
						<>
							{ __(
								'Describe the role of this icon on the page.',
								'icon-block'
							) }
							<ExternalLink href="https://www.w3.org/TR/html52/dom.html#the-title-attribute">
								{ __(
									'Note: many devices and browsers do not display this text',
									'icon-block'
								) }
							</ExternalLink>
						</>
					}
				/>
			</InspectorControls>
		</>
	);

	const blockProps = useBlockProps();
	const borderProps = getBorderClassesAndStyles( attributes );
	const themeIconBackgroundColor =
		iconBackgroundColor?.slug || attributes.iconBackgroundColor;
	const themeIconColor = iconColor?.slug || attributes.iconColor;

	const iconClasses = classnames( 'icon-container', borderProps?.className, {
		'has-icon-color': iconColor.color || iconColorValue,
		'has-no-icon-fill-color': hasNoIconFill,
		'has-icon-background-color':
			iconBackgroundColor.color ||
			iconBackgroundColorValue ||
			gradientValue,
		'has-background-gradient': gradientValue,
		[ `has-${ themeIconColor }-color` ]: themeIconColor,
		[ `has-${ themeIconBackgroundColor }-background-color` ]:
			themeIconBackgroundColor,
		[ gradientClass ]: gradientClass,
		[ `items-justified-${ itemsJustification }` ]: itemsJustification,
		[ `rotate-${ rotate }` ]: rotate,
		'flip-horizontal': flipHorizontal,
		'flip-vertical': flipVertical,
	} );

	const [ widthQuantity, widthUnit ] =
		parseQuantityAndUnitFromRawValue( width );

	// Default icon width when there is no height set.
	let iconWidth = ! height ? '48px' : undefined;

	if ( widthQuantity ) {
		iconWidth = widthUnit
			? `${ widthQuantity }${ widthUnit }`
			: `${ widthQuantity }px`;
	}

	const iconStyles = {
		background: gradientValue,
		backgroundColor: iconBackgroundColorValue,
		...blockProps.style,
		...borderProps.style,
		color: iconColorValue,
		width: iconWidth,
		height: height || undefined,

		// Margin is applied to the wrapper container, so unset.
		marginBottom: undefined,
		marginLeft: undefined,
		marginRight: undefined,
		marginTop: undefined,
	};

	// And even though margin is set on the main block div, we need to handle it
	// manually since all other styles are applied to the inner div.
	const blockMargin = {
		marginBottom: blockProps.style?.marginBottom,
		marginLeft: blockProps.style?.marginLeft,
		marginRight: blockProps.style?.marginRight,
		marginTop: blockProps.style?.marginTop,
	};

	const iconMarkup = (
		<>
			{ ! icon && ! iconName ? (
				<IconPlaceholder
					setInserterOpen={ setInserterOpen }
					isQuickInserterOpen={ isQuickInserterOpen }
					setQuickInserterOpen={ setQuickInserterOpen }
					isCustomInserterOpen={ isCustomInserterOpen }
					setCustomInserterOpen={ setCustomInserterOpen }
					setAttributes={ setAttributes }
					enableCustomIcons={ enableCustomIcons }
				/>
			) : (
				<div
					ref={ iconRef }
					className={ iconClasses }
					style={ iconStyles }
				>
					{ printedIcon }
				</div>
			) }
		</>
	);

	return (
		<>
			{ blockControls }
			{ inspectorControls }
			<div
				{ ...useBlockProps( {
					className:
						itemsJustification &&
						`items-justified-${ itemsJustification }`,
					ref,
					onKeyDown,
				} ) }
				// This is a bit of a hack. we only want the margin styles
				// applied to the main block div.
				style={ blockMargin }
			>
				{ iconMarkup }
			</div>
			<InserterModal
				isInserterOpen={ isInserterOpen }
				setInserterOpen={ setInserterOpen }
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			{ enableCustomIcons && (
				<CustomInserterModal
					isCustomInserterOpen={ isCustomInserterOpen }
					setCustomInserterOpen={ setCustomInserterOpen }
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
			) }
		</>
	);
}

const iconColorAttributes = {
	iconColor: 'icon-color',
	iconBackgroundColor: 'icon-background-color',
};

export default withColors( iconColorAttributes )( Edit );
