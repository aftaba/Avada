/* global avadaWooCommerceVars, calcSelectArrowDimensions, Modernizr, generateCarousel, fusionInitPostFlexSlider, avadaAddQuantityBoxes, productBackgroundColor, productBackgroundColorLightness, wc_add_to_cart_variation_params, quickViewNonce */
/* eslint no-unused-vars: 0 */
/* eslint no-useless-escape: 0 */
function fusionResizeCrossfadeImages( $parent ) {
	var $parentHeight = $parent.height();

	$parent.find( 'img' ).each( function() {
		var $imgHeight = jQuery( this ).height();

		if ( $imgHeight < $parentHeight ) {
			jQuery( this ).css( 'margin-top', ( ( $parentHeight - $imgHeight ) / 2 )  + 'px' );
		}
	} );
}

function fusionResizeCrossfadeImagesContainer( $container ) {
	var $biggestHeight = 0;

	$container.find( 'img' ).each( function() {
		var $imgHeight = jQuery( this ).height();

		if ( $imgHeight > $biggestHeight ) {
			$biggestHeight = $imgHeight;
		}
	} );

	$container.css( 'height', $biggestHeight );
}

function fusionCalcWoocommerceTabsLayout( $tabSelector ) {
	jQuery( $tabSelector ).each( function() {
		var $menuWidth     = jQuery( this ).parent().width(),
			$menuItems     = jQuery( this ).find( 'li' ).length,
			$mod           = $menuWidth % $menuItems,
			$itemWidth     = ( $menuWidth - $mod ) / $menuItems,
			$lastItemWidth = $menuWidth - ( $itemWidth * ( $menuItems - 1 ) );

		jQuery( this ).css( 'width', $menuWidth + 'px' );
		jQuery( this ).find( 'li' ).css( 'width', $itemWidth + 'px' );
		jQuery( this ).find( 'li:last' ).css( 'width', $lastItemWidth + 'px' ).addClass( 'no-border-right' );
	} );
}

// Resize crossfade images and square to be the largest image and also vertically centered
jQuery( window ).on( 'load', function() {

	// Make sure position of #wrapper and sticky header are correct when WooCommerce demo store notice is dismissed.
	jQuery( '.woocommerce-store-notice__dismiss-link' ).click( function() {
		var adminbarHeight = ( jQuery( '#wpadminbar' ).length ) ? jQuery( '#wpadminbar' ).height() : 0;

		jQuery( '#wrapper' ).css( 'margin-top', '' );
		jQuery( '.fusion-header' ).css( 'top', adminbarHeight );
	} );

	jQuery( '.variations_form' ).find( '.variations .single_variation_wrap .woocommerce-variation-description' ).remove();

	jQuery( window ).resize(
		function() {
			jQuery( '.crossfade-images' ).each(
				function() {
					fusionResizeCrossfadeImagesContainer( jQuery( this ) );
					fusionResizeCrossfadeImages( jQuery( this ) );
				}
			);
		}
	);

	if ( 'function' === typeof jQuery.fn.equalHeights && 0 < jQuery( '.double-sidebars.woocommerce .social-share > li' ).length ) {
		jQuery( '.double-sidebars.woocommerce .social-share > li' ).equalHeights();
	}

	jQuery( '.crossfade-images' ).each( function() {
		fusionResizeCrossfadeImagesContainer( jQuery( this ) );
		fusionResizeCrossfadeImages( jQuery( this ) );
	} );

	// Make the onsale badge also work on products without image
	jQuery( '.product-images' ).each(
		function() {
			if ( ! jQuery( this ).find( 'img' ).length && jQuery( this ).find( '.onsale' ).length ) {
				jQuery( this ).css( 'min-height', '45px' );
			}
		}
	);

	jQuery( 'body' ).on( 'click', '.woocommerce .images #carousel a', function( e ) {
		e.preventDefault();
	} );

	if ( jQuery( '.adsw-attribute-option' ).length ) {
		jQuery( 'body' ).on( 'show_variation', '.variations_form', function() {
			jQuery( '.product-type-variable .variations_form > .single_variation_wrap .woocommerce-variation-price' ).css( 'display', 'inline-block' );
			jQuery( '.product-type-variable .variations_form > .single_variation_wrap .woocommerce-variation-price .price' ).css( 'margin-top', '0' );
			jQuery( '.product-type-variable .variations_form > .single_variation_wrap .woocommerce-variation-availability' ).css( 'display', 'inline-block' );
		} );
	}

	// Make sure the variation image is also changed in the thumbs carousel and for lightbox
	jQuery( 'body' ).on( 'change', '.variations_form .variations select', function() {

		// Timeout needed to get updated image src attribute
		setTimeout( function() {
			var $sliderFirstImage           = jQuery( '.images' ).find( '#slider img:eq(0)' ),
				$sliderFirstImageParentLink = $sliderFirstImage.parent(),
				$sliderFirstImageSrc        = $sliderFirstImage.attr( 'src' ),
				$thumbsFirstImage           = jQuery( '.images' ).find( '#carousel img:eq(0)' ),
				$slider;

			if ( $sliderFirstImageParentLink && $sliderFirstImageParentLink.attr( 'href' ) ) {
				$sliderFirstImageSrc = $sliderFirstImageParentLink.attr( 'href' );
			}

			$sliderFirstImage.parent().attr( 'href', $sliderFirstImageSrc );
			$sliderFirstImage.removeAttr( 'sizes' );
			$sliderFirstImage.removeAttr( 'srcset' );

			// Refresh the lightbox
			window.avadaLightBox.refresh_lightbox();

			$thumbsFirstImage.attr( 'src', $sliderFirstImageSrc );
			$thumbsFirstImage.removeAttr( 'sizes' );
			$thumbsFirstImage.removeAttr( 'srcset' );

			$slider = jQuery( '.images #slider' ).data( 'flexslider' );
			if ( $slider ) {
				$slider.resize();
			}

			$slider = jQuery( '.images #carousel' ).data( 'flexslider' );
			if ( $slider ) {
				$slider.resize();
			}

		}, 1 );

		setTimeout( function() {
			var $slider;

			window.avadaLightBox.refresh_lightbox();

			$slider = jQuery( '.images #slider' ).data( 'flexslider' );
			if ( $slider ) {
				$slider.resize();
			}
		}, 500 );

		setTimeout( function() {
			window.avadaLightBox.refresh_lightbox();
		}, 1500 );
	} );
} );

jQuery( document ).ready( function() {
	var name,
		$titleSep,
		$titleSepClassString,
		$titleMainSepClassString,
		$headingOrientation,
		i,
		quickViewInterval,
		previewImageInterval;

	jQuery( '.fusion-update-cart' ).on( 'click', function( e ) {
		e.preventDefault();
		jQuery( '.cart .actions > .button' ).trigger( 'click' );
	} );

	jQuery( '.fusion-apply-coupon' ).on( 'click', function( e ) {
		e.preventDefault();
		jQuery( '.cart .actions .coupon #coupon_code' ).val( jQuery( '#avada_coupon_code' ).val() );
		jQuery( '.cart .actions .coupon .button' ).trigger( 'click' );
	} );

	jQuery( 'body' ).on( 'click', '.add_to_cart_button.ajax_add_to_cart', function() {
		var cartLoading = jQuery( this ).closest( '.product, li' ).find( '.cart-loading' );

		cartLoading.find( 'i' ).removeClass( 'fusion-icon-check-square-o' ).addClass( 'fusion-icon-spinner' );
		cartLoading.fadeIn();
		setTimeout( function() {
			cartLoading.find( 'i' ).hide().removeClass( 'fusion-icon-spinner' ).addClass( 'fusion-icon-check-square-o' ).fadeIn();
			cartLoading.closest( '.fusion-clean-product-image-wrapper, li' ).addClass( 'fusion-item-in-cart' );
		}, 2000 );
	} );

	jQuery( '.products .product, .fusion-woo-slider li' ).mouseenter( function() {
		var cartLoading = jQuery( this ).find( '.cart-loading' );

		if ( cartLoading.find( 'i' ).hasClass( 'fusion-icon-check-square-o' ) ) {
			cartLoading.fadeIn();
		}
	} ).mouseleave( function() {
		var cartLoading = jQuery( this ).find( '.cart-loading' );

		if ( cartLoading.find( 'i' ).hasClass( 'fusion-icon-check-square-o' ) ) {
			cartLoading.fadeOut();
		}
	} );

	if ( jQuery( '.woocommerce-store-notice' ).length && jQuery( '.woocommerce-store-notice' ).is( ':visible' ) && ! jQuery( '.fusion-top-frame' ).is( ':visible' ) ) {
		jQuery( '#wrapper' ).css( 'margin-top', jQuery( '.woocommerce-store-notice' ).outerHeight() );
		if ( 0 < jQuery( '#slidingbar-area' ).outerHeight() ) {
			jQuery( '.header-wrapper' ).css( 'margin-top', '0' );
		}
		if ( jQuery( '.sticky-header' ).length ) {
			jQuery( '.sticky-header' ).css( 'margin-top', jQuery( '.woocommerce-store-notice' ).outerHeight() );
		}
	}

	jQuery( '.catalog-ordering .orderby .current-li a' ).html( jQuery( '.catalog-ordering .orderby ul li.current a' ).html() );
	jQuery( '.catalog-ordering .sort-count .current-li a' ).html( jQuery( '.catalog-ordering .sort-count ul li.current a' ).html() );
	jQuery( '.woocommerce .avada-myaccount-data th.woocommerce-orders-table__cell-order-actions' ).text( avadaWooCommerceVars.order_actions );

	jQuery( 'body.rtl .avada-myaccount-data .my_account_orders .woocommerce-orders-table__cell-order-status' ).each( function() {
		jQuery( this ).css( 'text-align', 'right' );
	} );

	jQuery( '.woocommerce input' ).each( function() {
		if ( ! jQuery( this ).has( '#coupon_code' ) ) {
			name = jQuery( this ).attr( 'id' );
			jQuery( this ).attr( 'placeholder', jQuery( this ).parent().find( 'label[for=' + name + ']' ).text() );
		}
	} );

	if ( jQuery( '.woocommerce #reviews #comments .comment_container .comment-text' ).length ) {
		jQuery( '.woocommerce #reviews #comments .comment_container' ).append( '<div class="clear"></div>' );
	}

	$titleSep                = avadaWooCommerceVars.title_style_type.split( ' ' );
	$titleSepClassString     = '';
	$titleMainSepClassString = '';
	$headingOrientation      = 'title-heading-left';

	for ( i = 0; i < $titleSep.length; i++ ) {
		$titleSepClassString += ' sep-' + $titleSep[ i ];
	}

	if ( -1 < $titleSepClassString.indexOf( 'underline' ) ) {
		$titleMainSepClassString = $titleSepClassString;
	}

	if ( jQuery( 'body' ).hasClass( 'rtl' ) ) {
		$headingOrientation = 'title-heading-right';
	}

	jQuery( '.woocommerce.single-product .related.products > h2' ).each( function() {
		var $relatedHeading = jQuery( this ).replaceWith( function() {
			return '<div class="fusion-title title' + $titleSepClassString + '"><h' + avadaWooCommerceVars.related_products_heading_size + ' class="' + $headingOrientation + '">' + jQuery( this ).html() + '</h' + avadaWooCommerceVars.related_products_heading_size + '><div class="title-sep-container"><div class="title-sep' + $titleSepClassString + ' "></div></div></div>';
		} );
	} );

	jQuery( '.woocommerce.single-product .upsells.products > h2' ).each( function() {
		var $relatedHeading = jQuery( this ).replaceWith( function() {
			return '<div class="fusion-title title' + $titleSepClassString + '"><h3 class="' + $headingOrientation + '">' + jQuery( this ).html() + '</h3><div class="title-sep-container"><div class="title-sep' + $titleSepClassString + ' "></div></div></div>';
		} );
	} );

	jQuery( '.woocommerce-tabs #comments > h2' ).each( function() {
		var $commentsHeading = jQuery( this ).replaceWith( function() {
			return '<h3>' + jQuery( this ).html() + '</h3>';
		} );
	} );

	if ( 'block' === jQuery( 'body .sidebar' ).css( 'display' ) ) {
		fusionCalcWoocommerceTabsLayout( '.woocommerce-tabs .tabs-horizontal' );
	}

	jQuery( '.sidebar .products,.fusion-footer-widget-area .products,#slidingbar-area .products' ).each( function() {
		jQuery( this ).removeClass( 'products-4' );
		jQuery( this ).removeClass( 'products-3' );
		jQuery( this ).removeClass( 'products-2' );
		jQuery( this ).addClass( 'products-1' );
	} );

	jQuery( '.products-6 li, .products-5 li, .products-4 li, .products-3 li, .products-2 li' ).removeClass( 'last' );

	// Woocommerce nested products plugin support
	jQuery( '.subcategory-products' ).each( function() {
		jQuery( this ).addClass( 'products-' + avadaWooCommerceVars.woocommerce_shop_page_columns );
	} );

	jQuery( '.woocommerce-tabs ul.tabs li a' ).unbind( 'click' );
	jQuery( 'body' ).on( 'click', '.woocommerce-tabs > ul.tabs li a', function() {

		var tab         = jQuery( this ),
			tabsWrapper = tab.closest( '.woocommerce-tabs' );

		jQuery( 'ul.tabs li', tabsWrapper ).removeClass( 'active' );
		jQuery( '> div.panel', tabsWrapper ).hide();
		jQuery( 'div' + tab.attr( 'href' ), tabsWrapper ).show();
		tab.parent().addClass( 'active' );

		return false;
	} );

	// If using one page, use the checkout_error to change scroll.
	if ( ! jQuery( '.continue-checkout' ).length ) {
		jQuery( document ).on( 'checkout_error', function() {
			var $adminBarHeight     = ( jQuery( '#wpadminbar' ).length ) ? jQuery( '#wpadminbar' ).height() : 0,
				$headerDivChildren  = jQuery( '.fusion-header-wrapper' ).find( 'div' ),
				$stickyHeaderHeight = 0;

			jQuery( 'html, body' ).stop();

			$headerDivChildren.each( function() {
				if ( 'fixed' === jQuery( this ).css( 'position' ) ) {
					$stickyHeaderHeight = jQuery( this ).height();
				}
			} );
			if ( jQuery( '.woocommerce-error' ).length ) {
				jQuery( 'html, body' ).animate( { scrollTop: jQuery( '.woocommerce-error' ).offset().top - $adminBarHeight - $stickyHeaderHeight }, 500 );
			}
		} );
	}

	jQuery( '.woocommerce-checkout-nav a,.continue-checkout' ).on( 'click', function( e ) {
		var $adminBarHeight     = ( jQuery( '#wpadminbar' ).length ) ? jQuery( '#wpadminbar' ).height() : 0,
			$headerDivChildren  = jQuery( '.fusion-header-wrapper' ).find( 'div' ),
			$stickyHeaderHeight = 0,
			$dataName,
			$name,
			$scrollAnchor;

		$headerDivChildren.each( function() {
			if ( 'fixed' === jQuery( this ).css( 'position' ) ) {
				$stickyHeaderHeight = jQuery( this ).height();
			}
		} );

		e.preventDefault();
		jQuery( '.avada-checkout-error' ).parent().remove();

		if ( 0 < jQuery( '.validate-required:visible' ).length ) {

			jQuery.each( jQuery( '.validate-required:visible' ), function( index, element ) {

				var input = jQuery( element ).find( ':input' );

				// Radio type included, because the WooCommerce validation function fails to recognize input on radios.
				if ( 'hidden' === input.attr( 'type' ) || 'radio' === input.attr( 'type' ) ) {
					jQuery( element ).addClass( 'woocommerce-validated' );
				} else {
					input.trigger( 'change' );
				}
			} );
		}

		jQuery( '.woocommerce' ).trigger( 'avada_checkout_continue_field_validation' );

		if ( ! jQuery( '.woocommerce .woocommerce-billing-fields, .woocommerce .woocommerce-shipping-fields, .woocommerce .woocommerce-account-fields' ).find( '.input-text, select, input:checkbox' ).closest( '.validate-required:not(.woocommerce-validated)' ).is( ':visible' ) ) {

			$dataName = jQuery( this ).attr( 'data-name' );
			$name     = $dataName;

			if ( 'order_review' === $dataName ) {
				$name = '#' + $dataName;
			} else {
				$name = '.' + $dataName;
			}

			jQuery( 'form.checkout .col-1, form.checkout .col-2, form.checkout #order_review_heading, form.checkout #order_review' ).hide();

			jQuery( 'form.checkout' ).find( $name ).fadeIn();
			if ( 'order_review' === $name ) {
				jQuery( 'form.checkout' ).find( '#order_review_heading ' ).fadeIn();
			}

			jQuery( '.woocommerce-checkout-nav li' ).removeClass( 'is-active' );
			jQuery( '.woocommerce-checkout-nav' ).find( '[data-name=' + $dataName + ']' ).parent().addClass( 'is-active' );

			if ( jQuery( this ).hasClass( 'continue-checkout' ) && 0 < jQuery( window ).scrollTop() ) {
				if ( jQuery( '.woo-tabs-horizontal' ).length ) {
					$scrollAnchor = jQuery( '.woocommerce-checkout-nav' );
				} else {
					$scrollAnchor = jQuery( '.woocommerce-content-box.avada-checkout' );
				}

				jQuery( 'html, body' ).animate( { scrollTop: $scrollAnchor.offset().top - $adminBarHeight - $stickyHeaderHeight }, 500 );
			}
		} else {
			jQuery( '.woocommerce .avada-checkout .woocommerce-checkout' ).prepend( '<ul class="woocommerce-error"><li class="avada-checkout-error">' + avadaWooCommerceVars.woocommerce_checkout_error + '</li><ul>' );

			jQuery( 'html, body' ).animate( { scrollTop: jQuery( '.woocommerce-error' ).offset().top - $adminBarHeight - $stickyHeaderHeight }, 500 );
		}

		// Set heights of select arrows correctly
		calcSelectArrowDimensions();
	} );

	// Ship to a different address toggle
	jQuery( 'body' ).on( 'click', 'input[name=ship_to_different_address]',
		function() {
			if ( jQuery( this ).is( ':checked' ) ) {
				setTimeout( function() {

					// Set heights of select arrows correctly
					calcSelectArrowDimensions();
				}, 1 );
			}
		}
	);

	if ( Modernizr.mq( 'only screen and (max-width: 479px)' ) ) {
		jQuery( '.overlay-full.layout-text-left .slide-excerpt p' ).each( function() {
			var excerpt     = jQuery( this ).html(),
				wordArray   = excerpt.split( /[\s\.\?]+/ ), // Split based on regular expression for spaces
				maxWords    = 10, // Max number of words
				$totalWords = wordArray.length, // Current total of words
				newString   = '',
				l;

			// Roll back the textarea value with the words that it had previously before the maximum was reached
			if ( $totalWords > maxWords + 1 ) {
				for ( l = 0; l < maxWords; l++ ) {
					newString += wordArray[ l ] + ' ';
				}
				jQuery( this ).html( newString );
			}
		} );
	}

	// Fix for #7449.
	jQuery( '.wc-tabs li' ).click( function() {
		var $tab = jQuery( this ).attr( 'aria-controls' );
		setTimeout( function() {

			// Image carousel.
			if ( jQuery( '#' + $tab ).find( '.fusion-carousel' ).length && 'function' === typeof generateCarousel ) {
				generateCarousel();
			}

			// Gallery.
			jQuery( '#' + $tab ).find( '.fusion-gallery' ).each( function() {
				jQuery( this ).isotope();
			} );

			// Blog.
			jQuery( '#' + $tab ).find( '.fusion-blog-shortcode' ).each( function() {
				jQuery( this ).find( '.fusion-blog-layout-grid' ).isotope();
			} );

			// Testimonials.
			jQuery( '#' + $tab ).find( '.fusion-testimonials .reviews' ).each( function() {
				jQuery( this ).css( 'height', jQuery( this ).children( '.active-testimonial' ).height() );
			} );

			// Make WooCommerce shortcodes work.
			jQuery( '#' + $tab ).find( '.crossfade-images' ).each(	function() {
				fusionResizeCrossfadeImagesContainer( jQuery( this ) );
				fusionResizeCrossfadeImages( jQuery( this ) );
			} );

			// Flip Boxes.
			if ( 'function' === typeof jQuery.fn.fusionCalcFlipBoxesHeight ) {
				jQuery( '#' + $tab ).find( '.flip-box-inner-wrapper' ).each( function() {
					jQuery( this ).fusionCalcFlipBoxesHeight();
				} );
			}

			// Portfolio.
			jQuery( '#' + $tab ).find( '.fusion-portfolio' ).each( function() {
				jQuery( this ).find( '.fusion-portfolio-wrapper' ).isotope();
			} );

			// Google maps.
			if ( 'function' === typeof jQuery.fn.reinitializeGoogleMap ) {
				jQuery( '#' + $tab ).find( '.shortcode-map' ).each( function() {
					jQuery( this ).reinitializeGoogleMap();
				} );
			}
		}, 150 );
	} );

	jQuery( 'body' ).on( 'click', '.fusion-quick-view', function( e ) {
		var quickViewOverlay         = jQuery( '.fusion-woocommerce-quick-view-overlay' ),
			quickViewContainer       = jQuery( '.fusion-woocommerce-quick-view-container' ),
			quickViewPreviewImage    = quickViewContainer.find( '.fusion-wqv-preview-image' ),
			quickViewContent         = quickViewContainer.find( '.fusion-wqv-content' ),
			closeButton              = quickViewContainer.find( '.fusion-wqv-close' ),
			loader                   = quickViewContainer.find( '.fusion-wqv-loader' ),
			productId                = jQuery( this ).data( 'product-id' ),
			productTag               = jQuery( this ).closest( '.product' ),
			productElement           = productTag.length ? productTag : jQuery( this ).closest( '.fusion-carousel-item' ),
			productImage             = productElement.find( '.wp-post-image' ),
			productOnSale            = productElement.find( '.onsale' ),
			productSoldOut           = productElement.find( '.fusion-out-of-stock' ),
			productTitle             = productElement.find( '.product-title' ).length ? productElement.find( '.product-title' ) : productElement.find( '.fusion-rollover-title' ),
			productPrice             = productElement.find( '.fusion-price-rating' ).length ? productElement.find( '.fusion-price-rating' ) : productElement.find( '.price' ),
			productImageAspectRatio  = parseInt( productImage.height(), 10 ) / parseInt( productImage.width(), 10 ),
			detailsButton,
			quickViewContainerCoords = {},
			quickViewContainerFullyAnimated = false;

		e.preventDefault();

		// Close quick view on esc press.
		jQuery( 'body' ).addClass( 'fusion-wqv-open' );
		jQuery( '.fusion-wqv-open' ).on( 'keydown', function( event ) {
			if ( 27 === event.keyCode ) {
				jQuery( '.fusion-wqv-close button' ).trigger( 'click' );
			}
		} );

		// If no product ID could be retrieved, return.
		if ( 'undefined' === typeof productId ) {
			return;
		}

		// Remove old product markup.
		quickViewContent.empty();

		// Remove old loader markup.
		loader.find( '.entry-title, .star-rating, .price' ).empty();

		// Make sure modal and overlay are above sticky header and parallax footer is still correct.
		if ( jQuery( '.fusion-footer-parallax' ).length ) {
			jQuery( '#main' ).css( 'z-index', 'auto' );

			if ( 'fixed' === jQuery( '.fusion-footer-parallax' ).css( 'position' ) ) {
				jQuery( '.fusion-footer-parallax' ).css( 'z-index', '-1' );

				if ( jQuery( '#sliders-container' ).find( '.tfs-slider[data-parallax="1"]' ).length ) {
					jQuery( '#sliders-container' ).css( 'z-index', 'auto' );
				}
			}
		}

		// Show main container and preview image.
		quickViewContainer.stop().fadeIn( '200' );
		quickViewPreviewImage.fadeIn( '200' ).html( productImage.clone() );

		// Fade overlay in.
		quickViewOverlay.stop().fadeIn( '400' );

		// Add sale badge.
		if ( productOnSale.length ) {
			quickViewPreviewImage.prepend( productOnSale.clone() );
		}

		// Add sold out badge.
		if ( productSoldOut.length ) {
			quickViewPreviewImage.prepend( productSoldOut.clone() );

			if ( productOnSale.length ) {
				quickViewPreviewImage.find( '.onsale' ).addClass( 'sold-out' );
			}
		}

		// Hide product.
		productElement.find( '> span, > a, > div' ).fadeTo( '200', '0' );
		productElement.addClass( 'fusion-faded-out' );

		// Position container and preview image.
		quickViewContainerCoords.startTop    = productImage.offset().top - jQuery( window ).scrollTop();
		quickViewContainerCoords.startLeft   = productImage.offset().left;
		quickViewContainerCoords.startWidth  = productImage.width();
		quickViewContainerCoords.startHeight = productImage.height();
		quickViewContainerCoords.endWidth    = 400;

		// Landscape image.
		if ( 1.77 < 1 / productImageAspectRatio ) {
			quickViewContainerCoords.endWidth = 500;
		}

		// Portrait image.
		if ( 1.77 < productImageAspectRatio ) {
			quickViewContainerCoords.endWidth = 300;
		}

		// Calc end coords of container with image but without contents.
		quickViewContainerCoords.endHeight  = Math.floor( quickViewContainerCoords.endWidth / quickViewContainerCoords.startWidth * quickViewContainerCoords.startHeight );
		quickViewContainerCoords.endTop     = Math.round( ( jQuery( window ).height() - quickViewContainerCoords.endHeight ) / 2 );
		quickViewContainerCoords.endLeft    = Math.round( ( jQuery( window ).width() - quickViewContainerCoords.endWidth ) / 2 );
		quickViewContainerCoords.finalWidth = Math.round( quickViewContainerCoords.endWidth + 500 );

		if ( 500 > jQuery( window ).width() - quickViewContainerCoords.endWidth ) {
			quickViewContainerCoords.finalWidth = Math.round( jQuery( window ).width() - 20 );
		}
		quickViewContainerCoords.finalLeft  = Math.round( ( jQuery( window ).width() - quickViewContainerCoords.finalWidth ) / 2 );

		// Set coords for container.
		quickViewContainer.css( {
			'top': quickViewContainerCoords.startTop,
			'left': quickViewContainerCoords.startLeft,
			'width': quickViewContainerCoords.startWidth,
			'height': quickViewContainerCoords.startHeight,
			'background-color': avadaWooCommerceVars.shop_page_bg_color
		} );

		// Set max width and height for the preview image.
        quickViewPreviewImage.css( {
			'max-width': quickViewContainerCoords.endWidth,
			'max-height': quickViewContainerCoords.endHeight
		} );

		// Remove top margin for classic layout.
		quickViewPreviewImage.find( 'img' ).removeAttr( 'style' );

		setTimeout( function() {

			// Animate position and size of the container.
			quickViewContainer.animate( {
				'top': quickViewContainerCoords.endTop + 'px',
				'left': quickViewContainerCoords.endLeft + 'px',
				'width': quickViewContainerCoords.endWidth + 'px',
				'height': quickViewContainerCoords.endHeight + 'px'
			}, 800, 'easeInOutCubic' );

		}, 200 );

		setTimeout( function() {

			// Animate to final position and size of the container, incl. contents.
			quickViewContainer.animate( {
				'left': quickViewContainerCoords.finalLeft + 'px',
				'width': quickViewContainerCoords.finalWidth + 'px'
			}, 600, 'easeInOutCubic', function() {
				jQuery( this ).addClass( 'complete' );
				jQuery( this ).css( 'top', '' );
				jQuery( this ).css( 'left', '' );
			} );
		}, 	1000 );

		setTimeout( function() {

			// Show close button.
			closeButton.fadeIn( '300' );

			// Set color of close button.
			if ( 40 > avadaWooCommerceVars.shop_page_bg_color_lightness ) {
				closeButton.find( 'button' ).addClass( 'light' );
			}

			quickViewContainerFullyAnimated = true;

			// Only do preloader stuff, if AJAX has not completed yet.
			if ( ! quickViewContainer.hasClass( 'fusion-quick-view-loaded' ) ) {

				// Add title to loader, if available.
				if ( productTitle.length ) {
					loader.find( '.entry-title' ).html( productTitle.text() );

					if ( parseFloat( avadaWooCommerceVars.post_title_font_size ) < parseFloat( loader.find( '.entry-title' ).css( 'font-size' ) ) ) {
						loader.find( '.entry-title' ).css( 'font-size', parseFloat( avadaWooCommerceVars.post_title_font_size ) + 'px' );
					}
				}

				// Add price / rating to loader, if available.
				if ( productPrice.length ) {
					loader.find( '.star-rating' ).show();

					if ( productPrice.hasClass( 'fusion-price-rating' ) ) {
						loader.find( '.fusion-price-rating' ).html( productPrice.children().clone() );
					} else {
						loader.find( '.fusion-price-rating .price' ).html( productPrice.clone() );
					}

					if ( loader.find( '.star-rating' ).is( ':empty' ) ) {
						loader.find( '.star-rating' ).hide();
					}
				}

				// Position loader and show.
				loader.css( 'left', 'calc(100% - ' + Math.round( ( quickViewContainerCoords.finalWidth - quickViewContainerCoords.endWidth ) / 2 ) + 'px)' );
				loader.stop().fadeTo( '300', '1' );
			}
		}, 1600 );

		// Get the actual roduct data and markup.
		jQuery.post( avadaWooCommerceVars.ajaxurl, {
			action: 'fusion_quick_view_load',
			nonce: quickViewNonce,
			product: jQuery( this ).data( 'product-id' )
		}, function( response ) {

			// Add the WooCommerce cart variation script localizations.
			if ( 'undefined' === typeof wc_add_to_cart_variation_params ) {
				response += '<script type="text/javascript">var wc_add_to_cart_variation_params = {};</script>';
			} else {
				response += '<script type="text/javascript">var wc_add_to_cart_variation_params = ' + JSON.stringify( wc_add_to_cart_variation_params ) + ';</script>';
			}

			// Add the quick view loaded class.
			quickViewContainer.addClass( 'fusion-quick-view-loaded' );

			quickViewInterval = setInterval( function() {

				if ( quickViewContainerFullyAnimated ) {

					// Add the animation class.
					quickViewContainer.addClass( 'fusion-animate-content fusion-quick-view-loaded' );

					// Show the main content area.
					quickViewContainer.find( '.fusion-wqv-content' ).show();

					setTimeout( function() {
						// Add the new product markup to the quick view container.
						quickViewContent.html( response );

						// Set some dimensions according to the available space.
						quickViewContent.find( '.woocommerce-product-gallery' ).css( 'width', quickViewContainerCoords.endWidth + 'px' );
						quickViewContent.find( '.product' ).css( 'max-height', quickViewContainerCoords.endHeight + 'px' );

						// Set background color to the one of the product.
						if ( 'undefined' !== typeof productBackgroundColor ) {
							quickViewContainer.css( 'background-color', productBackgroundColor );

							// Set color of close button.
							if ( 40 > productBackgroundColorLightness ) {
								closeButton.find( 'button' ).addClass( 'light' );
							}
						}

						// Hide the loader.
						loader.stop().fadeTo( '300', '0' );

						// Fade content in.
						quickViewContainer.find( '.entry-summary' ).animate( {
							'opacity': '1'
						}, 500, 'easeInOutCubic', function() {
							jQuery( this ).scrollTop( 0 );
						} );

						// Animate content in.
						quickViewContainer.find( '.entry-summary' ).children().animate( {
							'padding-top': '0'
						}, 500, 'easeInOutCubic' );

					}, 400 );

					setTimeout( function() {

						// Fade details button in.
						detailsButton = quickViewContainer.find( '.fusion-button-view-details' );

						detailsButton.css( 'top', detailsButton.height() );
						detailsButton.animate( {
							'opacity': '1',
							'top': '0'
						}, 200, 'easeInOutCubic' );
					}, 	700 );

					setTimeout( function() {

						// Remove the animation class.
						quickViewContainer.removeClass( 'fusion-animate-content' );
					}, 900 );

					setTimeout( function() {
						// Slideshow.
						fusionInitPostFlexSlider();

						// Select boxes.
						jQuery( window ).trigger( 'AddAvadaSelect' );

						// Variations.
						if ( 'undefined' !== typeof wc_add_to_cart_variation_params ) {
							jQuery( '.variations_form' ).each( function() {
								jQuery( this ).wc_variation_form();
							} );
						}

						// Quantity boxes.
						avadaAddQuantityBoxes();
					}, 400 );

					previewImageInterval = setInterval( function() {
						if ( 10 > Math.abs( quickViewContainer.find( '.flex-active-slide' ).width() - quickViewContainer.find( '.fusion-wqv-preview-image' ).width() ) ) {

							// Hide the preview image.
							quickViewContainer.find( '.fusion-wqv-preview-image' ).fadeOut( '400' );

							clearInterval( previewImageInterval );
						}
					}, 500 );

					// Clear the main AJAX complete intervall.
					clearInterval( quickViewInterval );
				}
			}, 25 );
		} );
	} );

	jQuery( '.fusion-wqv-close button' ).on( 'click', function() {
		var quickViewContainer = jQuery( this ).closest( '.fusion-woocommerce-quick-view-container' );

		quickViewContainer.removeClass( 'fusion-quick-view-loaded' );

		// Clear the loading intervals.
		clearInterval( quickViewInterval );
		clearInterval( previewImageInterval );

		// Remove quick view esc key binding and body class.
		jQuery( '.fusion-wqv-open' ).off( 'keydown' );
		jQuery( 'body' ).removeClass( 'fusion-wqv-open' );

		// Fade out overlay.
		jQuery( '.fusion-woocommerce-quick-view-overlay' ).fadeOut( '400' );

		// Animate quick view container to half size and fade out.
		quickViewContainer.stop().animate( {
			'width': quickViewContainer.width() / 2,
			'height': quickViewContainer.height() / 2,
			'opacity': '0'
		}, 300, 'easeInOutCubic', function() {
			jQuery( this ).hide();
			jQuery( this ).removeAttr( 'style' );
			jQuery( this ).removeClass( 'complete' );
			jQuery( this ).find( '.fusion-wqv-preview-image' ).removeAttr( 'style' );
			jQuery( this ).find( '.entry-title' ).removeAttr( 'style' );

			// Remove parallax footer z-index adjustments.
			if ( jQuery( '.fusion-footer-parallax' ).length ) {
				jQuery( '#main' ).css( 'z-index', '' );
				jQuery( '.fusion-footer-parallax' ).css( 'z-index', '' );
				jQuery( '#sliders-container' ).css( 'z-index', '' );
			}
		} );

		// Show close button.
		quickViewContainer.find( '.fusion-wqv-close' ).fadeOut( '300' );

		// Fade main product contents back in.
		jQuery( '.fusion-faded-out' ).find( '> span, > a, > div' ).fadeTo( '300', '1', function() {
			jQuery( this ).css( 'opacity', '' );
		} );

		// Remove faded class from main product.
		jQuery( '.fusion-faded-out' ).removeClass( 'fusion-faded-out' );
	} );

	// Close quick view on outside click.
	jQuery( document ).on( 'click', '.fusion-woocommerce-quick-view-overlay', function( event ) {
		jQuery( '.fusion-wqv-close button' ).trigger( 'click' );
	} );

	// Resize quick view modal.
	jQuery( window ).on( 'resize', function( event ) {
		var quickViewContainer = jQuery( '.fusion-woocommerce-quick-view-container' ),
			galleryWidth       = quickViewContainer.find( '.woocommerce-product-gallery' ).width(),
			windowWidth        = jQuery( window ).width();

		// Early return if quick view is not open.
		if ( ! jQuery( 'body' ).hasClass( 'fusion-wqv-open' ) ) {
			return;
		}

		// If quick view modal is smaller than viewport.
		if ( quickViewContainer.width() < windowWidth - 20 ) {

			// If the full final width is smaller than the viewprt.
			if ( galleryWidth + 500 <= windowWidth - 20 ) {
				quickViewContainer.width( galleryWidth + 500 );
			} else {
				quickViewContainer.width( windowWidth - 20 );
			}
		} else {
			quickViewContainer.width( windowWidth - 20 );
		}
	} );
} );

jQuery( window ).on( 'load fusion-reinit-single-post-slideshow', function( event ) {
	var imageThumbs,
		variation;

	// Re-init Woo flexslider on partial refresh. This is done both for native and Avada galleries.
	if ( 'fusion-reinit-single-post-slideshow' === event.type  && 'function' === typeof jQuery.fn.wc_product_gallery ) {
		jQuery( '.woocommerce-product-gallery' ).wc_product_gallery();
	}

	if ( jQuery( '.avada-product-gallery' ).length ) {

		imageThumbs = ( jQuery( '.flex-control-nav' ).find( 'img' ).length ) ? jQuery( '.flex-control-nav' ).find( 'img' ) : jQuery( '<img class="fusion-main-image-thumb">' ).attr( 'src', jQuery( '.flex-viewport' ).find( '.flex-active-slide' ).data( 'thumb' ) );

		jQuery( '.flex-viewport' ).find( '.flex-active-slide' ).addClass( 'fusion-main-image' );
		jQuery( '.flex-control-nav' ).find( 'li:eq(0) img' ).addClass( 'fusion-main-image-thumb' );

		// Trigger the variation form change on init, needed if a default variation is set.
		setTimeout( function() {
			jQuery( '.variations select' ).trigger( 'change' );
		}, 100 );

		jQuery( 'body' ).on( 'found_variation', '.variations_form', function( scopedEvent, variationParam ) {
			variation = variationParam;

			// Check if variations are AJAX loaded due to number of variations > 30.
			if ( false === jQuery( this ).data( 'product_variations' ) ) {
				variationsChange( imageThumbs, variation, jQuery( this ) );
			}
		} );

		// Make sure the variation image is also changed in the thumbs carousel and for lightbox.
		if ( false !== jQuery( '.variations_form' ).data( 'product_variations' ) ) {
			jQuery( 'body' ).on( 'change', '.variations_form .variations select', function() {
				variationsChange( imageThumbs, variation, jQuery( this ).parents( '.variations_form' ) );
			} );
		}
	}

	// Make sure correct spacing is created for the absolute positioned product image thumbs.
	if ( jQuery( '.avada-single-product-gallery-wrapper' ).find( '.flex-control-thumbs' ).length ) {
		jQuery( '.avada-single-product-gallery-wrapper' ).css( 'margin-bottom', jQuery( '.avada-single-product-gallery-wrapper' ).find( '.flex-control-thumbs' ).height() + 10 );
	}

	jQuery( '.avada-product-gallery' ).each( function() {
		var thumbsContainer = jQuery( this ).find( '.flex-control-thumbs' ),
			maxHeight       = Math.max.apply( null, thumbsContainer.find( 'li' ).map( function() {
				return jQuery( this ).height();
			} ).get() );

		// Remove the min height setting from the gallery images.
		jQuery( '.woocommerce-product-gallery__image' ).css( 'min-height', '' );
		jQuery( document ).trigger( 'resize' );

		thumbsContainer.animate( { opacity: 1 }, 500 );

		// Make sure the thumbs container has the height of the largest thumb.
		thumbsContainer.wrap( '<div class="avada-product-gallery-thumbs-wrapper"></div>' );
		thumbsContainer.parent().css( 'height', maxHeight );
	} );
} );

function getVariationsValues( variationForm ) {
	var variations = 0,
		chosen     = 0;

	jQuery( variationForm ).find( '.variations' ).find( 'select' ).each( function() {
		var value  = jQuery( this ).val() || '';

		if ( 0 < value.length ) {
			chosen++;
		}

		variations++;
	} );

	return {
		variations: variations,
		chosen: chosen
	};

}

function variationsChange( imageThumbs, variation, variationForm ) {
	var sources = window.sources,
		variationImage,
		variationSelects = getVariationsValues( variationForm ),
		galleryHasImage,
		slideToImage;

	variationImage = ( 'undefined' !== typeof variation && variation.image && variation.image.gallery_thumbnail_src && 1 < variation.image.gallery_thumbnail_src.length ) ? variation.image.gallery_thumbnail_src : sources[ 0 ];

	if ( variationSelects.variations !== variationSelects.chosen ) {
		jQuery( variationForm ).trigger( 'update_variation_values' );
		jQuery( variationForm ).trigger( 'reset_data' );

		variationImage = sources[ 0 ];
	}

	if ( 'undefined' !== typeof variation && variation.image && variation.image.src && 1 < variation.image.src.length && ! variation.is_composited ) {

		// See if the gallery has an image with the same original src as the image we want to switch to.
		galleryHasImage = 0 < imageThumbs.filter( '[data-o_src="' + variation.image.gallery_thumbnail_src + '"]' ).length;

		// If the gallery has the image, reset the images. We'll scroll to the correct one.
		if ( galleryHasImage ) {
			variationsImageReset();
		}

		// See if gallery has a matching image we can slide to.
		slideToImage = -1 < jQuery.inArray( variation.image.gallery_thumbnail_src, sources );

		// If the gallery has the image, reset the images. We'll scroll to the correct one.
		if ( ! slideToImage ) {
			imageThumbs.each( function() {
				var mainImage,
					productImg,
					productLink,
					zoomImage,
					lightboxTrigger;

				if ( ! jQuery( this ).hasClass( 'fusion-main-image-thumb' ) ) {
					jQuery( this ).attr( 'src', sources[ jQuery( this ).data( 'index' ) ] );
				} else {
					mainImage        = jQuery( '.woocommerce-product-gallery .flex-viewport' ).find( '.fusion-main-image' ).length ? jQuery( '.flex-viewport' ).find( '.fusion-main-image' ) : jQuery( '.woocommerce-product-gallery' ).find( '.woocommerce-product-gallery__image' );
					productImg       = mainImage.find( '.wp-post-image' );
					productLink      = mainImage.find( 'a' ).eq( 0 );
					zoomImage        = mainImage.find( '> img' );
					lightboxTrigger  = mainImage.find( '.avada-product-gallery-lightbox-trigger' );

					jQuery( this ).attr( 'src', variationImage );

					jQuery( this ).parent().trigger( 'click' );

					if ( variationSelects.variations === variationSelects.chosen ) {
						productImg.wc_set_variation_attr( 'src', variation.image.src );
						productImg.wc_set_variation_attr( 'height', variation.image.src_h );
						productImg.wc_set_variation_attr( 'width', variation.image.src_w );
						productImg.wc_set_variation_attr( 'srcset', variation.image.srcset );
						productImg.wc_set_variation_attr( 'sizes', variation.image.sizes );
						productImg.wc_set_variation_attr( 'title', variation.image.title );
						productImg.wc_set_variation_attr( 'alt', variation.image.alt );
						productImg.wc_set_variation_attr( 'data-src', variation.image.full_src );
						productImg.wc_set_variation_attr( 'data-large_image', variation.image.full_src );
						productImg.wc_set_variation_attr( 'data-large_image_width', variation.image.full_src_w );
						productImg.wc_set_variation_attr( 'data-large_image_height', variation.image.full_src_h );
						productLink.wc_set_variation_attr( 'href', variation.image.full_src );
						zoomImage.wc_set_variation_attr( 'src', variation.image.full_src );
						lightboxTrigger.wc_set_variation_attr( 'href', variation.image.src );

						if ( 'undefined' !== typeof variation.image.title ) {
							lightboxTrigger.wc_set_variation_attr( 'data-title', variation.image.title );
							lightboxTrigger.data( 'title', variation.image.title );
						}

						if ( 'undefined' !== typeof variation.image.caption ) {
							lightboxTrigger.wc_set_variation_attr( 'data-caption', variation.image.caption );
							lightboxTrigger.data( 'caption', variation.image.caption );
						}

					} else {
						variationsImageReset();
					}
				}
			} );
		}
	}

	// Refresh the lightbox
	window.avadaLightBox.refresh_lightbox();

	setTimeout( function() {
		window.avadaLightBox.refresh_lightbox();
	}, 500 );

	setTimeout( function() {
		window.avadaLightBox.refresh_lightbox();
	}, 1500 );
}

function variationsImageReset() {
	var mainImage        = jQuery( '.flex-viewport' ).find( '.fusion-main-image' ),
		productImg       = mainImage.find( '.wp-post-image' ),
		productLink      = mainImage.find( 'a' ).eq( 0 ),
		zoomImage        = mainImage.find( '> img' ),
		lightboxTrigger  = mainImage.find( '.avada-product-gallery-lightbox-trigger' );

	productImg.wc_reset_variation_attr( 'src' );
	productImg.wc_reset_variation_attr( 'width' );
	productImg.wc_reset_variation_attr( 'height' );
	productImg.wc_reset_variation_attr( 'srcset' );
	productImg.wc_reset_variation_attr( 'sizes' );
	productImg.wc_reset_variation_attr( 'title' );
	productImg.wc_reset_variation_attr( 'alt' );
	productImg.wc_reset_variation_attr( 'data-src' );
	productImg.wc_reset_variation_attr( 'data-large_image' );
	productImg.wc_reset_variation_attr( 'data-large_image_width' );
	productImg.wc_reset_variation_attr( 'data-large_image_height' );
	productLink.wc_reset_variation_attr( 'href' );
	zoomImage.wc_reset_variation_attr( 'src' );
	lightboxTrigger.wc_reset_variation_attr( 'href' );
	lightboxTrigger.wc_reset_variation_attr( 'data-title' );
	lightboxTrigger.wc_reset_variation_attr( 'data-caption' );

	if ( undefined !== lightboxTrigger.attr( 'data-o_data-title' ) ) {
		lightboxTrigger.data( 'title', lightboxTrigger.attr( 'data-o_data-title' ) );
	}

	if ( undefined !== lightboxTrigger.attr( 'data-o_data-caption' ) ) {
		lightboxTrigger.data( 'titcaptionle', lightboxTrigger.attr( 'data-o_data-caption' ) );
	}
}

function initAvadaWoocommerProductGallery() {
	jQuery( '.avada-product-gallery' ).each( function() {
		var imageGallery   = jQuery( this ),
			imageThumbs = ( jQuery( '.flex-control-nav' ).find( 'img' ).length ) ? jQuery( '.flex-control-nav' ).find( 'img' ) : undefined;
		window.sources = [];

		// Initialize the flexslider thumb sources, needed in on load event.
		if ( 'undefined' !== typeof imageThumbs ) {
			imageThumbs.each( function( index ) {
				jQuery( this ).data( 'index', index );
				window.sources.push( jQuery( this ).attr( 'src' ) );
			} );
		} else {
			window.sources.push( jQuery( this ).find( '.flex-viewport .flex-active-slide' ).data( 'thumb' ) );
		}

		// Remove flexslider clones from lightbox.
		jQuery( '.flex-viewport' ).find( '.clone' ).find( '.avada-product-gallery-lightbox-trigger' ).addClass( 'fusion-no-lightbox' ).removeAttr( 'data-rel' );

		// Site the image gallery thumbnails correctly.
		sizeGalleryThumbnails( imageGallery );
		jQuery( window ).resize( function() {
			sizeGalleryThumbnails( imageGallery );
		} );

		imageGallery.on( 'click touchstart', '.flex-control-thumbs li', function() {
			var nextThumb = jQuery( this );

			moveProductImageThumbs( imageGallery, nextThumb, 'next' );
		} );

		imageGallery.find( '.flex-direction-nav li a' ).on( 'click touchstart', function() {
			var nextThumb = jQuery( this ).parents( '.avada-product-gallery' ).find( '.flex-control-thumbs img.flex-active' );

			if ( nextThumb.offset().left + nextThumb.outerWidth() > imageGallery.offset().left + imageGallery.outerWidth() ) {

				if ( jQuery( this ).hasClass( 'flex-next' ) ) {
					moveProductImageThumbs( imageGallery, nextThumb, 'next' );
				} else {
					moveProductImageThumbs( imageGallery, nextThumb, 'prev' );
				}
			}
		} );
	} );
}

function sizeGalleryThumbnails( imageGallery ) {
	var galleryWidth   = imageGallery.width(),
		thumbs         = imageGallery.find( '.flex-control-thumbs li' ),
		thumbColumns   = imageGallery.data( 'columns' ),
		numberOfThumbs = thumbs.length,
		thumbWidth;

	// Set the width of the thumbs.
	thumbWidth = ( galleryWidth - ( ( thumbColumns - 1 ) * 8 ) ) / thumbColumns;
	thumbs.css( 'width', thumbWidth );

	// Set .flex-control-thumbs width.
	imageGallery.find( '.flex-control-thumbs' ).css( 'width', ( ( numberOfThumbs * thumbWidth ) + ( ( numberOfThumbs - 1 ) * 8 ) ) + 'px' );
}

function moveProductImageThumbs( gallery, currentThumb, direction ) {
	var thumbsContainer   = gallery.find( '.flex-control-thumbs' ),
		thumbs            = thumbsContainer.find( 'li' ),
		thumbColumns      = gallery.data( 'columns' ),
		thumbWidth        = thumbsContainer.find( 'li' ).outerWidth(),
		galleryLeft       = gallery.offset().left,
		currentThumbIndex = Math.floor( ( currentThumb.offset().left - galleryLeft ) / thumbWidth ),
		leftOffsets       = [],
		thumbsContainerNewLeft,
		scrollableElements;

	if ( thumbs.length > thumbColumns ) {

		if ( 'next' === direction ) {

			if ( currentThumbIndex < thumbs.length - ( currentThumbIndex + 1 ) ) {

				// If there are enough thumbs, move the clicked thumb to first pos.
				thumbsContainerNewLeft  = currentThumb.position().left * -1;
			} else {

				// If there is less thumbs than needed to scroll into view, just scroll the amount that is there.
				scrollableElements = thumbs.length - thumbColumns;
				thumbsContainerNewLeft = jQuery( thumbs.get( scrollableElements ) ).position().left * -1;
			}

			thumbsContainer.stop( true, true ).animate( {
				left: thumbsContainerNewLeft
			}, { queue: false, duration: 500, easing: 'easeInOutQuad', complete: function() {

				jQuery( this ).find( 'li' ).each( function() {
					leftOffsets.push( jQuery( this ).offset().left );
				} );

				jQuery( this ).find( 'li' ).each( function( index ) {
					if ( leftOffsets[ index ] < galleryLeft ) {
						jQuery( this ).appendTo( thumbsContainer );
					}
				} );

				jQuery( this ).css( 'left', '0' );
			} } );

		} else {
			thumbsContainerNewLeft  = ( thumbWidth + 8 ) * -1;

			currentThumb.parent().prependTo( thumbsContainer );
			thumbsContainer.css( 'left', thumbsContainerNewLeft );

			thumbsContainer.stop( true, true ).animate( {
				left: 0
			}, { queue: false, duration: 500, easing: 'easeInOutQuad' } );
		}
	}
}

jQuery( document ).ready( function() {
	var link;

	// Remove the Woo native magnifying glass svg.
	setTimeout( function() {
		jQuery( '.woocommerce-product-gallery__trigger' ).empty();
	}, 10 );

	if ( jQuery( '.avada-product-gallery' ).length ) {
		jQuery( 'body' ).on( 'click', '.woocommerce-product-gallery__image .zoomImg', function() {

			if ( 'ontouchstart' in document.documentElement || navigator.msMaxTouchPoints ) {
				link = jQuery( this ).siblings( '.avada-product-gallery-lightbox-trigger' );

				if ( link.hasClass( 'hover' ) ) {
					link.removeClass( 'hover' );
					link.trigger( 'click' );
					return false;
				}
				jQuery( '.woocommerce-product-gallery__image' ).find( '.avada-product-gallery-lightbox-trigger' ).removeClass( 'hover' );
				link.addClass( 'hover' );
				return true;

			}
			jQuery( this ).siblings( '.avada-product-gallery-lightbox-trigger' ).trigger( 'click' );

		} );

		jQuery( 'body' ).on( 'click', function( e ) {
			if ( ! jQuery( e.target ).hasClass( 'woocommerce-product-gallery__image' ) ) {
				jQuery( '.avada-product-gallery-lightbox-trigger' ).removeClass( 'hover' );
			}
		} );
	}

	initAvadaWoocommerProductGallery();
} );

jQuery( document ).ready( function() {
	var shippingStateField = jQuery( '#calc_shipping_country' ).parents( '.avada-shipping-calculator-form' ).find( '#calc_shipping_state_field' );

	if ( shippingStateField.length ) {
		if ( 'hidden' === shippingStateField.find( '#calc_shipping_state' ).attr( 'type' ) ) {
			shippingStateField.hide();
		} else {
			shippingStateField.show();
		}
	}
} );

// Reintalize scripts after ajax
jQuery( document ).ajaxComplete( function() {
	jQuery( '.fusion-update-cart' ).unbind( 'click' );
	jQuery( '.fusion-update-cart' ).on( 'click', function( e ) {
		e.preventDefault();
		jQuery( '.cart .actions > .button' ).trigger( 'click' );
	} );

	// Make sure cross faded images height is correct.
	setTimeout( function() {
		jQuery( '.crossfade-images' ).each(
			function() {
				fusionResizeCrossfadeImagesContainer( jQuery( this ) );
				fusionResizeCrossfadeImages( jQuery( this ) );
			}
		);
	}, 1000 );
} );


jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-woo-slider' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.parents( '.fusion-tabs' ).css( 'height', '' );
	}

	$reInitElems = jQuery( parent ).find( '.crossfade-images' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			fusionResizeCrossfadeImagesContainer( jQuery( this ) );
			fusionResizeCrossfadeImages( jQuery( this ) );
		} );
	}
} );
