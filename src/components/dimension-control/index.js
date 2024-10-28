/**
 * A slightly modified version of the HeightControl component in Gutenberg.
 * https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/height-control/index.js
 */

/**
 * External dependencies
 */
import { intersection } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';
import {
	BaseControl,
	RangeControl,
	Flex,
	FlexItem,
	__experimentalSpacer as Spacer, // eslint-disable-line
	__experimentalUseCustomUnits as useCustomUnits, // eslint-disable-line
	__experimentalUnitControl as UnitControl, // eslint-disable-line
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue, // eslint-disable-line
} from '@wordpress/components';
import { useSettings } from '@wordpress/block-editor';

const RANGE_CONTROL_CUSTOM_SETTINGS = {
	px: { max: 1000, step: 1 },
	'%': { max: 100, step: 1 },
	vw: { max: 100, step: 1 },
	vh: { max: 100, step: 1 },
	em: { max: 50, step: 0.1 },
	rem: { max: 50, step: 0.1 },
	deg: { max: 360, step: 1 },
};

export default function DimensionControl( { onChange, label, units, value } ) {
	const customRangeValue = parseFloat( value );
	const themeJsonUnits = useSettings( 'spacing.units' )[ 0 ];

	let defaultUnits;

	if ( units && themeJsonUnits ) {
		defaultUnits = intersection( units, themeJsonUnits );
	} else {
		defaultUnits = units || themeJsonUnits;
	}

	const availableUnits = useCustomUnits( {
		availableUnits: defaultUnits || [ '%', 'px', 'em', 'rem', 'vh', 'vw' ],
	} );

	// Ensure 'deg' is included if present in units
	if ( units && units.includes( 'deg' ) ) {
		availableUnits.push( {
			value: 'deg',
			label: 'deg',
			a11yLabel: 'Degrees',
			step: 1,
		} );
	}

	const selectedUnit =
		useMemo(
			() => parseQuantityAndUnitFromRawValue( value ),
			[ value ]
		)[ 1 ] ||
		availableUnits[ 0 ]?.value ||
		'px';

	const handleSliderChange = ( next ) => {
		onChange( [ next, selectedUnit ].join( '' ) );
	};

	const handleChange = ( unitValue ) => {
		// Prevent the unit from getting returned if there is no actual value set.
		const [ newValue, newUnit ] = // eslint-disable-line
			parseQuantityAndUnitFromRawValue( unitValue );
		if ( newValue ) {
			onChange( unitValue );
		}
	};

	const handleUnitChange = ( newUnit ) => {
		// Attempt to smooth over differences between currentUnit and newUnit.
		// This should slightly improve the experience of switching between unit types.
		const [ currentValue, currentUnit ] =
			parseQuantityAndUnitFromRawValue( value );

		if ( [ 'em', 'rem' ].includes( newUnit ) && currentUnit === 'px' ) {
			// Convert pixel value to an approximate of the new unit, assuming a root size of 16px.
			onChange( ( currentValue / 16 ).toFixed( 2 ) + newUnit );
		} else if (
			[ 'em', 'rem' ].includes( currentUnit ) &&
			newUnit === 'px'
		) {
			// Convert to pixel value assuming a root size of 16px.
			onChange( Math.round( currentValue * 16 ) + newUnit );
		} else if (
			[ 'vh', 'vw', '%' ].includes( newUnit ) &&
			currentValue > 100
		) {
			// When converting to `vh`, `vw`, or `%` units, cap the new value at 100.
			onChange( 100 + newUnit );
		}
	};

	return (
		<fieldset className="components-dimension-control">
			<BaseControl.VisualLabel as="legend">
				{ label || __( 'Dimension', 'icon-block' ) }
			</BaseControl.VisualLabel>
			<Flex>
				<FlexItem isBlock>
					<UnitControl
						value={ value }
						units={ availableUnits }
						onChange={ handleChange }
						onUnitChange={ handleUnitChange }
						min={ 0 }
						size={ '__unstable-large' }
					/>
				</FlexItem>
				<FlexItem isBlock>
					<Spacer marginX={ 2 } marginBottom={ 0 }>
						<RangeControl
							value={ customRangeValue }
							min={ 0 }
							max={
								RANGE_CONTROL_CUSTOM_SETTINGS[ selectedUnit ]
									?.max ?? 100
							}
							step={
								RANGE_CONTROL_CUSTOM_SETTINGS[ selectedUnit ]
									?.step ?? 0.1
							}
							withInputField={ false }
							onChange={ handleSliderChange }
							__nextHasNoMarginBottom
						/>
					</Spacer>
				</FlexItem>
			</Flex>
		</fieldset>
	);
}
