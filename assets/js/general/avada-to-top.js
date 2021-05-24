/* global cssua, avadaToTopVars */
jQuery( document ).ready( function() {
	var position = avadaToTopVars.totop_position.split( '_' );

	position = 2 === position.length ? 'to-top-' + position[ 0 ] + ' to-top-' + position[ 1 ] : 'to-top-' + position[ 0 ];

	// To top.
	if ( jQuery().UItoTop ) {
		if ( cssua.ua.mobile && -1 !== avadaToTopVars.status_totop.indexOf( 'mobile' ) ) {
			jQuery().UItoTop( { easingType: 'easeOutQuart', classes: position, scrollDownOnly: avadaToTopVars.totop_scroll_down_only } );
		} else if ( ! cssua.ua.mobile ) {
			jQuery().UItoTop( { easingType: 'easeOutQuart', classes: position, scrollDownOnly: avadaToTopVars.totop_scroll_down_only } );
		}
	}

	jQuery( window ).on( 'updateToTopPostion', avadaUpdateToTopPostion );
} );

function avadaUpdateToTopPostion() {
	var position = avadaToTopVars.totop_position.split( '_' );

	position = 2 === position.length ? 'to-top-' + position[ 0 ] + ' to-top-' + position[ 1 ] : 'to-top-' + position[ 0 ];

	jQuery( '.to-top-container' ).attr( 'class', 'to-top-container' );
	jQuery( '.to-top-container' ).addClass( position );

}
