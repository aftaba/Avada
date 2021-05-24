/* global Modernizr, avadaMobileImageVars */
( function( jQuery ) {

	'use strict';

	jQuery.fn.fusion_deactivate_mobile_image_hovers = function() {
		if ( ! Number( avadaMobileImageVars.disable_mobile_image_hovers ) ) {
			if ( Modernizr.mq( 'only screen and (max-width:' + avadaMobileImageVars.side_header_break_point + 'px)' ) ) {
				jQuery( this ).removeClass( 'fusion-image-hovers' );
			} else {
				jQuery( this ).addClass( 'fusion-image-hovers' );
			}
		}
	};
}( jQuery ) );

jQuery( document ).ready( function() {

	// Deactivate image hover animations on mobiles
	fusionDeactivateMobileImagHovers();

	jQuery( window ).on( 'resize', function() {
		fusionDeactivateMobileImagHovers();
	} );
} );

function fusionDeactivateMobileImagHovers() {
	jQuery( 'body' ).fusion_deactivate_mobile_image_hovers();
}
