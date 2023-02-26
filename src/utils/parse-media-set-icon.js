/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';

/**
 * Parse a saved SVG file in the Media Library as a string and
 * set the icon attribute.
 *
 * @param {Object}   media         The media object for the selected SVG file.
 * @param {Function} setAttributes Sets the block attributes.
 */
export function parseMediaSetIcon( media, setAttributes ) {
	if ( ! media.url?.endsWith( '.svg' ) ) {
		displayFailureMessage( 'fileType' );
		return '';
	}

	return fetch( media.url )
		.then( ( response ) => response.text() )
		.then( ( rawString ) => {
			const svgDoc = new window.DOMParser().parseFromString(
				rawString,
				'image/svg+xml'
			);
			let svgString = '';

			// TODO: Very basic SVG sanitization, likely needs more refinement.
			if (
				svgDoc.childNodes.length === 1 &&
				svgDoc.firstChild.nodeName === 'svg'
			) {
				svgString = new window.XMLSerializer().serializeToString(
					svgDoc.documentElement
				);
			}

			if ( svgString ) {
				setAttributes( {
					icon: svgString,
					iconName: '',
					width: media?.width ?? undefined,
				} );
			}

			if ( ! svgString ) {
				displayFailureMessage();
			}
		} )
		.catch( () => displayFailureMessage() );
}

/**
 * Display a snackbar message if there is an error when inserting an icon
 * from the Media Library.
 *
 * @param {string} messageType The type of message to display.
 */
function displayFailureMessage( messageType ) {
	const messages = {
		fileType: __(
			'An error occured while inserting the icon. The media selected is not an SVG.',
			'icon-block'
		),
		default: __(
			'An error occured while inserting the icon. Check that the file is valid SVG.',
			'icon-block'
		),
	};

	dispatch( 'core/notices' ).createNotice(
		'snackbar-notice',
		messageType ? messages[ messageType ] : messages.default,
		{ type: 'snackbar', isDismissible: true }
	);
}
