/* global getAdminbarHeight, getStickyHeaderHeight */
jQuery( document ).ready( function() {

	// One page scrolling effect.
	var adminbarHeight     = ( 'function' === typeof getAdminbarHeight ) ? getAdminbarHeight() : 0,
		stickyHeaderHeight = ( 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight() : 0;

	// Initialize ScrollSpy script.
	jQuery( 'body' ).scrollspy( {
		target: '.fusion-menu',
		offset: parseInt( adminbarHeight + stickyHeaderHeight + 1, 10 )
	} );

	// Reset ScrollSpy offset to correct height after page is fully loaded.
	jQuery( window ).on( 'load', function() {
		adminbarHeight     = ( 'function' === typeof getAdminbarHeight ) ? getAdminbarHeight() : 0;
		stickyHeaderHeight = ( 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight() : 0;

		jQuery( 'body' ).data()[ 'bs.scrollspy' ].options.offset = parseInt( adminbarHeight + stickyHeaderHeight + 1, 10 );
	} );
} );
