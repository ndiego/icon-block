/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Modal, Popover, SearchControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, blockDefault } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './icons';


export function QuickInserterPopover( props ) {
    const [ searchInput, setSearchInput ] = useState( '' );
    const {
        setInserterOpen,
        isQuickInserterOpen,
        setQuickInserterOpen,
        setAttributes,
    } = props;

    if ( ! isQuickInserterOpen ) {
        return null;
    }

    function updateIconName( name, icon ) {
        setAttributes( {
            icon: '',
            iconName: name
        } );
        setInserterOpen( false );
    }

    const defaultIcon = icons.filter( ( icon ) => {
        return icon.isDefault;
    } )


    let shownIcons = icons.filter( ( icon ) => {
        const curatedIcons = [
            'wordpress-image',
            'wordpress-shipping',
            'wordpress-sparkles',
            'wordpress-twitter',
            'wordpress-verse',
        ];

        return curatedIcons.includes( icon.name );
    } );

    if ( ! isEmpty( defaultIcon ) ) {
        shownIcons.unshift( defaultIcon[0] );
    }

    if ( searchInput ) {
        shownIcons = icons.filter( ( icon ) => {
            const input = searchInput.toLowerCase();
            const iconName = icon.title.toLowerCase();

            // First check if the name matches.
            if ( iconName.includes( input ) ) {
                return true;
            }

            // Then check if any keywords match.
            if ( icon?.keywords && ! isEmpty( icon?.keywords ) ) {
                const keywordMatches = icon.keywords.filter(
                    ( keyword ) => keyword.includes( input )
                );

                return ! isEmpty( keywordMatches );
            }

            return false;
        } );
    }

    shownIcons = shownIcons.slice( 0, 6 );

    const searchResults = (
        <div className="block-editor-inserter__panel-content">
            <div className="icons-list">
                { shownIcons.map( ( icon ) => {
                    return (
                        <Button
                            label={ __( 'Insert Icon', 'icon-block' ) }
                            className="icons-list__item"
                            onClick={ () => {
                                updateIconName( icon.name, icon.icon );
                                setQuickInserterOpen( false );
                                setSearchInput( '' );
                            } }
                        >
                            <span className="icons-list__item-icon">
                                <Icon icon={ icon.icon }/>
                            </span>
                            <span className="icons-list__item-title">
                                { icon.title }
                            </span>
                        </Button>
                    )
                } ) }
            </div>
        </div>
    );

    const noResults = (
        <div class="block-editor-inserter__no-results">
            <Icon
                icon={ blockDefault }
                className="block-editor-inserter__no-results-icon"
            />
            <p>{ __( 'No results found.', 'block-icon' ) }</p>
        </div>
    );

    return (
        <Popover
            className="wp-block-outermost-icon-inserter__quick-inserter block-editor-inserter__popover is-quick"
            onClose={ () => setQuickInserterOpen( false ) }
            position="bottom center"
        >
            <div
                className="block-editor-inserter__quick-inserter"
            >
                <SearchControl
                    className="block-editor-inserter__search"
                    value={ searchInput }
                    onChange={ setSearchInput }
                />
                <div
                    className="block-editor-inserter__quick-inserter-results"
                    style={ { overflow: 'hidden' } }
                >
                    { [
                        isEmpty( shownIcons ) && noResults,
                        ! isEmpty( shownIcons ) && searchResults,
                    ] }
                </div>
                <Button
                    className="block-editor-inserter__quick-inserter-expand"
                    onClick={ () => {
                        setInserterOpen( true );
                        setQuickInserterOpen( false );
                        setSearchInput( '' );
                    } }
                >
                    { __( 'Browse all', 'icon-block' ) }
                </Button>
            </div>
        </Popover>
    )
}
