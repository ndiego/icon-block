/**
 * External dependencies
 */
import parse, { domToReact } from 'html-react-parser';

/**
 * The save function for the Icon Block.
 *
 * @param {string} icon The HTML icon.
 * @return {Object}     The icons as a React object.
 */
export default function parseIcon( icon ) {
	const newIcon = icon.trim();

	const parseOptions = {
		trim: true,
		replace: ( { attribs, children, name, parent, type } ) => {
			if ( type !== 'tag' || ( ! parent && name !== 'svg' ) || ! name ) {
				return <></>;
			}

			// Hyphens or colons in attribute names are lost in the default
			// process of html-react-parser. Spreading the attribs object as
			// props avoids the loss. Style does need to be handled separately.
			const Tag = `${ name }`;
			return (
				<Tag { ...attribs } style={ parseStyles( attribs?.style ) }>
					{ domToReact( children, parseOptions ) }
				</Tag>
			);
		},
	};

	return parse( newIcon, parseOptions );
}

/**
 * The style attribute needs to be parsed separately.
 *
 * @param {string} stylesString All styles in a string.
 * @return {Object}             All styles in object form.
 */
function parseStyles( stylesString ) {
	let stylesObject = {};

	if ( typeof stylesString === 'string' ) {
		stylesObject = stylesString
			.split( ';' )
			.reduce( ( allStyles, style ) => {
				const colonPosition = style.indexOf( ':' );

				if ( colonPosition === -1 ) {
					return allStyles;
				}

				const camelCaseProperty = style
					.substr( 0, colonPosition )
					.trim()
					.replace( /^-ms-/, 'ms-' )
					.replace( /-./g, ( c ) => c.substr( 1 ).toUpperCase() );
				const styleValue = style.substr( colonPosition + 1 ).trim();

				return styleValue
					? { ...allStyles, [ camelCaseProperty ]: styleValue }
					: allStyles;
			}, {} );
	}

	return stylesObject;
}
