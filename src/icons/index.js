/**
 * Internal dependencies
 */
import {
	amazon,
	bandcamp,
	behance,
	chain,
	codepen,
	deviantart,
	dribbble,
	dropbox,
	etsy,
	facebook,
	feed,
	fivehundredpx,
	flickr,
	foursquare,
	goodreads,
	google,
	github,
	instagram,
	lastfm,
	linkedin,
	mail,
	mastodon,
	meetup,
	medium,
	patreon,
	pinterest,
	pocket,
	reddit,
	skype,
	snapchat,
	soundcloud,
	spotify,
	telegram,
	tiktok,
	tumblr,
	twitch,
	twitter,
	vimeo,
	vk,
	wordpress,
	yelp,
	youtube,
} from './wordpress/social';

const wpSocials = [
	{
		isDefault: true,
		name: 'wordpress',
		title: 'WordPress',
		icon: wordpress,
	},
	{
		name: 'fivehundredpx',
		title: '500px',
		icon: fivehundredpx,
	},
	{
		name: 'amazon',
		title: 'Amazon',
		icon: amazon,
	},
	{
		name: 'bandcamp',
		title: 'Bandcamp',
		icon: bandcamp,
	},
	{
		name: 'behance',
		title: 'Behance',
		icon: behance,
	},
	{
		name: 'chain',
		title: 'Link',
		icon: chain,
	},
	{
		name: 'codepen',
		title: 'CodePen',
		icon: codepen,
	},
	{
		name: 'deviantart',
		title: 'DeviantArt',
		icon: deviantart,
	},
	{
		name: 'dribbble',
		title: 'Dribbble',
		icon: dribbble,
	},
	{
		name: 'dropbox',
		title: 'Dropbox',
		icon: dropbox,
	},
	{
		name: 'etsy',
		title: 'Etsy',
		icon: etsy,
	},
	{
		name: 'facebook',
		title: 'Facebook',
		icon: facebook,
	},
	{
		name: 'feed',
		title: 'RSS Feed',
		icon: feed,
	},
	{
		name: 'flickr',
		title: 'Flickr',
		icon: flickr,
	},
	{
		name: 'foursquare',
		title: 'Foursquare',
		icon: foursquare,
	},
	{
		name: 'goodreads',
		title: 'Goodreads',
		icon: goodreads,
	},
	{
		name: 'google',
		title: 'Google',
		icon: google,
	},
	{
		name: 'github',
		title: 'GitHub',
		icon: github,
	},
	{
		name: 'instagram',
		title: 'Instagram',
		icon: instagram,
	},
	{
		name: 'lastfm',
		title: 'Last.fm',
		icon: lastfm,
	},
	{
		name: 'linkedin',
		title: 'LinkedIn',
		icon: linkedin,
	},
	{
		name: 'mail',
		title: 'Mail',
		keywords: [ 'email', 'e-mail' ],
		icon: mail,
	},
	{
		name: 'mastodon',
		title: 'Mastodon',
		icon: mastodon,
	},
	{
		name: 'meetup',
		title: 'Meetup',
		icon: meetup,
	},
	{
		name: 'medium',
		title: 'Medium',
		icon: medium,
	},
	{
		name: 'patreon',
		title: 'Patreon',
		icon: patreon,
	},
	{
		name: 'pinterest',
		title: 'Pinterest',
		icon: pinterest,
	},
	{
		name: 'pocket',
		title: 'Pocket',
		icon: pocket,
	},
	{
		name: 'reddit',
		title: 'Reddit',
		icon: reddit,
	},
	{
		name: 'skype',
		title: 'Skype',
		icon: skype,
	},
	{
		name: 'snapchat',
		title: 'Snapchat',
		icon: snapchat,
	},
	{
		name: 'soundcloud',
		title: 'SoundCloud',
		icon: soundcloud,
	},
	{
		name: 'spotify',
		title: 'Spotify',
		icon: spotify,
	},
	{
		name: 'telegram',
		title: 'Telegram',
		icon: telegram,
	},
	{
		name: 'tiktok',
		title: 'TikTok',
		icon: tiktok,
	},
	{
		name: 'tumblr',
		title: 'Tumblr',
		icon: tumblr,
	},
	{
		name: 'twitch',
		title: 'Twitch',
		icon: twitch,
	},
	{
		name: 'twitter',
		title: 'Twitter',
		icon: twitter,
	},
	{
		name: 'vimeo',
		title: 'Vimeo',
		icon: vimeo,
	},
	{
		name: 'vk',
		title: 'VK',
		icon: vk,
	},
	{
		name: 'yelp',
		title: 'Yelp',
		icon: yelp,
	},
	{
		name: 'youtube',
		title: 'YouTube',
		icon: youtube,
	},
];

wpSocials.forEach( ( icon ) => {
    icon.name = 'wordpress-' + icon.name;
    icon.type = 'wordpress';
} );

const iconsArray = [];
const icons = iconsArray.concat( wpSocials );

export default icons;
