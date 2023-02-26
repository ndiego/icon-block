/**
 * External dependencies
 */
import classnames from 'classnames';
import parse from 'html-react-parser';
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

export default function CustomInserterModal( props ) {
	const {
		isCustomInserterOpen,
		setCustomInserterOpen,
		attributes,
		setAttributes,
	} = props;
	const { icon, iconName } = attributes;
	const [ customIcon, setCustomIcon ] = useState( ! iconName ? icon : '' );
	const [ iconSize, setIconSize ] = useState( 48 );

	// If a SVG icon is inserted from the Media Library, we need to update the
	// custom icon editor in the modal.
	useEffect( () => setCustomIcon( icon ), [ icon ] );

	if ( ! isCustomInserterOpen ) {
		return null;
	}

	function insertCustomIcon() {
		setAttributes( {
			icon: customIcon,
			iconName: '',
		} );
		setCustomInserterOpen( false );
	}

	let isSVG = true;
	let customIconRender = '';

	if ( customIcon ) {
		const newIcon = customIcon.trim();

		customIconRender = parse( newIcon, {
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

		if ( isEmpty( customIconRender?.props ) ) {
			customIconRender = '';
		}

		isSVG = !! customIconRender;
	}

	const iconToRender = customIconRender ? customIconRender : bolt;

	return (
		<Modal
			className="wp-block-outermost-icon-custom-inserter__modal"
			title={ __( 'Custom Icon', 'icon-block' ) }
			onRequestClose={ () => setCustomInserterOpen( false ) }
			isFullScreen
		>
			<div className="icon-custom-inserter">
				<div className="icon-custom-inserter__content">
					<TextareaControl
						label={ __( 'Custom icon', 'icon-block' ) }
						hideLabelFromVision={ true }
						value={ customIcon }
						onChange={ setCustomIcon }
						placeholder={ __(
							'Paste the SVG code for your custom icon.',
							'icon-block'
						) }
					/>
				</div>
				<div className="icon-custom-inserter__sidebar">
					<div className="icon-preview">
						<div
							className={ classnames( 'icon-preview__window', {
								'is-default': ! customIconRender,
							} ) }
						>
							<Icon icon={ iconToRender } size={ iconSize } />
						</div>
						<div className="icon-controls">
							<div className="icon-controls__size">
								<span>
									{ __( 'Preview size', 'icon-block' ) }
								</span>
								<RangeControl
									min={ 24 }
									max={ 400 }
									initialPosition={ 48 }
									withInputField={ false }
									onChange={ ( value ) =>
										setIconSize( value )
									}
								/>
							</div>
						</div>
						{ ! isSVG && (
							<Notice status="error" isDismissible={ false }>
								{ __(
									'The custom icon does not appear to be in a valid SVG format or contains non-SVG elements.',
									'icon-block'
								) }
							</Notice>
						) }
					</div>
					<div className="icon-insert-buttons">
						<Button
							label={ __( 'Clear custom icon', 'icon-block' ) }
							isSecondary
							disabled={ ! customIcon }
							onClick={ () => setCustomIcon( '' ) }
						>
							{ __( 'Clear', 'icon-block' ) }
						</Button>
						<Button
							label={ __( 'Insert custom icon', 'icon-block' ) }
							isPrimary
							disabled={ ! isSVG || ! customIcon }
							onClick={ insertCustomIcon }
						>
							{ __( 'Insert custom icon', 'icon-block' ) }
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}
