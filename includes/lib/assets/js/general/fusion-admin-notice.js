/* global fusionAdminNoticesNonce, ajaxurl */
( function() {

	// Shorthand for ready event.
	jQuery( function() {

		// Dimiss notice.
		jQuery( '.notice.fusion-is-dismissible button.notice-dismiss' ).on( 'click', function( event ) {
			var $this = jQuery( this ),
				data  = $this.parent().data();

			event.preventDefault();

			// Make ajax request.
			jQuery.post( ajaxurl, {
				data: data,
				action: 'fusion_dismiss_admin_notice',
				nonce: fusionAdminNoticesNonce
			} );
		} );
	} );
}( jQuery ) );
