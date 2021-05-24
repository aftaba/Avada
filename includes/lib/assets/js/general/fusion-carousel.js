/* global fusionCarouselVars */

// Carousel is used in FB and also related posts for Avada.
var generateCarousel = function( cid ) {
	var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-carousel' ) : jQuery( '.fusion-carousel' );
	if ( jQuery().carouFredSel ) {
		$targetEl.each( function() {

			// Initialize the needed variables from data fields
			var $imageSize        = ( jQuery( this ).attr( 'data-imagesize' ) ) ? jQuery( this ).data( 'imagesize' ) : 'fixed',
				$centerVertically = ( jQuery( this ).attr( 'data-metacontent' ) && 'yes' === jQuery( this ).data( 'metacontent' ) ) ? false : true,
				$autoplay         = ( jQuery( this ).attr( 'data-autoplay' ) && 'yes' === jQuery( this ).data( 'autoplay' ) ) ? true : false,
				$timeoutDuration  = ( jQuery( this ).parents( '.related-posts' ).length ) ? fusionCarouselVars.related_posts_speed : fusionCarouselVars.carousel_speed,
				$scrollEffect     = ( jQuery( this ).attr( 'data-scrollfx' ) ) ? jQuery( this ).data( 'scrollfx' ) : 'scroll',
				$scrollItems      = ( jQuery( this ).attr( 'data-scrollitems' ) ) ? parseInt( jQuery( this ).data( 'scrollitems' ) ) : null,
				$touchScroll      = ( jQuery( this ).attr( 'data-touchscroll' ) && 'yes' === jQuery( this ).data( 'touchscroll' ) ) ? true : false,
				$touchScrollClass = ( $touchScroll ) ? ' fusion-carousel-swipe' : '',
				$columnMaximum    = ( jQuery( this ).attr( 'data-columns' ) ) ? jQuery( this ).data( 'columns' ) : 6,
				$itemMargin       = ( jQuery( this ).attr( 'data-itemmargin' ) ) ? parseInt( jQuery( this ).data( 'itemmargin' ), 10 ) : 44,
				$itemMinWidth     = ( jQuery( this ).attr( 'data-itemwidth' ) ) ? parseInt( jQuery( this ).data( 'itemwidth' ), 10 )  + $itemMargin : 180 + $itemMargin,
				$carouselHeight   = ( jQuery( this ).parent().hasClass( 'fusion-image-carousel' ) && 'fixed' === $imageSize ) ? '115px' : 'variable';

			// Shift the wrapping positioning container $itemMargin to the left
			jQuery( this ).find( '.fusion-carousel-positioner' ).css( 'margin-left', '-' + $itemMargin + 'px' );

			// Add $itemMargin as left margin to all items
			jQuery( this ).find( '.fusion-carousel-item' ).css( 'margin-left', $itemMargin  + 'px' );

			// Shift the left navigation button $itemMargin to the right
			jQuery( this ).find( '.fusion-nav-prev' ).css( 'margin-left', $itemMargin + 'px' );

			// Initialize the carousel
			jQuery( this ).find( 'ul' ).carouFredSel( {
				circular: true,
				infinite: true,
				responsive: true,
				centerVertically: $centerVertically,
				height: $carouselHeight,
				width: '100%',
				auto: {
					play: $autoplay,
					timeoutDuration: parseInt( $timeoutDuration, 10 )
				},
				items: {
					height: $carouselHeight,
					width: $itemMinWidth,
					visible: {
						min: 1,
						max: parseInt( $columnMaximum, 10 )
					}
				},
				scroll: {
					pauseOnHover: true,
					items: $scrollItems,
					fx: $scrollEffect
				},
				swipe: {
					onTouch: $touchScroll,
					onMouse: $touchScroll,
					options: {
						excludedElements: 'button, input, select, textarea, a, .noSwipe'
					}
				},
				prev: jQuery( this ).find( '.fusion-nav-prev' ),
				next: jQuery( this ).find( '.fusion-nav-next' ),
				onCreate: function() {

					// Make the images visible once the carousel is loaded
					jQuery( this ).find( '.fusion-carousel-item-wrapper' ).css( 'visibility', 'inherit' );

					// Make the navigation visible once the carousel is loaded
					jQuery( this ).parents( '.fusion-carousel' ).find( '.fusion-carousel-nav' ).css( 'visibility', 'inherit' );

					// Remove overflow: hidden to  make carousel stretch full width
					if ( jQuery( this ).parents( '.fusion-woo-featured-products-slider' ).length ) {
						jQuery( this ).parent().css( 'overflow', '' );
					}

					// Set the line-height of the main ul element to the height of the wrapping container
					if ( $centerVertically ) {
						jQuery( this ).css( 'line-height', jQuery( this ).parent().height() + 'px' );
					}

					// Set the ul element to top: auto position to make is respect top padding
					jQuery( this ).css( 'top', 'auto' );

					// Set the position of the right navigation element to make it fit the overall carousel width
					jQuery( this ).parents( '.fusion-carousel' ).find( '.fusion-nav-next' ).each( function() {
						jQuery( this ).css( 'left', jQuery( this ).parents( '.fusion-carousel' ).find( '.fusion-carousel-wrapper' ).width() - jQuery( this ).width() );
					} );

					// Placeholder images in "fixed" picture size carousels are correctly resized by triggering 'resize'.
					jQuery( window ).trigger( 'resize' );
				},
				currentVisible: function( $items ) {
					return $items;
				}
			}, {

				// Set custom class name to the injected carousel container
				wrapper: {
					classname: 'fusion-carousel-wrapper' + $touchScrollClass
				}
			} );
		} );
	}
};

( function( jQuery ) {

	'use strict';

	// Recalculate carousel elements
	jQuery.fn.fusion_recalculate_carousel = function() {
		jQuery( this ).not( '.fusion-woo-featured-products-slider' ).each( function() {
			var $carousel  = jQuery( this ),
				$imageSize = jQuery( this ).data( 'imagesize' ),
				$imageHeights,
				$neededHeight;

			// Timeout needed for size changes to take effect, before weaccess them
			setTimeout( function() {

				// Set the position of the right navigation element to make it fit the overall carousel width
				$carousel.find( '.fusion-nav-next' ).each( function() {
					jQuery( this ).css( 'left', $carousel.find( '.fusion-carousel-wrapper' ).width() - jQuery( this ).width() );
				} );

				// Resize the placeholder images correctly in "fixed" picture size carousels
				if ( 'fixed' === $imageSize ) {
					$imageHeights = $carousel.find( '.fusion-carousel-item' ).map( function() {
						return jQuery( this ).find( 'img' ).height();
					} ).get();
					$neededHeight = Math.max.apply( null, $imageHeights );

					$carousel.find( '.fusion-placeholder-image' ).each( function() {
						jQuery( this ).css(	'height', $neededHeight );
					} );
					if ( 1 <= jQuery( $carousel ).parents( '.fusion-image-carousel' ).length ) {
						$carousel.find( '.fusion-image-wrapper' ).each( function() {
							jQuery( this ).css(	'height', $neededHeight );
							jQuery( this ).css(	'width', '100%' );
							jQuery( this ).find( '> a' ).css( 'line-height', ( $neededHeight - 2 ) + 'px' );
						} );
					}
				}
			}, 5 );
		} );
	};
}( jQuery ) );

jQuery( window ).on( 'load fusion-reinit-related-posts-carousel fusion-reinit-carousels fusion-element-render-fusion_images fusion-element-render-fusion_featured_products_slider fusion-element-render-fusion_products_slider fusion-element-render-fusion_portfolio fusion-element-render-fusion_tb_related fusion-column-resized', function( $, cid ) {
	generateCarousel( cid );
} );

jQuery( window ).on( 'fusion-element-render-fusion_images', function( $, cid ) {
	var $spacing = jQuery( 'li[data-parent-cid="' + cid + '"]' ).parents( '.fusion-carousel' ).data( 'itemmargin' ) ? parseFloat( jQuery( 'li[data-parent-cid="' + cid + '"]' ).parents( '.fusion-carousel' ).data( 'itemmargin' ) ) : false;

	if ( false !== $spacing ) {
		jQuery( 'li[data-parent-cid="' + cid + '"]' ).css( 'margin-left', $spacing + 'px' );
	}
	jQuery( 'li[data-parent-cid="' + cid + '"], li[data-parent-cid="' + cid + '"] .fusion-carousel-item-wrapper' ).css( 'visibility', 'inherit' );
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-carousel' );

	if ( 0 < $reInitElems.length ) {
		generateCarousel();
	}
} );

jQuery( document ).ready( function() {

	// Carousel resize.
	jQuery( window ).on( 'fusion-resize-horizontal', function() {
		jQuery( '.fusion-carousel' ).fusion_recalculate_carousel();
	} );
} );
