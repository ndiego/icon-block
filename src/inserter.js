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
import { Icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import icons from './icons';


export default function InserterModal( props ) {
    const { isInserterOpen, setInserterOpen, setAttributes } = props;
    const [ searchInput, setSearchInput ] = useState( '' );
    if( ! isInserterOpen ) {
        return null;
    }

    function updateIconName( name, icon ) {
    	setAttributes( {
            icon: '',
            iconName: name
        } );
        setInserterOpen( false );
    }

    console.log( searchInput );

    let shownIcons = icons;

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
    return (
        <Modal
            className="wp-block-outermost-icon-inserter__modal"
            title={ __( 'Icon Library', 'icon-block' ) }
            onRequestClose={ () => setInserterOpen( false ) }
        >
            <SearchControl
                value={ searchInput }
                onChange={ setSearchInput }
            />
            <div className="icons-list">
                { shownIcons.map( ( icon ) => {
                    return (
                        <Button
                            label={ __( 'Insert Icon', 'icon-block' ) }
                            className="icons-list__item"
                            onClick={ () => updateIconName( icon.name, icon.icon ) }
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
        </Modal>
    )
}

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

    let shownIcons = icons;

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

    shownIcons = shownIcons.slice(0,6);

    return (
        <Popover
            className="wp-block-outermost-icon-inserter__popover"
            onClose={ () => setQuickInserterOpen( false ) }
        >
            <div
                className="wp-block-outermost-icon-inserter__quick-inserter"
            >
                <SearchControl
                    className="block-editor-inserter__search"
                    value={ searchInput }
                    onChange={ setSearchInput }
                />
                <div
                    className="wp-block-outermost-icon-inserter__quick-inserter-results"
                >
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
                <Button
                    className="wp-block-outermost-icon-inserter__quick-inserter-expand"
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
