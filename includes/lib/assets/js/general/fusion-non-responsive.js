jQuery( window ).on( 'load', function() { // Start window_load_1

	var columnClasses,
		i;

	// Static layout
	columnClasses = [ 'col-sm-0', 'col-sm-1', 'col-sm-2', 'col-sm-3', 'col-sm-4', 'col-sm-5', 'col-sm-6', 'col-sm-7', 'col-sm-8', 'col-sm-9', 'col-sm-10', 'col-sm-11', 'col-sm-12' ];
	jQuery( '.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12' ).each( function() {
		for ( i = 0; i < columnClasses.length; i++ ) {
			if ( -1 !== jQuery( this ).attr( 'class' ).indexOf( columnClasses[ i ] ) ) {
				jQuery( this ).addClass( 'col-xs-' + i );
			}
		}
	} );
} );
