/* global Modernizr, generateCarousel, fusionResizeCrossfadeImagesContainer, fusionResizeCrossfadeImages, calcSelectArrowDimensions */
jQuery( document ).ready( function() {

	// Open sliding bar on page load if .open-on-load class is present.
	if ( jQuery( '.fusion-sliding-bar-area.open-on-load' ).length ) {
		slidingBarHandling();
		jQuery( '.fusion-sliding-bar-area' ).removeClass( 'open-on-load' );
	}

	// Setup scrolling, if a right or left sliding bar is used.
	if ( jQuery( '.fusion-sliding-bar-area' ).hasClass( 'fusion-sliding-bar-position-right' ) || jQuery( '.fusion-sliding-bar-area' ).hasClass( 'fusion-sliding-bar-position-left' ) ) {

		// Limit the scroll event to the .fusion-sliding-bar-content-wrapper container when hovering it with the mouse, i.e. exclude body scroll.
		jQuery( '.fusion-sliding-bar-content-wrapper' ).limitScrollToContainer();
	}

	// If the toggle is not in main menu, the mobile toggle needs to be set to triangle.
	if ( 'menu' !== jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) ) {

		// Mobile mode.
		if ( Modernizr.mq( 'only screen and (max-width: ' + jQuery( '.fusion-sliding-bar-area' ).data( 'breakpoint' ) + 'px)' ) ) {
			jQuery( '.fusion-sliding-bar-area' ).removeClass( 'fusion-sliding-bar-toggle-' + jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) );
			jQuery( '.fusion-sliding-bar-area' ).addClass( 'fusion-sliding-bar-toggle-triangle' );
		} else {

			// Desktop mode.
			jQuery( '.fusion-sliding-bar-area' ).removeClass( 'fusion-sliding-bar-toggle-triangle' );
			jQuery( '.fusion-sliding-bar-area' ).addClass( 'fusion-sliding-bar-toggle-' + jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) );
		}

		jQuery( window ).on( 'fusion-resize-horizontal', function() {

			// Mobile mode.
			if ( Modernizr.mq( 'only screen and (max-width: ' + jQuery( '.fusion-sliding-bar-area' ).data( 'breakpoint' ) + 'px)' ) ) {
				jQuery( '.fusion-sliding-bar-area' ).removeClass( 'fusion-sliding-bar-toggle-' + jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) );
				jQuery( '.fusion-sliding-bar-area' ).addClass( 'fusion-sliding-bar-toggle-triangle' );
			} else {

				// Desktop mode.
				jQuery( '.fusion-sliding-bar-area' ).removeClass( 'fusion-sliding-bar-toggle-triangle' );
				jQuery( '.fusion-sliding-bar-area' ).addClass( 'fusion-sliding-bar-toggle-' + jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) );
			}
		} );
	}
} );

jQuery( window ).on( 'load', function() {

	// Handle the sliding bar toggle click.
	jQuery( document.body ).on( 'click', '.fusion-sb-toggle, .fusion-icon-sliding-bar, .fusion-sb-close', function( e ) {
		e.preventDefault();

		slidingBarHandling();
	} );
} );

function slidingBarHandling() {
	var slidingBarArea = jQuery( '.fusion-sliding-bar-area' ),
		slidingBar = slidingBarArea.children( '.fusion-sliding-bar' ),
		isOpen = slidingBarArea.hasClass( 'open' );

	// Collapse the bar if it is open.
	if ( isOpen ) {
		slidingBarArea.removeClass( 'open' );
		jQuery( '.fusion-icon-sliding-bar' ).removeClass( 'fusion-main-menu-icon-active' );
		jQuery( 'body' ).removeClass( 'fusion-sliding-bar-active' );

		if ( slidingBarArea.hasClass( 'fusion-sliding-bar-position-top' ) || slidingBarArea.hasClass( 'fusion-sliding-bar-position-bottom' ) ) {
			slidingBar.slideUp( 240, 'easeOutQuad' );
		}
	} else if ( ! jQuery( this ).hasClass( 'fusion-sb-close' ) ) {
		slidingBarArea.addClass( 'open' );
		jQuery( '.fusion-icon-sliding-bar' ).addClass( 'fusion-main-menu-icon-active' );
		jQuery( 'body' ).addClass( 'fusion-sliding-bar-active' );

		// Expand the bar.
		if ( slidingBarArea.hasClass( 'fusion-sliding-bar-position-top' ) || slidingBarArea.hasClass( 'fusion-sliding-bar-position-bottom' ) ) {
			slidingBar.slideDown( 240, 'easeOutQuad' );
		}

		// Reinitialize dynamic content.
		setTimeout( function() {

			// Google maps.
			if ( 'function' === typeof jQuery.fn.reinitializeGoogleMap ) {
				slidingBar.find( '.shortcode-map' ).each( function() {
					jQuery( this ).reinitializeGoogleMap();
				} );
			}

			// Image Carousels.
			if ( slidingBar.find( '.fusion-carousel' ).length && 'function' === typeof generateCarousel ) {
				generateCarousel();
			}

			// Portfolio.
			slidingBar.find( '.fusion-portfolio' ).each( function() {
				var $portfolioWrapper   = jQuery( this ).find( '.fusion-portfolio-wrapper' ),
					$portfolioWrapperID = $portfolioWrapper.attr( 'id' );

				// Done for multiple instances of portfolio shortcode. Isotope needs ids to distinguish between instances.
				if ( $portfolioWrapperID ) {
					$portfolioWrapper = jQuery( '#' + $portfolioWrapperID );
				}

				$portfolioWrapper.isotope();
			} );

			// Gallery.
			slidingBar.find( '.fusion-gallery' ).each( function() {
				jQuery( this ).isotope();
			} );

			// Flip Boxes
			if ( 'function' === typeof jQuery.fn.fusionCalcFlipBoxesHeight ) {
				slidingBar.find( '.fusion-flip-boxes' ).not( '.equal-heights' ).find( '.flip-box-inner-wrapper' ).each( function() {
					jQuery( this ).fusionCalcFlipBoxesHeight();
				} );
			}

			if ( 'function' === typeof jQuery.fn.fusionCalcFlipBoxesEqualHeights ) {
				slidingBar.find( '.fusion-flip-boxes.equal-heights' ).each( function() {
					jQuery( this ).fusionCalcFlipBoxesEqualHeights();
				} );
			}

			// Columns.
			if ( 'function' === typeof jQuery.fn.equalHeights ) {
				slidingBar.find( '.fusion-fullwidth.fusion-equal-height-columns' ).each( function() {
					jQuery( this ).find( '.fusion-layout-column .fusion-column-wrapper' ).equalHeights();
				} );
			}

			// Make WooCommerce shortcodes work.
			slidingBar.find( '.crossfade-images' ).each(    function() {
				fusionResizeCrossfadeImagesContainer( jQuery( this ) );
				fusionResizeCrossfadeImages( jQuery( this ) );
			} );

			// Blog.
			slidingBar.find( '.fusion-blog-shortcode' ).each( function() {
				jQuery( this ).find( '.fusion-blog-layout-grid' ).isotope();
			} );

			// Testimonials.
			slidingBar.find( '.fusion-testimonials .reviews' ).each( function() {
				jQuery( this ).css( 'height', jQuery( this ).children( '.active-testimonial' ).height() );
			} );

			// Select arrows.
			if ( 'function' === typeof calcSelectArrowDimensions ) {
				calcSelectArrowDimensions();
			}

			// Make premium sliders, other elements and nicescroll work.
			jQuery( window ).trigger( 'resize' );
		}, 350 );
	}
}

jQuery( window ).on( 'load', function() {
	jQuery( '.fusion-modal' ).bind( 'show.bs.modal', function() {
		var slidingBar = jQuery( '.fusion-sliding-bar' ),
			activeTestimonial;

		// Reinitialize dynamic content.
		setTimeout( function() {

			// Reinitialize testimonial height; only needed for hidden wrappers.
			if ( slidingBar.find( '.fusion-testimonials' ).length ) {
				activeTestimonial = slidingBar.find( '.fusion-testimonials .reviews' ).children( '.active-testimonial' );
				slidingBar.find( '.fusion-testimonials .reviews' ).height( activeTestimonial.height() );
			}

		}, 350 );
	} );
} );
