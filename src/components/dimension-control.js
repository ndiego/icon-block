/**
 * WordPress dependencies
 */
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

const RANGE_CONTROL_CUSTOM_SETTINGS = {
	px: { max: 1000, step: 1 },
	'%': { max: 100, step: 1 },
	vw: { max: 100, step: 1 },
	vh: { max: 100, step: 1 },
	em: { max: 50, step: 0.1 },
	rem: { max: 50, step: 0.1 },
};

export default function DimensionControl( { onChange, label, value } ) {
	const customRangeValue = parseFloat( value );

	const units = useCustomUnits( {
		availableUnits: [ '%', 'px', 'em', 'rem', 'vh', 'vw' ],
	} );

	const selectedUnit =
		useMemo(
			() => parseQuantityAndUnitFromRawValue( value ),
			[ value ]
		)[ 1 ] ||
		units[ 0 ]?.value ||
		'px';

	const handleSliderChange = ( next ) => {
		onChange( [ next, selectedUnit ].join( '' ) );
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
		<fieldset className="block-editor-height-control">
			<BaseControl.VisualLabel as="legend">
				{ label }
			</BaseControl.VisualLabel>
			<Flex>
				<FlexItem isBlock>
					<UnitControl
						value={ value }
						units={ units }
						onChange={ onChange }
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
							// initialPosition={ 48 }
							// allowReset={ true }
							// resetFallbackValue={ 48 }
						/>
					</Spacer>
				</FlexItem>
			</Flex>
		</fieldset>
	);
}
