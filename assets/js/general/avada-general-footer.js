jQuery( document ).ready( function() {

	// Disable bottom margin on empty footer columns
	jQuery( '.fusion-footer .fusion-footer-widget-area .fusion-column' ).each(
		function() {
			if ( jQuery( this ).is( ':empty' ) ) {
				jQuery( this ).css( 'margin-bottom', '0' );
			}
		}
	);

	// Footer without social icons
	if ( ! jQuery( '.fusion-social-links-footer' ).find( '.fusion-social-networks' ).children().length ) {
		jQuery( '.fusion-social-links-footer' ).hide();
		jQuery( '.fusion-footer-copyright-area .fusion-copyright-notice' ).css( 'padding-bottom', '0' );
	}

	// Handle sticky footer when page is larger than viewport.
	jQuery( '.avada-footer-fx-sticky' ).fusionFooterSticky();

	jQuery( window ).on( 'fusion-resize-vertical', function() {
		jQuery( '.avada-footer-fx-sticky' ).fusionFooterSticky();
	} );
} );

jQuery( document ).ajaxComplete( function() {
	jQuery( '.avada-footer-fx-sticky' ).fusionFooterSticky();
} );

// Footer sticky check for old IE versions.
jQuery.fn.fusionFooterSticky = function() {
	var wrapperHeight;

	jQuery( '#boxed-wrapper' ).css( 'height', 'auto' );
	wrapperHeight = jQuery( '#boxed-wrapper' ).height();

	if ( wrapperHeight > jQuery( window ).height() ) {
		jQuery( '#boxed-wrapper' ).css( 'height', 'auto' );
		jQuery( 'body' ).css( 'height', 'auto' );
	} else {
		jQuery( '#boxed-wrapper' ).css( 'height', '' );
		jQuery( 'body' ).css( 'height', '' );
	}
};
