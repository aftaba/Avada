/* global getWaypointTopOffset */
/* eslint no-unused-vars: 0*/

// Get WP admin bar height
function getAdminbarHeight() {
	var $adminbarHeight = 0;

	if ( jQuery( '#wpadminbar' ).length ) {
		$adminbarHeight = parseInt( jQuery( '#wpadminbar' ).outerHeight(), 10 );
	}

	return $adminbarHeight;
}

function getWaypointOffset( $object ) { // jshint ignore:line
	var $offset = $object.data( 'animationoffset' ),
		$adminbarHeight,
		$stickyHeaderHeight;

	if ( undefined === $offset ) {
		$offset = 'bottom-in-view';
	}

	if ( 'top-out-of-view' === $offset ) {
		$adminbarHeight     = getAdminbarHeight();
		$stickyHeaderHeight = ( 'function' === getWaypointTopOffset ) ? getWaypointTopOffset() : 0;

		$offset = $adminbarHeight + $stickyHeaderHeight;
	}

	return $offset;
}
jQuery( window ).on( 'load', function() {

	// Initialize Waypoint
	setTimeout( function() {
		if ( 'function' === typeof jQuery.waypoints ) {
			jQuery.waypoints( 'viewportHeight' );
		}
	}, 300 );
} );
