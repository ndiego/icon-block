/**
 * External dependencies
 */
import classnames from 'classnames';
import parse from 'html-react-parser';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	ButtonGroup,
	Icon,
	Notice,
	PanelBody,
	Popover,
	RangeControl,
	TextareaControl,
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
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
	__experimentalUseGradient as useGradient,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';
import { useRef, useState } from '@wordpress/element';
import { displayShortcut, isKeyboardEvent } from '@wordpress/keycodes';
import {
	flipHorizontal as flipH,
	flipVertical as flipV,
	link,
	linkOff,
	rotateRight,
} from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';
import { bolt as defaultIcon } from './icons';

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
		isSelected,
		setAttributes,
		setIconBackgroundColor,
		setIconColor,
	} = props;
	const {
		icon,
		style,
		iconBackgroundColorValue,
		iconColorValue,
		itemsJustification,
		linkUrl,
		linkTarget,
		linkRel,
		rotate,
		flipHorizontal,
		flipVertical,
		width,
		percentWidth,
	} = attributes;
	const { gradientClass, gradientValue, setGradient } = useGradient();

	let isSVG = true;
	let customIcon = defaultIcon;

	if ( icon ) {
		let newIcon = icon.trim();

		customIcon = parse( newIcon, {
			trim: true,
			replace: ( domNode ) => {
				// TODO: Very basic SVG sanitization, needs more refinement.
				if (
					domNode.type !== 'tag' ||
					( ! domNode.parent && domNode.name !== 'svg' ) ||
					! domNode.name
				) {
					return <></>;
				}
			},
		} );

		if ( isEmpty( customIcon?.props ) ) {
			customIcon = defaultIcon;
		}

		isSVG = customIcon === defaultIcon ? false : true;
	}

	function updateIcon( newIcon ) {
		// TODO: Add sanitization in the future.
		setAttributes( { icon: newIcon.replace(/\s+/g, ' ') } );
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

	const radius = style?.border?.radius ?? undefined;
	let padding = style?.spacing?.padding ?? undefined;

	// We are not adding the padding to the primary block div, so need to handle
	// the formatting ourselves.
	if ( padding ) {
		padding = `${ padding.top } ${ padding.right } ${ padding.bottom } ${ padding.left }`;
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
			<BlockControls>
				<ToolbarGroup>
					{ ! isURLSet && (
						<ToolbarButton
							name="link"
							icon={ link }
							title={ __( 'Link', 'icon-block' ) }
							shortcut={ displayShortcut.primary( 'k' ) }
							onClick={ startEditing }
						/>
					) }
					{ isURLSet && (
						<ToolbarButton
							name="link"
							icon={ linkOff }
							title={ __( 'Unlink', 'icon-block' ) }
							shortcut={ displayShortcut.primaryShift( 'k' ) }
							onClick={ unlink }
							isActive={ true }
						/>
					) }
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
			</BlockControls>
			{ isSelected && ( isEditingURL || isURLSet ) && (
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
						forceIsEditingLink={ isEditingURL }
					/>
				</Popover>
			) }
		</>
	);

	const inspectorControls = (
		<InspectorControls>
			<PanelBody
				className="outermost-icon-block__icon-settings"
				title={ __( 'Icon settings', 'icon-block' ) }
			>
				<TextareaControl
					label={ __( 'Icon', 'icon-block' ) }
					value={ icon }
					onChange={ updateIcon }
					help={ __( 'Paste an SVG icon or graphic.', 'icon-block' ) }
					rows={ 6 }
				/>
				{ ! isSVG && (
					<Notice status="error" isDismissible={ false }>
						{ __(
							'The icon does not appear to be in an SVG format or contains non-SVG elements.',
							'icon-block'
						) }
					</Notice>
				) }
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
			</PanelBody>
			<div>
				<PanelColorGradientSettings
					title={ __( 'Color' ) }
					initialOpen={ true }
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
				>
					<p className="outermost-icon-block__icon-settings-help">
					 	{ __(
							'Any color/fill values in the SVG icon itself will take precedent over custom colors.',
							'icon-block'
						) }
					</p>
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

	const iconStyles = {
		background: gradientValue,
		backgroundColor: iconBackgroundColorValue,
		borderRadius: radius,
		color: iconColorValue,
		padding,
		width: iconWidth,
	};

	const blockMarkup = (
		<div ref={ iconRef } className={ iconClasses } style={ iconStyles }>
			<Icon icon={ customIcon } />
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
				// This is a bit of a hack, so the styles are not printed.
				style={ {} }
			>
				{ blockMarkup }
			</div>
		</>
	);
}

const iconColorAttributes = {
	iconColor: 'icon-color',
	iconBackgroundColor: 'icon-background-color',
};

export default withColors( iconColorAttributes )( Edit );
