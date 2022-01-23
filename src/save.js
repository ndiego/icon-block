/**
 * External dependencies
 */
import classnames from 'classnames';
import parse, { domToReact } from 'html-react-parser';
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
	} = props.attributes;

	// If there is no icon and iconName, don't save anything.
	if ( ! icon && ! iconName ) {
		return null;
	}

	const namedIcon = icons.filter( ( i ) => i.name === iconName );
	let customIcon = '';

	if ( icon && isEmpty( namedIcon ) ) {
		const newIcon = icon.trim();

		const parseOptions = {
			trim: true,
			replace: ( { attribs, children, name, parent, type } ) => {
				// TODO: Very basic SVG sanitization, needs more refinement.
				if (
					type !== 'tag' ||
					( ! parent && name !== 'svg' ) ||
					! name
				) {
					return <></>;
				}
				// Hyphens or colons in attribute names are lost in the default process of
				// html-react-parser. Spreading the attribs object as props avoids the loss.
				const Tag = `${ name }`;
				return (
					<Tag { ...attribs }>
						{ domToReact( children, parseOptions ) }
					</Tag>
				);
			},
		};

		customIcon = parse( newIcon, parseOptions );

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

	if ( label ) {
		//printedIcon.setAttributes( 'aria-label', label );
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

	let margin = style?.spacing?.margin ?? undefined;
	let padding = style?.spacing?.padding ?? undefined;

	// We are not adding the padding to the primary block div, so need to handle
	// the formatting ourselves.
	if ( padding ) {
		padding = `${ padding.top } ${ padding.right } ${ padding.bottom } ${ padding.left }`;
	}

	// And even though margin is set on the main block div, we need to handle it
	// manually since all other styles are applied to the inner div.
	if ( margin ) {
		margin = `${ margin.top } ${ margin.bottom }`;
	}

	const styles = {
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

	if ( linkUrl ) {
		printedIcon = (
			<a
				className={ classes }
				href={ linkUrl }
				target={ target }
				rel={ rel }
				style={ styles }
				aria-label={ label ?? undefined }
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
			// This is a bit of a hack. we only want the margin styles
			// applied to the main block div.
			style={ { margin } }
		>
			{ printedIcon }
		</div>
	);
}
