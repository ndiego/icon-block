/**
 * External dependencies
 */
import classnames from 'classnames';
import parse from 'html-react-parser';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import icons from './icons';

/**
 * The save function for the Icon Block.
 *
 * @param {Object} props All props passed to this function.
 * @return {WPElement}   Element to render.
 */
export default function Save( props ) {
	const {
		icon,
		iconName,
		style,
		iconBackgroundColor,
		iconBackgroundColorValue,
		iconColorValue,
		gradient,
		customGradient,
		itemsJustification,
		linkUrl,
		linkRel,
		linkTarget,
		rotate,
		flipHorizontal,
		flipVertical,
		width,
		percentWidth,
	} = props.attributes;

	// If there is no icon and iconName, don't save anything.
	if ( ! icon && ! iconName ) {
		return null;
	}

	const namedIcon = icons.filter( ( i ) => i.name === iconName );
	let customIcon = '';

	if ( icon && isEmpty( namedIcon ) ) {
		const newIcon = icon.trim();

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
			customIcon = '';
		}
	}

	let printedIcon = ! isEmpty( namedIcon )
		? namedIcon[ 0 ]?.icon
		: customIcon;

	// If there is no valid SVG icon, don't save anything.
	if ( ! printedIcon ) {
		return null;
	}

	const classes = classnames( 'icon-container', {
		'has-icon-color': iconColorValue,
		'has-background-color':
			iconBackgroundColorValue ||
			iconBackgroundColor ||
			gradient ||
			customGradient,
		[ `has-${ iconBackgroundColor }-background-color` ]: iconBackgroundColor,
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

	const radius = style?.border?.radius ?? undefined;
	let padding = style?.spacing?.padding ?? undefined;

	if ( padding ) {
		padding = `${ padding.top } ${ padding.right } ${ padding.bottom } ${ padding.left }`;
	}

	const styles = {
		background: ! gradient ? customGradient : undefined,
		backgroundColor: ! iconBackgroundColor
			? iconBackgroundColorValue
			: undefined,
		borderRadius: radius,
		color: iconColorValue,
		padding,
		width: iconWidth,
	};

	if ( linkUrl ) {
		printedIcon = (
			<a
				className={ classes }
				href={ linkUrl }
				target={ target }
				rel={ rel }
				style={ styles }
			>
				{ printedIcon }
			</a>
		);
	} else {
		printedIcon = (
			<div className={ classes } style={ styles }>
				{ printedIcon }
			</div>
		);
	}

	return (
		<div
			{ ...useBlockProps.save( {
				className: `items-justified-${ itemsJustification }`,
			} ) }
			// This is a bit of a hack, so the styles are not printed.
			style={ {} }
		>
			{ printedIcon }
		</div>
	);
}
