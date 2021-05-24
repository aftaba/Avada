/* global getAdminbarHeight, getStickyHeaderHeight, fusionScrollToAnchorVars, Modernizr */
( function( jQuery ) {

	'use strict';

	// Smooth scrolling to anchor target
	jQuery.fn.fusion_scroll_to_anchor_target = function( customScrollOffset ) {
		var $href         = jQuery( this ).attr( 'href' ),
			$hrefHash     = $href.substr( $href.indexOf( '#' ) ).slice( 1 ),
			$target       = jQuery( '#' + $hrefHash ),
			animationRoot = ( jQuery( 'html' ).hasClass( 'ua-edge' ) || jQuery( 'html' ).hasClass( 'ua-safari-12' ) || jQuery( 'html' ).hasClass( 'ua-safari-11' ) || jQuery( 'html' ).hasClass( 'ua-safari-10' ) ) ? 'body' : 'html',
			$adminbarHeight,
			$stickyHeaderHeight,
			$currentScrollPosition,
			$newScrollPosition,
			$halfScrollAmount,
			$halfScrollPosition,
			scrollSectionElement;

		customScrollOffset = 'undefined' !== typeof customScrollOffset ? customScrollOffset : 0;

		if ( $target.length && '' !== $hrefHash ) {

			// Anchor link inside of a 100% height scrolling section needs special handling.
			if ( ( $target.parents( '.hundred-percent-height-scrolling' ).length || $target.find( '.hundred-percent-height-scrolling' ).length ) && ( 0 != fusionScrollToAnchorVars.container_hundred_percent_height_mobile || ! Modernizr.mq( 'only screen and (max-width: ' + fusionScrollToAnchorVars.content_break_point + 'px)' ) ) ) { // jshint ignore:line

				// Anchor is on the scroll section itself.
				if ( $target.hasClass( 'fusion-scroll-section-element' ) ) {
					scrollSectionElement = $target;
				} else {

					// Anchor is inside the scroll section or using menu anchor option.
					scrollSectionElement = $target.parents( '.fusion-scroll-section-element' );
				}

				// Scrolled position is already at anchor, so do nothing.
				if ( scrollSectionElement.hasClass( 'active' ) && scrollSectionElement.offset().top >= jQuery( window ).scrollTop() && scrollSectionElement.offset().top < jQuery( window ).scrollTop() + jQuery( window ).height() ) {
					return false;
				}

				// If the anchor link was invoked from a different page add a special class to supress the scroll section scroll script.
				if ( location.hash && '#_' === location.hash.substring( 0, 2 ) ) {
					jQuery( '.fusion-page-load-link' ).addClass( 'fusion-page.load-scroll-section-link' );
				}

				if ( $target.parents( '.fusion-scroll-section' ).length ) {

					// If the scrolling section itself is not yet active, we first have to scroll to it.
					if ( ! $target.parents( '.fusion-scroll-section' ).hasClass( 'active' ) ) {

						// First scroll to the section top.
						$halfScrollPosition = Math.ceil( $target.parents( '.fusion-scroll-section' ).offset().top );

						jQuery( animationRoot ).animate( {
							scrollTop: $halfScrollPosition
						}, { duration: 400, easing: 'easeInExpo', complete: function() {

							// Timeout is needed, that all section elements get properly set.
							setTimeout( function() {

								// Trigger click on the nav item belonging to the element holding the anchor, which will perform the actual scrolling.
								$target.parents( '.fusion-scroll-section' ).find( '.fusion-scroll-section-nav' ).find( '.fusion-scroll-section-link[data-element=' + scrollSectionElement.data( 'element' )  + ']' ).trigger( 'click' );

								// Manipulate history after animation.
								if ( location.hash && '#_' === location.hash.substring( 0, 2 ) ) {
									if ( 'history' in window && 'replaceState' in history ) {
										history.replaceState( '', window.location.href.replace( '#_', '#' ), window.location.href.replace( '#_', '#' ) );
									}

									jQuery( '.fusion-page-load-link' ).removeClass( 'fusion-page.load-scroll-section-link' );
								}
							}, parseInt( fusionScrollToAnchorVars.hundred_percent_scroll_sensitivity ) + 50 );
						}
						} );
					} else {

						// We stay within the same main scrolling section, so we just have to trigger the correct nav item.

						// Trigger click on the nav item belonging to the element holding the anchor, which will perform the actual scrolling.
						$target.parents( '.fusion-scroll-section' ).find( '.fusion-scroll-section-nav' ).find( '.fusion-scroll-section-link[data-element=' + scrollSectionElement.data( 'element' )  + ']' ).trigger( 'click' );
					}

					return false;
				}
			}

			$adminbarHeight        = ( 'function' === typeof getAdminbarHeight ) ? getAdminbarHeight() : 0;
			$stickyHeaderHeight    = ( 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight() : 0;
			$currentScrollPosition = jQuery( document ).scrollTop();
			$newScrollPosition     = $target.offset().top - $adminbarHeight - $stickyHeaderHeight - customScrollOffset;
			$halfScrollAmount      = Math.abs( $currentScrollPosition - $newScrollPosition ) / 2;

			if ( $currentScrollPosition > $newScrollPosition ) {
				$halfScrollPosition = $currentScrollPosition - $halfScrollAmount;
			} else {
				$halfScrollPosition = $currentScrollPosition + $halfScrollAmount;
			}

			jQuery( animationRoot ).animate( {
				scrollTop: $halfScrollPosition
			}, { duration: 400, easing: 'easeInExpo', complete: function() {

				$adminbarHeight = ( 'function' === typeof getAdminbarHeight ) ? getAdminbarHeight() : 0;
				$stickyHeaderHeight = ( 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight() : 0;

				$newScrollPosition = ( $target.offset().top - $adminbarHeight - $stickyHeaderHeight - customScrollOffset );

				jQuery( animationRoot ).animate( {
					scrollTop: $newScrollPosition
				}, 450, 'easeOutExpo', function() {

					// Manipulate history after animation.
					if ( location.hash && '#_' === location.hash.substring( 0, 2 ) ) {
						if ( 'history' in window && 'replaceState' in history ) {
							history.replaceState( '', window.location.href.replace( '#_', '#' ), window.location.href.replace( '#_', '#' ) );
						}
					}
				} );

			}

			} );

			// On page tab link.
			if ( ( $target.hasClass( 'tab-pane' ) || $target.hasClass( 'tab-link' ) ) && 'function' === typeof jQuery.fn.fusionSwitchTabOnLinkClick ) {
				setTimeout( function() {
					$target.parents( '.fusion-tabs' ).fusionSwitchTabOnLinkClick();
				}, 100 );
			}

			return false;
		}
	};

}( jQuery ) );

jQuery( document ).ready( function() {

	jQuery( 'body' ).on( 'click', '.fusion-menu a:not([href="#"], .fusion-megamenu-widgets-container a, .search-link), .fusion-mobile-nav-item a:not([href="#"], .search-link), .fusion-button:not([href="#"], input, button), .fusion-one-page-text-link:not([href="#"]), .fusion-content-boxes .fusion-read-more:not([href="#"])', function( e ) {
		var $target,
			$targetArray,
			$targetID,
			$targetIDFirstChar,
			$targetPath,
			$targetPathLastChar,
			$targetWindow,
			isBuilder = jQuery( 'body' ).hasClass( 'fusion-builder-live' );

		if ( ( jQuery( this ).hasClass( 'avada-noscroll' ) || jQuery( this ).parent().hasClass( 'avada-noscroll' ) ) || ( jQuery( this ).is( '.fusion-content-box-button, .fusion-tagline-button' ) && jQuery( this ).parents( '.avada-noscroll' ).length ) ) {
			return true;
		}

		if ( this.hash ) {

			// Target path
			$targetWindow       = ( jQuery( this ).attr( 'target' ) ) ? jQuery( this ).attr( 'target' ) : '_self';
			$target             = jQuery( this ).attr( 'href' );
			$targetArray        = $target.split( '#' );
			$targetID           = ( 'undefined' !== typeof $targetArray[ 1 ] ) ? $targetArray[ 1 ] : '';
			$targetIDFirstChar  = $targetID.substring( 0, 1 );
			$targetPath         = $targetArray[ 0 ];
			$targetPathLastChar = $targetPath.substring( $targetPath.length - 1, $targetPath.length );

			if ( '/' !== $targetPathLastChar ) {
				$targetPath = $targetPath + '/';
			}

			if ( '!' === $targetIDFirstChar || '/' === $targetIDFirstChar  ) {
				return;
			}

			e.preventDefault();

			// If the link is outbound add an underscore right after the hash tag to make sure the link isn't present on the loaded page
			if ( ( location.pathname.replace( /^\//, '' ) == this.pathname.replace( /^\//, '' ) || '#' === $target.charAt( 0 ) ) && ( '' === location.search || -1 !== location.search.indexOf( 'lang=' ) || -1 !== location.search.indexOf( 'builder=' ) || jQuery( this ).hasClass( 'tfs-scroll-down-indicator' ) || jQuery( this ).hasClass( 'fusion-same-page-scroll' ) ) ) { // jshint ignore:line
				jQuery( this ).fusion_scroll_to_anchor_target();
				if ( 'history' in window && 'replaceState' in history && ! isBuilder ) {
					history.replaceState( '',  $target, $target );
				}
				if ( jQuery( this ).parents( '.fusion-flyout-menu' ).length ) {
					jQuery( '.fusion-flyout-menu-toggle' ).trigger( 'click' );
				}
			} else if ( ! isBuilder ) {

				// If we are on search page, front page anchors won't work, unless we add full path.
				if ( '/' === $targetPath && '' !== location.search ) {
					$targetPath = location.href.replace( location.search, '' );
				}

				window.open( $targetPath + '#_' + $targetID, $targetWindow );
			}
		}
	} );
} );

// Prevent anchor jumping on page load
if ( location.hash && '#_' === location.hash.substring( 0, 2 ) ) {

	// Add the anchor link to the hidden a tag
	jQuery( '.fusion-page-load-link' ).attr( 'href', decodeURIComponent( '#' + location.hash.substring( 2 ) ) );

	// Scroll the page
	jQuery( window ).on( 'load', function() {
		if ( jQuery( '.fusion-blog-shortcode' ).length ) {
			setTimeout( function() {
				jQuery( '.fusion-page-load-link' ).fusion_scroll_to_anchor_target();
			}, 300 );
		} else {
			jQuery( '.fusion-page-load-link' ).fusion_scroll_to_anchor_target();
		}
	} );
}
