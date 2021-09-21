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
import { bolt as defaultIcon } from './icons';

/**
 * The save function for the Icon Block.
 *
 * @param {Object} props All props passed to this function.
 * @return {WPElement}   Element to render.
 */
export default function Save( props ) {
	const {
		icon,
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

	let customIcon = '';

	if ( icon ) {
		customIcon = parse( icon, {
			trim: true,
			replace: ( domNode ) => {
				// Needs work, attempt to sanatize the svg input.
				if ( ! domNode.parent && domNode.name !== 'svg' ) {
					return defaultIcon;
				}
			},
		} );
	}

	if ( linkUrl ) {
		customIcon = (
			<a
				className={ classes }
				href={ linkUrl }
				target={ target }
				rel={ rel }
				style={ styles }
			>
				{ customIcon }
			</a>
		);
	} else {
		customIcon = (
			<div className={ classes } style={ styles }>
				{ customIcon }
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
			{ customIcon }
		</div>
	);
}
