/**
 * External dependencies
 */
import parse, { attributesToProps, domToReact } from 'html-react-parser';

/**
 * Parse the icon sting into a React object.
 *
 * @param {string} icon The HTML icon.
 * @return {Object}     The icons as a React object.
 */
export function parseIcon( icon ) {
	const newIcon = icon.trim();

	const parseOptions = {
		trim: true,
		replace: ( { attribs, children, name, parent, type } ) => {
			if (
				( type !== 'tag' && type !== 'style' ) || // Allow svg and style tags.
				( ! parent && name !== 'svg' ) || // The only root-level element can be an svg.
				! name
			) {
				return <></>;
			}

			const Tag = `${ name }`;

			// Handle style tags differently.
			if ( type === 'style' && name === 'style' && children ) {
				// Make sure it's not an empty style elements.
				if ( children[ 0 ]?.data ) {
					return (
						<Tag { ...attributesToProps( attribs ) }>
							{ children[ 0 ].data }
						</Tag>
					);
				}
				return <></>;
			}

			// Hyphens or colons in attribute names are lost in the default
			// process of html-react-parser. Spreading the attribs object as
			// props avoids the loss. Style does need to be handled separately.
			return (
				<Tag
					{ ...attributesToProps( attribs ) }
					style={ parseStyles( attribs?.style ) }
				>
					{ domToReact( children, parseOptions ) }
				</Tag>
			);
		},
	};

	return parse( newIcon, parseOptions );
}

/**
 * Parse the style attributes separately.
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
