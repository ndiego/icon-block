/**
 * External dependencies
 */
import parse, { domToReact } from 'html-react-parser';

/**
 * The save function for the Icon Block.
 *
 * @param {string} icon The HTML icon.
 * @return {Objecy}     The icons as a React object.
 */
export default function parseIcon( icon ) {
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

    return parse( newIcon, parseOptions );
}