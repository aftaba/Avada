/* global cssua */
jQuery( window ).on( 'load', function() {
	fusionInitTooltips();
} );

function fusionInitTooltips() {

	// Initialize Bootstrap Tooltip
	jQuery( '[data-toggle="tooltip"]' ).each( function() {

		var $container;

		if ( jQuery( this ).parents( '.fusion-header-wrapper' ).length ) {
			$container = '.fusion-header-wrapper';
		} else if ( jQuery( this ).parents( '#side-header' ).length ) {
			$container = '#side-header';
		} else {
			$container = 'body';
		}

		if ( ! cssua.ua.mobile || ( cssua.ua.mobile && '_blank' !== jQuery( this ).attr( 'target' ) )  ) {
			jQuery( this ).tooltip( {
				container: $container
			} );
		}

	} );
}

jQuery( window ).on( 'fusion-element-render-fusion_text fusion-element-render-fusion_social_links', function( event, cid ) {
	var elements = jQuery( 'div[data-cid="' + cid + '"]' ).find( '[data-toggle="tooltip"]' ),
		container;

	if ( elements.parents( '.fusion-header-wrapper' ).length ) {
		container = '.fusion-header-wrapper';
	} else if ( elements.parents( '#side-header' ).length ) {
		container = '#side-header';
	} else {
		container = 'body';
	}

	elements.each( function() {
		if ( ! cssua.ua.mobile || ( cssua.ua.mobile && '_blank' !== jQuery( this ).attr( 'target' ) )  ) {
			jQuery( this ).tooltip( {
				container: container
			} );
		}
	} );

} );

jQuery( document ).ready( function() {

	jQuery( '.tooltip-shortcode, .fusion-secondary-header .fusion-social-networks li, .fusion-author-social .fusion-social-networks li, .fusion-footer-copyright-area .fusion-social-networks li, .fusion-footer-widget-area .fusion-social-networks li, .sidebar .fusion-social-networks li, .share-box li, .social-icon, .social li' ).mouseenter( function( e ) {
		jQuery( this ).find( '.popup' ).hoverFlow( e.type, {
			opacity: 'show'
		} );
	} );

	jQuery( '.tooltip-shortcode, .fusion-secondary-header .fusion-social-networks li, .fusion-author-social .fusion-social-networks li, .fusion-footer-copyright-area .fusion-social-networks li, .fusion-footer-widget-area .fusion-social-networks li, .sidebar .fusion-social-networks li, .share-box li, .social-icon, .social li' ).mouseleave( function( e ) {
		jQuery( this ).find( '.popup' ).hoverFlow( e.type, {
			opacity: 'hide'
		} );
	} );
} );
