/**
 * WordPress dependencies
 */
import { __, sprintf, _n } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

export default function ContentHeader( props ) {
	const { searchInput, shownIconsCount, iconSize, setIconSize } = props;

	return (
		<div className="icon-inserter__content-header">
			<div className="search-results">
				{ searchInput &&
					sprintf(
						// translators: %1$s: Number of icons returned from search, %2$s: the search input
						_n(
							'%1$s search result for "%2$s"',
							'%1$s search results for "%2$s"',
							shownIconsCount,
							'icon-block'
						),
						shownIconsCount,
						searchInput
					) }
			</div>
			<div className="icon-controls">
				<div className="icon-controls__size">
					<span>{ __( 'Preview size', 'icon-block' ) }</span>
					<RangeControl
						min={ 24 }
						max={ 72 }
						value={ iconSize }
						withInputField={ false }
						onChange={ ( value ) => setIconSize( value ) }
					/>
				</div>
			</div>
		</div>
	);
}
