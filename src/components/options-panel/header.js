/**
 * WordPress dependencies
 */
import { speak } from '@wordpress/a11y';
import { __, sprintf } from '@wordpress/i18n';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { moreVertical, check, plus } from '@wordpress/icons';

/**
 * Render the option panel header.
 *
 * @since 1.6.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function OptionsPanelHeader( props ) {
	const { label, options, activeOptions, setAttributes, attributes } = props;

	const defaultOptions = options.filter( ( option ) => option.isDefault );

	// Detect whether default options have edits. Used to determine
	// whether the reset button should be enabled.
	defaultOptions.forEach( ( option ) => {
		option.hasEdits =
			// While undefined attributes are not added to the block,
			// they still are present in the attributes object.
			attributes.hasOwnProperty( option.attributeSlug ) &&
			attributes[ option.attributeSlug ] !== undefined;
	} );

	const generalOptions = options.filter( ( option ) => ! option.isDefault );

	function toggleOptions( option, type ) {
		if ( type === 'reset' ) {
			setAttributes( { [ option.attributeSlug ]: undefined } );
		} else if ( option.isActive ) {
			setAttributes( { [ option.attributeSlug ]: undefined } );
		} else {
			setAttributes( { [ option.attributeSlug ]: '' } );
		}
	}

	function resetAllOptions() {
		options.forEach( ( option ) => {
			setAttributes( { [ option.attributeSlug ]: undefined } );
		} );
	}

	const canResetAll = [ ...defaultOptions, ...generalOptions ].some(
		( option ) =>
			( option.isActive && ! option.isDefault ) ||
			( option.isDefault && option.hasEdits )
	);

	const optionsDropdown = (
		<DropdownMenu
			className="options-dropdown"
			icon={ activeOptions.length === 0 ? plus : moreVertical }
			label={ __( 'Setting options', 'icon-block' ) }
			popoverProps={ {
				className: 'options-panel__option-popover',
				focusOnMount: 'container',
			} }
			toggleProps={ { isSmall: true } }
		>
			{ () => (
				<>
					{ defaultOptions.length !== 0 && (
						<MenuGroup label={ __( 'Defaults', 'icon-block' ) }>
							{ defaultOptions.map( ( option, index ) => (
								<DefaultOptionMenuItem
									key={ index }
									option={ option }
									toggleOptions={ toggleOptions }
								/>
							) ) }
						</MenuGroup>
					) }
					<MenuGroup label={ __( 'Options', 'icon-block' ) }>
						{ generalOptions.map( ( option, index ) => (
							<OptionMenuItem
								key={ index }
								option={ option }
								toggleOptions={ toggleOptions }
							/>
						) ) }
					</MenuGroup>
					<MenuGroup>
						<MenuItem
							aria-disabled={ ! canResetAll }
							onClick={ () => {
								if ( canResetAll ) {
									resetAllOptions();
								}
							} }
							variant="tertiary"
						>
							{ __( 'Reset all', 'icon-block' ) }
						</MenuItem>
					</MenuGroup>
				</>
			) }
		</DropdownMenu>
	);

	return (
		<div className="options-panel-header">
			<h2>{ label }</h2>
			<div className="options-panel-header__dropdown-menus">
				{ optionsDropdown }
			</div>
		</div>
	);
}

/**
 * Render a option menu item.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function OptionMenuItem( props ) {
	const { option, toggleOptions } = props;

	return (
		<MenuItem
			key={ option.attributeSlug }
			icon={ option.isActive && check }
			label={ sprintf(
				// translators: %s: The name of the option being toggled e.g. "Label".
				__( 'Toggle %s', 'icon-block' ),
				option.label
			) }
			onClick={ () => {
				toggleOptions( option );
				speak(
					sprintf(
						// translators: %s: The name of the option being toggled e.g. "Label".
						__( '%s toggled', 'icon-block' ),
						option.label
					),
					'assertive'
				);
			} }
		>
			{ option.label }
		</MenuItem>
	);
}

/**
 * Render a default option menu item.
 *
 * @since 1.4.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
function DefaultOptionMenuItem( props ) {
	const { option, toggleOptions } = props;

	if ( option.hasEdits ) {
		return (
			<MenuItem
				key={ option.attributeSlug }
				disabled={ ! option.hasEdits }
				className="has-reset"
				label={ sprintf(
					// translators: %s: The name of the option being reset e.g. "Label".
					__( 'Reset %s', 'icon-block' ),
					option.label
				) }
				onClick={ () => {
					toggleOptions( option, 'reset' );
					speak(
						sprintf(
							// translators: %s: The name of the option being reset e.g. "Label".
							__( '%s reset to default', 'icon-block' ),
							option.label
						),
						'assertive'
					);
				} }
				role="menuitem"
			>
				{ option.label }
				{ option.hasEdits && (
					<span aria-hidden="true" className="menu-item-reset">
						{ __( 'Reset', 'icon-block' ) }
					</span>
				) }
			</MenuItem>
		);
	}

	return (
		<MenuItem
			aria-disabled
			isSelected
			key={ option.attributeSlug }
			role="menuitemcheckbox"
		>
			{ option.label }
		</MenuItem>
	);
}
