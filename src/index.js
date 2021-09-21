/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import Edit from './edit';
import Save from './save';
import { bolt as icon } from './icons';

/**
 * Register the Icon Block.
 */
registerBlockType( 'outermost/icon-block', {
	icon,
	example: {
		attributes: {
			icon:
				'<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false"><path d="M5.37596228,13.5839749 L5.32467075,13.6728015 C5.07300954,14.18334 5.47511151,14.8008099 6.06790181,14.7469199 L10.7,14.325 L10.2512942,21.9559585 C10.2063665,22.7197298 11.1996561,23.052617 11.6240436,22.4160164 L19.6240436,10.4156501 L19.6753351,10.3268203 C19.9269943,9.81626408 19.5248527,9.19878764 18.9320489,9.25271837 L14.299,9.674 L14.7487058,2.04404152 C14.7936332,1.28027573 13.8003557,0.947384788 13.3759623,1.58397485 L5.37596228,13.5839749 Z M13.088,4.719 L12.7512942,10.4559585 L12.7517293,10.5526864 C12.779969,10.9652635 13.1437624,11.2855063 13.5679511,11.2469154 L17.505,10.888 L11.911,19.28 L12.2487058,13.5440415 L12.248271,13.4473177 C12.2200345,13.0347573 11.856271,12.7145189 11.4320982,12.7530801 L7.494,13.111 L13.088,4.719 Z"></path></svg>',
			iconColorValue: '#ffffff',
			iconBackgroundColorValue: '#000000',
			itemsJustification: 'center',
			width: 60,
			style: {
				border: {
					radius: 50,
				},
				spacing: {
					padding: {
						top: '10px',
						right: '10px',
						bottom: '10px',
						left: '10px',
					},
				},
			},
		},
	},
	edit: Edit,
	save: Save,
} );
