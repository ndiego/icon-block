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
	Button,
	ButtonGroup,
	Disabled,
	Dropdown,
	MenuItem,
	NavigableMenu,
	PanelBody,
	Popover,
	RangeControl,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
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
} from '@wordpress/block-editor';
import { useRef, useState } from '@wordpress/element';
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import {
	flipHorizontal as flipH,
	flipVertical as flipV,
	link,
	rotateRight,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './icons';
import { bolt as defaultIcon } from './icons/bolt';
import parseIcon from './utils/parse-icon';
import InserterModal from './inserters/inserter';
import CustomInserterModal from './inserters/custom-inserter';
import IconPlaceholder from './placeholder';

const NEW_TAB_REL = 'noreferrer noopener';

function PercentWidthPanel( { selectedWidth, setAttributes } ) {
	function handleChange( newWidth ) {
		// Check if we are toggling the width off
		const percentWidth = selectedWidth === newWidth ? undefined : newWidth;

		// Update attributes
		setAttributes( { percentWidth } );
	}

	return (
		<ButtonGroup aria-label={ __( 'Icon percent width', 'icon-block' ) }>
			{ [ 25, 50, 75, 100 ].map( ( widthValue ) => {
				return (
					<Button
						key={ widthValue }
						isSmall
						isPrimary={ widthValue === selectedWidth }
						isPressed={ widthValue === selectedWidth }
						onClick={ () => handleChange( widthValue ) }
					>
						{ widthValue }%
					</Button>
				);
			} ) }
		</ButtonGroup>
	);
}

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
		borderColor,
		flipHorizontal,
		flipVertical,
		label,
		linkRel,
		linkTarget,
		linkUrl,
		icon,
		iconBackgroundColorValue,
		iconColorValue,
		iconName,
		itemsJustification,
		percentWidth,
		rotate,
		style,
		width,
	} = attributes;
	const { gradientClass, gradientValue, setGradient } = useGradient();

	const [ isInserterOpen, setInserterOpen ] = useState( false );
	const [ isQuickInserterOpen, setQuickInserterOpen ] = useState( false );
	const [ isCustomInserterOpen, setCustomInserterOpen ] = useState( false );

	const namedIcon = icons.filter( ( i ) => i.name === iconName );

	let customIcon = defaultIcon;

	if ( icon && isEmpty( namedIcon ) ) {
		customIcon = parseIcon( icon );

		if ( isEmpty( customIcon?.props ) ) {
			customIcon = defaultIcon;
		}
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

	let iconWidth = width ? `${ width }px` : '48px';

	if ( percentWidth ) {
		iconWidth = `${ percentWidth }%`;
	}

	const ref = useRef();
	const iconRef = useRef();
	const [ isEditingURL, setIsEditingURL ] = useState( false );
	const isURLSet = !! linkUrl;
	const opensInNewTab = linkTarget === '_blank';

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

	let linkRelMarkup = (
		<TextControl
			label={ __( 'Link rel', 'social-sharing-block' ) }
			value={ linkRel }
			onChange={ ( value ) => setAttributes( { linkRel: value } ) }
		/>
	);

	if ( ! linkUrl ) {
		linkRelMarkup = <Disabled>{ linkRelMarkup }</Disabled>;
	}

	const inspectorControls = ( icon || iconName ) && (
		<InspectorControls>
			<PanelBody
				className="outermost-icon-block__icon-settings"
				title={ __( 'Settings', 'icon-block' ) }
			>
				<TextControl
					label={ __( 'Icon label', 'social-sharing-block' ) }
					help={ __(
						'Briefly describe the icon to help screen reader users.',
						'icon-block'
					) }
					value={ label }
					onChange={ ( value ) => setAttributes( { label: value } ) }
				/>
				<div className="outermost-icon-block__icon-settings__width">
					<RangeControl
						label={ __( 'Icon width', 'icon-block' ) }
						onChange={ ( value ) => setAttributes( { width: value } ) }
						value={ width || '' }
						min={ 10 }
						max={ 1000 }
						initialPosition={ 48 }
						allowReset={ true }
						resetFallbackValue={ 48 }
						disabled={ percentWidth }
					/>
					<PercentWidthPanel
						selectedWidth={ percentWidth }
						setAttributes={ setAttributes }
					/>
				</div>
				{ linkRelMarkup }
			</PanelBody>
			<div>
				<PanelColorGradientSettings
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
					{ ! iconName && (
						<p className="outermost-icon-block__icon-settings-help">
							{ __(
								'Any color/fill values in the SVG icon itself will take precedent over custom colors.',
								'icon-block'
							) }
						</p>
					) }
				</PanelColorGradientSettings>
				<ContrastChecker
					{ ...{
						textColor: iconColorValue,
						backgroundColor: iconBackgroundColorValue,
					} }
					isLargeText={ false }
				/>
			</div>
		</InspectorControls>
	);

	const iconClasses = classnames( {
		'has-background-gradient': gradientValue,
		[ gradientClass ]: gradientClass,
	} );

	let margin = style?.spacing?.margin ?? undefined;
	let padding = style?.spacing?.padding ?? undefined;

	// We are not adding the padding to the primary block div, so need to handle
	// the formatting ourselves.
	if ( padding ) {
		padding = `${ padding?.top ?? 0 } ${ padding?.right ?? 0 } ${ padding?.bottom ?? 0 } ${ padding?.left ?? 0 }`; // eslint-disable-line
	}

	// And even though margin is set on the main block div, we need to handle it
	// manually since all other styles are applied to the inner div.
	if ( margin ) {
		margin = `${ margin?.top ?? 0 } ${ margin?.right ?? 0 } ${ margin?.bottom ?? 0 } ${ margin?.left ?? 0 }`; // eslint-disable-line
	}

	const iconStyles = {
		background: gradientValue,
		backgroundColor: iconBackgroundColorValue,
		borderColor: borderColor
			? `var(--wp--preset--color--${ borderColor })`
			: style?.border?.color ?? undefined,
		borderRadius: style?.border?.radius ?? undefined,
		borderStyle: style?.border?.style ?? undefined,
		borderWidth: style?.border?.width ?? undefined,
		color: iconColorValue,
		padding,
		width: iconWidth,
	};

	const printedIcon = ! isEmpty( namedIcon )
		? namedIcon[ 0 ].icon
		: customIcon;

	const blockMarkup = (
		<div ref={ iconRef } className={ iconClasses } style={ iconStyles }>
			{ printedIcon }
		</div>
	);

	// Block classes.
	const blockClasses = classnames( {
		'has-icon-color': iconColor.color || iconColorValue,
		'has-background-color':
			iconBackgroundColor.color ||
			iconBackgroundColorValue ||
			gradientValue,
		[ `items-justified-${ itemsJustification }` ]: itemsJustification,
		[ `rotate-${ rotate }` ]: rotate,
		'flip-horizontal': flipHorizontal,
		'flip-vertical': flipVertical,
	} );

	return (
		<>
			{ blockControls }
			{ inspectorControls }
			<div
				{ ...useBlockProps( {
					ref,
					onKeyDown,
					className: blockClasses,
				} ) }
				// This is a bit of a hack. we only want the margin styles
				// applied to the main block div.
				style={ { margin } }
			>
				{ [
					! icon && ! iconName && (
						<IconPlaceholder
							setInserterOpen={ setInserterOpen }
							isQuickInserterOpen={ isQuickInserterOpen }
							setQuickInserterOpen={ setQuickInserterOpen }
							isCustomInserterOpen={ isCustomInserterOpen }
							setCustomInserterOpen={ setCustomInserterOpen }
							setAttributes={ setAttributes }
						/>
					),
					( icon || iconName ) && blockMarkup,
				] }
			</div>
			<InserterModal
				isInserterOpen={ isInserterOpen }
				setInserterOpen={ setInserterOpen }
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<CustomInserterModal
				isCustomInserterOpen={ isCustomInserterOpen }
				setCustomInserterOpen={ setCustomInserterOpen }
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
		</>
	);
}

const iconColorAttributes = {
	iconColor: 'icon-color',
	iconBackgroundColor: 'icon-background-color',
};

export default withColors( iconColorAttributes )( Edit );
