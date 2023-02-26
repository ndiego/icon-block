/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Placeholder } from '@wordpress/components';
import { MediaUpload } from '@wordpress/block-editor';
import { Icon } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { bolt, boltPlaceholder } from './../../icons/bolt';
import { parseMediaSetIcon } from '../../utils';
import QuickInserterPopover from './../quick-inserter';

export default function IconPlaceholder( props ) {
	const {
		setInserterOpen,
		isQuickInserterOpen,
		setQuickInserterOpen,
		setCustomInserterOpen,
		setAttributes,
		enableCustomIcons,
	} = props;

	// Allowed types for the current WP_User
	const allowedMimeTypes = useSelect( ( select ) => {
		const { getSettings } = select( 'core/block-editor' );
		return getSettings().allowedMimeTypes;
	}, [] );

	const isSVGAllowed =
		Object.values( allowedMimeTypes ).includes( 'image/svg+xml' );

	const instructions = enableCustomIcons
		? __(
				'Choose an icon from the library or add your own custom SVG graphic.',
				'icon-block'
		  )
		: __(
				'Browse the icon library and choose one to insert.',
				'icon-block'
		  );

	return (
		<Placeholder
			className="has-illustration"
			icon={ bolt }
			label={ __( 'Icon' ) }
			instructions={ instructions }
		>
			<Icon
				className="components-placeholder__illustration"
				icon={ boltPlaceholder }
			/>
			<Button isPrimary onClick={ () => setQuickInserterOpen( true ) }>
				{ __( 'Icon Library', 'icon-block' ) }
			</Button>
			{ isSVGAllowed && (
				<MediaUpload
					onSelect={ ( media ) =>
						parseMediaSetIcon( media, setAttributes )
					}
					allowedTypes={ [ 'image/svg+xml' ] }
					render={ ( { open } ) => (
						<Button isTertiary onClick={ open }>
							{ __( 'Open Media Library' ) }
						</Button>
					) }
				/>
			) }
			{ enableCustomIcons && (
				<Button
					isTertiary
					onClick={ () => setCustomInserterOpen( true ) }
				>
					{ __( 'Insert custom SVG', 'icon-block' ) }
				</Button>
			) }
			<QuickInserterPopover
				setInserterOpen={ setInserterOpen }
				isQuickInserterOpen={ isQuickInserterOpen }
				setQuickInserterOpen={ setQuickInserterOpen }
				setAttributes={ setAttributes }
			/>
		</Placeholder>
	);
}
