/*
|--------------------------------------------------------------------------
| UItoTop jQuery Plugin 1.2 by Matt Varone
| http://www.mattvarone.com/web-design/uitotop-jquery-plugin/
|--------------------------------------------------------------------------
*/
( function( $ ) {
	jQuery.fn.UItoTop = function( options ) {
		var defaults = {
			text: '',
			min: 200,
			inDelay: 600,
			outDelay: 400,
			containerID: 'toTop',
			containerHoverID: 'toTopHover',
			scrollSpeed: 1200,
			easingType: 'linear',
			scrollDownOnly: 0,
			classes: ''
		},
		settings = jQuery.extend( defaults, options ),
		containerIDhash = '#' + settings.containerID,
		containerHoverIDHash = '#' + settings.containerHoverID,
		lastScrollPosition = 0;

		jQuery( 'body' ).append( '<div class="to-top-container ' + settings.classes + '"><a href="#" id="' + settings.containerID + '"><span class="screen-reader-text">' + toTopscreenReaderText.label + '</span>' + settings.text + '</a></div>' );

		jQuery( containerIDhash ).hide().on( 'click.UItoTop', function() {
			jQuery( 'html, body' ).animate( { scrollTop:0 }, settings.scrollSpeed, settings.easingType );
			jQuery( '#' + settings.containerHoverID, this ).stop().animate( { 'opacity': 0 }, settings.inDelay, settings.easingType );
			return false;
		})
		.prepend( '<span id="' + settings.containerHoverID + '"></span>' )
		.hover( function() {
				jQuery( containerHoverIDHash, this ).stop().animate( {
					'opacity': 1
				}, 600, 'linear' );
			}, function() {
				jQuery( containerHoverIDHash, this ).stop().animate( {
					'opacity': 0
				}, 700, 'linear' );
			} );


		jQuery( window ).scroll( function() {
			var sd = jQuery( this ).scrollTop();

			if ( 'undefined' === typeof document.body.style.maxHeight ) {
				jQuery( containerIDhash ).css( {
					'position': 'absolute',
					'top': sd + jQuery( window ).height() - 50
				} );
			}

			if ( sd > settings.min && ( sd >= lastScrollPosition || 1 !== parseInt( settings.scrollDownOnly ) ) ) {
				jQuery( containerIDhash ).fadeIn( settings.inDelay );
			} else {
				jQuery( containerIDhash ).fadeOut( settings.Outdelay );
			}

			lastScrollPosition = sd;
		});
};
})( jQuery );
