/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Modal,
	Notice,
	RangeControl,
	TextareaControl,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { bolt } from './../../icons/bolt';
import { parseIcon } from './../../utils';

export default function CustomInserterModal( props ) {
	const {
		isCustomInserterOpen,
		setCustomInserterOpen,
		attributes,
		setAttributes,
	} = props;
	const { icon, iconName } = attributes;
	const [ customIcon, setCustomIcon ] = useState( ! iconName ? icon : '' );
	const [ iconSize, setIconSize ] = useState( 100 );

	// Reset values when modal is closed.
	useEffect( () => {
		if ( ! isCustomInserterOpen ) {
			setCustomIcon( ! iconName ? icon : '' );
			setIconSize( 100 );
		}
	}, [ isCustomInserterOpen, icon, iconName ] );

	// If a SVG icon is inserted from the Media Library, we need to update
	// the custom icon editor in the modal.
	useEffect( () => {
		if ( icon !== customIcon ) {
			setCustomIcon( icon );
		}
	}, [ customIcon, icon ] );

	if ( ! isCustomInserterOpen ) {
		return null;
	}

	const insertCustomIcon = () => {
		setAttributes( {
			icon: customIcon,
			iconName: '',
		} );
		setCustomInserterOpen( false );
	};

	const closeModal = () => {
		setCustomInserterOpen( false );
	};

	let iconToRender = parseIcon( customIcon );
	const isSVG = ! isEmpty( iconToRender?.props );

	// Render the defualt lightning bolt if the icon is not a valid SVG.
	iconToRender = isSVG ? iconToRender : bolt;

	return (
		<Modal
			className="wp-block-outermost-icon-custom-inserter__modal"
			title={ __( 'Custom Icon', 'icon-block' ) }
			onRequestClose={ closeModal }
			isFullScreen
		>
			<div className="icon-custom-inserter">
				<div className="icon-custom-inserter__content">
					<TextareaControl
						label={ __( 'Custom icon', 'icon-block' ) }
						hideLabelFromVision
						value={ customIcon }
						onChange={ setCustomIcon }
						placeholder={ __(
							'Paste the SVG code for your custom icon.',
							'icon-block'
						) }
					/>
				</div>
				<div className="icon-custom-inserter__sidebar">
					<IconPreview
						iconToRender={ isSVG ? iconToRender : bolt }
						iconSize={ iconSize }
						setIconSize={ setIconSize }
						isSVG={ isSVG }
					/>
					{ customIcon && ! isSVG && (
						<Notice status="error" isDismissible={ false }>
							{ __(
								'The custom icon does not appear to be in a valid SVG format or contains non-SVG elements.',
								'icon-block'
							) }
						</Notice>
					) }
					<IconInsertButtons
						customIcon={ customIcon }
						isSVG={ isSVG }
						onClear={ () => setCustomIcon( '' ) }
						onInsert={ insertCustomIcon }
					/>
				</div>
			</div>
		</Modal>
	);
}

function IconPreview( { iconToRender, iconSize, setIconSize, isSVG } ) {
	return (
		<div className="icon-preview">
			<div
				className={ classnames( 'icon-preview__window', {
					'is-default': ! isSVG,
				} ) }
			>
				<Icon icon={ iconToRender } size={ iconSize } />
			</div>
			<div className="icon-controls">
				<div className="icon-controls__size">
					<span>{ __( 'Preview size', 'icon-block' ) }</span>
					<RangeControl
						min={ 24 }
						max={ 400 }
						value={ iconSize }
						onChange={ setIconSize }
						withInputField={ false }
					/>
				</div>
			</div>
		</div>
	);
}

function IconInsertButtons( { customIcon, isSVG, onClear, onInsert } ) {
	return (
		<div className="icon-insert-buttons">
			<Button
				label={ __( 'Clear custom icon', 'icon-block' ) }
				variant="secondary"
				disabled={ ! customIcon }
				onClick={ onClear }
			>
				{ __( 'Clear', 'icon-block' ) }
			</Button>
			<Button
				label={ __( 'Insert custom icon', 'icon-block' ) }
				variant="primary"
				disabled={ ! isSVG || ! customIcon }
				onClick={ onInsert }
			>
				{ __( 'Insert custom icon', 'icon-block' ) }
			</Button>
		</div>
	);
}
