/* global avadaNiceScrollVars, Modernizr */
( function( jQuery ) {

	'use strict';

	var fusionNiceScroll = function() {

		/**
		 * Inits niceScroll if not in responsive mode, otherwise manipulates body classes.
		 */
		this.maybeInit = function() {
			var self = this;
			if ( ! Modernizr.mq( 'screen and (max-width: ' + ( 800 + parseInt( avadaNiceScrollVars.side_header_width, 10 ) ) + 'px)' ) && jQuery( 'body' ).outerHeight( true ) > jQuery( window ).height() && ! navigator.userAgent.match( /(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/ ) ) {

				setTimeout( function() {
					self.revive();
				}, 50 );

			} else {

				// Responsive mode, we don't use nicescroll here.

				// Destroy niceScroll if it was inited before.
				self.destroy();

				if ( jQuery( 'body' ).outerHeight( true ) < jQuery( window ).height() ) {
					jQuery( 'html' ).css( 'overflow-y', 'hidden' );
				} else {
					jQuery( 'html' ).css( 'overflow-y', 'auto' );
				}

				jQuery( '#ascrail2000' ).css( 'opacity', '1' );

			}
		},

		/**
		 * Destroys niceScroll.
		 */
		this.destroy = function() {

			if ( 'undefined' !== typeof jQuery( 'html' ).getNiceScroll ) {
				jQuery( 'html' ).getNiceScroll().remove();
			}
			jQuery( 'html' ).removeClass( 'no-overflow-y' );
		},

		/**
		 * Inits niceScroll or triggers it's resize if it was inited before.
		 */
		this.revive = function() {
			var niceScrollObject = jQuery( 'html' ).getNiceScroll();

			// Early exit if nicescroll is already inited and only resize is needed.
			if ( niceScrollObject.length ) {
				niceScrollObject.resize();

				return;
			}

			// Init nicescroll if it wasn't before.
			jQuery( 'html' ).niceScroll( {
				background: '#555',
				scrollspeed: 60,
				mousescrollstep: 40,
				cursorwidth: 9,
				cursorborder: '0px',
				cursorcolor: '#303030',
				cursorborderradius: 8,
				preservenativescrolling: true,
				cursoropacitymax: 1,
				cursoropacitymin: 1,
				autohidemode: false,
				zindex: 999999,
				horizrailenabled: false
			} );

			jQuery( 'html' ).addClass( 'no-overflow-y' );
		};

	};

	// Init niceScroll if enabled and attach callbacks.
	jQuery( document ).ready( function() {
		var smoothActive = ( 1 === avadaNiceScrollVars.smooth_scrolling || '1' === avadaNiceScrollVars.smooth_scrolling || true === avadaNiceScrollVars.smooth_scrolling ) ? true : false;

		if ( true === smoothActive ) {
			fusionNiceScroll = new fusionNiceScroll();

			fusionNiceScroll.maybeInit();

			// Attach callback with a delay to avoid resize events triggered on page load.
			setTimeout( function() {
				jQuery( window ).on( 'resize', function() {

					// Portfolio filters ('.fusion-portfolio .fusion-filters a') trigger resize on click.
					fusionNiceScroll.maybeInit();
				} );
			}, 1000 );
		}
	} );

}( jQuery ) );
