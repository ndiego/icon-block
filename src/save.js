/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue } from '@wordpress/components'; // eslint-disable-line
import {
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles, // eslint-disable-line
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import getIcons from './icons';
import { flattenIconsArray } from './utils/icon-functions';
import parseIcon from './utils/parse-icon';

/**
 * The save function for the Icon Block.
 *
 * @param {Object} props All props passed to this function.
 * @return {WPElement}   Element to render.
 */
export default function Save( props ) {
	const {
		customGradient,
		flipHorizontal,
		flipVertical,
		gradient,
		hasNoIconFill,
		icon,
		iconBackgroundColor,
		iconBackgroundColorValue,
		iconColor,
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
	} = props.attributes;

	// If there is no icon and no iconName, don't save anything.
	if ( ! icon && ! iconName ) {
		return null;
	}

	const iconsAll = flattenIconsArray( getIcons() );
	const namedIcon = iconsAll.filter( ( i ) => i.name === iconName );
	let printedIcon = '';

	if ( icon && isEmpty( namedIcon ) ) {
		// Custom icons are strings and need to be parsed.
		printedIcon = parseIcon( icon );

		if ( isEmpty( printedIcon?.props ) ) {
			printedIcon = '';
		}
	} else {
		// Icon choosen from library.
		printedIcon = namedIcon[ 0 ]?.icon;

		// Icons provided by third-parties are generally strings.
		if ( typeof printedIcon === 'string' ) {
			printedIcon = parseIcon( printedIcon );
		}
	}

	// If there is no valid SVG icon, don't save anything.
	if ( ! printedIcon ) {
		return null;
	}

	// If a label is set, add as aria-label. Will overwite any aria-label in
	// custom icons.
	if ( label ) {
		printedIcon = {
			...printedIcon,
			props: { ...printedIcon.props, 'aria-label': label },
		};
	}

	const blockProps = useBlockProps.save();
	const borderProps = getBorderClassesAndStyles( props.attributes );

	const iconClasses = classnames( 'icon-container', borderProps?.className, {
		'has-icon-color': iconColorValue,
		'has-no-icon-fill-color': hasNoIconFill,
		'has-icon-background-color':
			iconBackgroundColorValue ||
			iconBackgroundColor ||
			gradient ||
			customGradient,
		[ `has-${ iconBackgroundColor }-background-color` ]:
			iconBackgroundColor,
		[ `has-${ iconColor }-color` ]: iconColor,
		[ `has-${ gradient }-gradient-background` ]: gradient,
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
		background: ! gradient ? customGradient : undefined,
		backgroundColor: iconBackgroundColorValue,
		color: iconColorValue,
		width: iconWidth,
		height: height || undefined,
		...blockProps.style,
		...borderProps.style,

		// Margin is applied to the wrapper container, so unset.
		marginBottom: undefined,
		marginLeft: undefined,
		marginRight: undefined,
		marginTop: undefined,
	};

	const blockStyles = useBlockProps.save()?.style;

	// And even though margin is set on the main block div, we need to handle it
	// manually since all other styles are applied to the inner div.
	const blockMargin = {
		marginBottom: blockStyles?.marginBottom,
		marginLeft: blockStyles?.marginLeft,
		marginRight: blockStyles?.marginRight,
		marginTop: blockStyles?.marginTop,
	};

	const rel = isEmpty( linkRel ) ? undefined : linkRel;
	const target = isEmpty( linkTarget ) ? undefined : linkTarget;

	const iconMarkup = (
		<>
			{ linkUrl ? (
				<a
					className={ iconClasses }
					href={ linkUrl }
					target={ target }
					rel={ rel }
					style={ iconStyles }
					aria-label={ label }
				>
					{ printedIcon }
				</a>
			) : (
				<div className={ iconClasses } style={ iconStyles }>
					{ printedIcon }
				</div>
			) }
		</>
	);

	return (
		<div
			{ ...useBlockProps.save( {
				className:
					itemsJustification &&
					`items-justified-${ itemsJustification }`,
			} ) }
			// This is a bit of a hack. we only want the margin styles
			// applied to the main block div.
			style={ blockMargin }
			title={ title }
		>
			{ iconMarkup }
		</div>
	);
}
