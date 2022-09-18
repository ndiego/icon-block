/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder, Button } from '@wordpress/components';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { bolt, boltPlaceholder } from './icons/bolt';
import { QuickInserterPopover } from './inserters/quick-inserter';

export default function IconPlaceholder( props ) {
	const {
		setInserterOpen,
		isQuickInserterOpen,
		setQuickInserterOpen,
		setCustomInserterOpen,
		setAttributes,
		enableCustomIcons,
	} = props;

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
				class="components-placeholder__illustration"
				icon={ boltPlaceholder }
			/>
			<Button isPrimary onClick={ () => setQuickInserterOpen( true ) }>
				{ __( 'Icon Library', 'icon-block' ) }
			</Button>
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
