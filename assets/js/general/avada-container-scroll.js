jQuery.fn.limitScrollToContainer = function() {
	var touchScrollAmount = 0;

	jQuery( this ).bind( 'mousewheel DOMMouseScroll touchmove', function( e ) {
		var delta    = e.wheelDelta || ( e.originalEvent && e.originalEvent.wheelDelta ) || -e.detail,
			scrollTo = null;

		if ( 'mousewheel' === e.type ) {
			scrollTo = -0.5 * delta;
		} else if ( 'DOMMouseScroll' === e.type ) {
			scrollTo = -40 * delta;
		} else if ( 'touchmove' === e.type ) {
			scrollTo = 10;
			if ( e.originalEvent.touches[ 0 ].pageY > touchScrollAmount ) {
				scrollTo = -10;
			}
			touchScrollAmount = e.originalEvent.touches[ 0 ].pageY;
		}

		if ( scrollTo ) {
			e.preventDefault();
			jQuery( this ).scrollTop( scrollTo + jQuery( this ).scrollTop() );
		}
	} );
};
