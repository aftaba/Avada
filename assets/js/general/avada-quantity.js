/**
 * Avada Quantity buttons add-back.
 *
 * @param {string} $quantitySelector - The selector for the quantity element.
 * @return {void}
 */
function avadaAddQuantityBoxes( $quantitySelector ) {

	var $quantityBoxes,
		buttonsAdded = false;

	if ( ! $quantitySelector ) {
		$quantitySelector = '.qty';
	}

	$quantityBoxes = jQuery( 'div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)' ).find( $quantitySelector );

	if ( $quantityBoxes.length ) {
		jQuery.each( $quantityBoxes, function( index, quantityBox ) {

			if ( 'date' !== jQuery( quantityBox ).prop( 'type' ) && 'hidden' !== jQuery( quantityBox ).prop( 'type' ) && ! jQuery( quantityBox ).parent().parent().hasClass( 'tribe-block__tickets__item__quantity__number' ) ) {

				// Add plus and minus boxes
				if ( ! jQuery( quantityBox ).parent().hasClass( 'buttons_added' ) ) {
					jQuery( quantityBox ).parent().addClass( 'buttons_added' ).prepend( '<input type="button" value="-" class="minus" />' );
					jQuery( quantityBox ).addClass( 'input-text' ).after( '<input type="button" value="+" class="plus" />' );

					buttonsAdded = true;
				}
			}
		} );

		if ( buttonsAdded ) {

			// Target quantity inputs on product pages
			jQuery( 'input' + $quantitySelector + ':not(.product-quantity input' + $quantitySelector + ')' ).each( function() {
				var $min = parseFloat( jQuery( this ).attr( 'min' ) );

				if ( $min && 0 < $min && parseFloat( jQuery( this ).val() ) < $min ) {
					jQuery( this ).val( $min );
				}
			} );

			jQuery( '.plus, .minus' ).unbind( 'click' );

			jQuery( '.plus, .minus' ).on( 'click', function() {

				// Get values
				var $quantityBox = jQuery( this ).parent().find( $quantitySelector ),
					$currentQuantity = parseFloat( $quantityBox.val() ),
					$maxQuantity = parseFloat( $quantityBox.attr( 'max' ) ),
					$minQuantity = parseFloat( $quantityBox.attr( 'min' ) ),
					$step = $quantityBox.attr( 'step' );

				// Fallback default values
				if ( ! $currentQuantity || '' === $currentQuantity || 'NaN' === $currentQuantity ) {
					$currentQuantity = 0;
				}
				if ( '' === $maxQuantity || 'NaN' === $maxQuantity ) {
					$maxQuantity = '';
				}

				if ( '' === $minQuantity || 'NaN' === $minQuantity ) {
					$minQuantity = 0;
				}
				if ( 'any' === $step || '' === $step || undefined === $step || 'NaN' === parseFloat( $step ) ) {
					$step = 1;
				}

				// Change the value
				if ( jQuery( this ).is( '.plus' ) ) {

					if ( $maxQuantity && ( $maxQuantity == $currentQuantity || $currentQuantity > $maxQuantity ) ) {
						$quantityBox.val( $maxQuantity );
					} else {
						$quantityBox.val( $currentQuantity + parseFloat( $step ) );
					}

				} else if ( $minQuantity && ( $minQuantity == $currentQuantity || $currentQuantity < $minQuantity ) ) {
					$quantityBox.val( $minQuantity );
				} else if ( 0 < $currentQuantity ) {
					$quantityBox.val( $currentQuantity - parseFloat( $step ) );
				}

				// Trigger change event
				$quantityBox.trigger( 'change' );
			} );
		}
	}

}
jQuery( window ).on( 'load', function() {
	avadaAddQuantityBoxes();
} );
jQuery( document ).ajaxComplete( function() {
	avadaAddQuantityBoxes();
} );

function compositeAddQuantityBoxes() {
	avadaAddQuantityBoxes();
}

// Fix YITH mini cart quantity boxes.
jQuery( document ).ready( function() {
	jQuery( '.yith-wacp-mini-cart-icon' ).on( 'click', function() {
		setTimeout( function() {
			avadaAddQuantityBoxes();
		}, 100 );
	} );
} );

if ( jQuery( '.composite_data' ).length ) {
	jQuery( '.composite_data' ).on( 'wc-composite-initializing', function( event, composite ) {
		composite.actions.add_action( 'component_selection_details_animated', compositeAddQuantityBoxes, 10 );
	} );
}
