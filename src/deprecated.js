/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
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

const blockAttributes = {
	icon: {
		type: 'string',
		source: 'html',
		selector: '.icon-container',
		default: '',
	},
	iconName: {
		type: 'string',
	},
	itemsJustification: {
		type: 'string',
	},
	iconBackgroundColor: {
		type: 'string',
	},
	customIconBackgroundColor: {
		type: 'string',
	},
	iconBackgroundColorValue: {
		type: 'string',
	},
	iconColor: {
		type: 'string',
	},
	customIconColor: {
		type: 'string',
	},
	iconColorValue: {
		type: 'string',
	},
	gradient: {
		type: 'string',
	},
	customGradient: {
		type: 'string',
	},
	label: {
		type: 'string',
	},
	linkUrl: {
		type: 'string',
	},
	linkRel: {
		type: 'string',
	},
	linkTarget: {
		type: 'string',
	},
	rotate: {
		type: 'number',
	},
	flipHorizontal: {
		type: 'boolean',
	},
	flipVertical: {
		type: 'boolean',
	},
	width: {
		type: 'number',
	},
	percentWidth: {
		type: 'number',
	},
};

const blockSupports = {
	align: true,
	html: false,
	__experimentalBorder: {
		color: true,
		radius: true,
		style: true,
		width: true,
	},
	spacing: {
		padding: true,
		margin: true,
	},
};

const v1 = {
	attributes: blockAttributes,
	supports: blockSupports,
	save( { attributes } ) {
		const {
			borderColor,
			icon,
			iconName,
			style,
			iconBackgroundColor,
			iconBackgroundColorValue,
			iconColorValue,
			gradient,
			customGradient,
			itemsJustification,
			label,
			linkUrl,
			linkRel,
			linkTarget,
			rotate,
			flipHorizontal,
			flipVertical,
			width,
			percentWidth,
		} = attributes;

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

		const classes = classnames( 'icon-container', {
			'has-icon-color': iconColorValue,
			'has-background-color':
				iconBackgroundColorValue ||
				iconBackgroundColor ||
				gradient ||
				customGradient,
			[ `has-${ iconBackgroundColor }-background-color` ]:
				iconBackgroundColor,
			[ `has-${ gradient }-gradient-background` ]: gradient,
			[ `rotate-${ rotate }` ]: rotate,
			'flip-horizontal': flipHorizontal,
			'flip-vertical': flipVertical,
		} );

		const rel = isEmpty( linkRel ) ? undefined : linkRel;
		const target = isEmpty( linkTarget ) ? undefined : linkTarget;

		let iconWidth = width ? `${ width }px` : '48px';

		if ( percentWidth ) {
			iconWidth = `${ percentWidth }%`;
		}

		let margin = style?.spacing?.margin ?? undefined;
		let padding = style?.spacing?.padding ?? undefined;

		// We are not adding the padding to the primary block div, so need to handle
		// the formatting ourselves.
		if ( padding ) {
			padding = `${ padding?.top ?? 0 } ${ padding?.right ?? 0 } ${
				padding?.bottom ?? 0
			} ${ padding?.left ?? 0 }`;
		}

		// And even though margin is set on the main block div, we need to handle it
		// manually since all other styles are applied to the inner div.
		if ( margin ) {
			margin = `${ margin?.top ?? 0 } ${ margin?.right ?? 0 } ${
				margin?.bottom ?? 0
			} ${ margin?.left ?? 0 }`;
		}

		const iconStyles = {
			background: ! gradient ? customGradient : undefined,
			backgroundColor: ! iconBackgroundColor
				? iconBackgroundColorValue
				: undefined,
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

		const iconMarkup = (
			<>
				{ linkUrl ? (
					<a
						className={ classes }
						href={ linkUrl }
						target={ target }
						rel={ rel }
						style={ iconStyles }
						aria-label={ label }
					>
						{ printedIcon }
					</a>
				) : (
					<div className={ classes } style={ iconStyles }>
						{ printedIcon }
					</div>
				) }
			</>
		);

		return (
			<div
				{ ...useBlockProps.save( {
					className: `items-justified-${ itemsJustification }`,
					style: {
						// We have to mark all new style attributes as undefined
						// otherwise the deprecation will fail.
						borderColor: undefined,
						borderRadius: undefined,
						borderStyle: undefined,
						borderWidth: undefined,
						borderBottomColor: undefined,
						borderBottomLeftRadius: undefined,
						borderBottomRightRadius: undefined,
						borderBottomStyle: undefined,
						borderBottomWidth: undefined,
						borderLeftColor: undefined,
						borderLeftStyle: undefined,
						borderLeftWidth: undefined,
						borderRightColor: undefined,
						borderRightStyle: undefined,
						borderRightWidth: undefined,
						borderTopColor: undefined,
						borderTopLeftRadius: undefined,
						borderTopRightRadius: undefined,
						borderTopStyle: undefined,
						borderTopWidth: undefined,
						marginBottom: undefined,
						marginLeft: undefined,
						marginRight: undefined,
						marginTop: undefined,
						paddingBottom: undefined,
						paddingLeft: undefined,
						paddingRight: undefined,
						paddingTop: undefined,

						// This is a bit of a hack. we only want the margin styles
						// applied to the main block div.
						margin,
					},
				} ) }
			>
				{ iconMarkup }
			</div>
		);
	},
};

const v2 = {
	attributes: blockAttributes,
	supports: blockSupports,
	save( { attributes } ) {
		const {
			customGradient,
			flipHorizontal,
			flipVertical,
			gradient,
			hasNoIconFill,
			icon,
			iconBackgroundColor,
			iconBackgroundColorValue,
			iconColorValue,
			iconName,
			itemsJustification,
			label,
			linkRel,
			linkTarget,
			linkUrl,
			percentWidth,
			rotate,
			title,
			width,
		} = attributes;
	
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
		const borderProps = getBorderClassesAndStyles( attributes );
	
		const iconClasses = classnames( 'icon-container', borderProps?.className, {
			'has-icon-color': iconColorValue,
			'has-icon-background-color':
				iconBackgroundColorValue ||
				iconBackgroundColor ||
				gradient ||
				customGradient,
			'has-no-icon-fill-color': hasNoIconFill,
			[ `has-${ iconBackgroundColor }-background-color` ]:
				iconBackgroundColor,
			[ `has-${ gradient }-gradient-background` ]: gradient,
			[ `rotate-${ rotate }` ]: rotate,
			'flip-horizontal': flipHorizontal,
			'flip-vertical': flipVertical,
		} );
	
		let iconWidth = width ? `${ width }px` : '48px';
	
		if ( percentWidth ) {
			iconWidth = `${ percentWidth }%`;
		}
	
		const iconStyles = {
			background: ! gradient ? customGradient : undefined,
			backgroundColor: ! iconBackgroundColor
				? iconBackgroundColorValue
				: undefined,
			...blockProps.style,
			...borderProps.style,
			color: iconColorValue,
			width: iconWidth,
	
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
}

const deprecated = [ v1, v2 ];

export default deprecated;
