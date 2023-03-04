/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import OptionsPanelHeader from './header';

/**
 * Render the inspector control panel.
 *
 * @since 2.5.0
 * @param {Object} props All the props passed to this function
 * @return {string}		 Return the rendered JSX
 */
export default function OptionsPanel( props ) {
	const { className, label, attributes, options } = props;

	// Append the "active" property to all active options.
	options.forEach( ( option ) => {
		if (
			option?.isDefault ||
			// While undefined attributes are not added to the block,
			// they still are present in the attributes object.
			( attributes.hasOwnProperty( option.attributeSlug ) &&
				attributes[ option.attributeSlug ] !== undefined )
		) {
			option.isActive = true;
		}
	} );

	// A simple array of all active controls.
	const activeOptions = options.filter( ( option ) => option.isActive );

	return (
		<div
			className={ classnames( 'options-panel', {
				[ className ]: className,
			} ) }
		>
			<OptionsPanelHeader
				label={ label }
				activeOptions={ activeOptions }
				options={ options }
				{ ...props }
			/>
			{ activeOptions.length !== 0 && (
				<div className="options-panel-container">
					{ props.children }
				</div>
			) }
		</div>
	);
}
