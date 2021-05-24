/* global patcherVars */
jQuery( document ).ready( function() {

	_.each( patcherVars.args, function( args ) {

		var topMenuElement,
			subMenuElement,
			noticeContent;

		// Only process if the number of available patches is > 0.
		if ( 'undefined' !== typeof patcherVars.patches[ args.context ] && 0 < patcherVars.patches[ args.context ] && 'none' !== patcherVars.display_counter ) {
			topMenuElement = jQuery( '#adminmenu .toplevel_page_' + args.parent_slug + ' .wp-menu-name' );
			subMenuElement = jQuery( '#adminmenu .toplevel_page_' + args.parent_slug + ' ul.wp-submenu li a[href="admin.php?page=' + args.context + '-fusion-patcher"]' );

			noticeContent = '<span class="update-plugins count-' + patcherVars.patches[ args.context ] + '" style="margin-left:5px;"><span class="plugin-count">' + patcherVars.patches[ args.context ] + '</span></span>';

			if ( 'sub_level' !== patcherVars.display_counter ) {
				jQuery( noticeContent ).appendTo( topMenuElement );
			}

			if ( 'top_level' !== patcherVars.display_counter ) {
				jQuery( noticeContent ).appendTo( subMenuElement );
			}
		}
	} );
} );
