/* global avadaLiveSearchVars */

var avadaLiveSearch = function() {
	var cachedSearchResults = [];

	if ( ! avadaLiveSearchVars.live_search ) {
		return;
	}

	jQuery( '.fusion-live-search-input' ).each( function() {
		var typingTimer,
			doneTypingInterval = 500,
			searchInput        = jQuery( this ),
			searchWrapper      = searchInput.closest( '.fusion-live-search' ),
			searchButton       = searchWrapper.find( '.fusion-search-button' ),
			searchSubmit       = searchWrapper.find( '.fusion-search-submit' ),
			searchResults      = searchWrapper.find( '.fusion-search-results' ),
			searchPostType     = searchWrapper.find( 'input[name="post_type[]"]' ),
			searchLimiPostTitles = searchWrapper.find( 'input[name="search_limit_to_post_titles"]' );

		searchSubmit.attr( 'data-color', searchSubmit.css( 'color' ) );

		// Make sure the results are faded in/out as they should.
		searchInput.on( 'focusin', function() {
			if ( avadaLiveSearchVars.min_char_count <= jQuery( this ).val().length && searchResults.children( '.fusion-search-result' ).length ) {
				searchResults.addClass( 'suggestions-added' );
			}
		} );

		searchInput.on( 'focusout', function() {
			if ( ! searchResults.is( ':hover' ) && ! searchButton.is( ':hover' ) ) {
				searchResults.removeClass( 'suggestions-added' );
			}
		} );

		jQuery( searchButton, searchResults ).on( 'mouseleave', function() {
			if ( ! searchInput.is( ':focus' ) ) {
				searchResults.removeClass( 'suggestions-added' );
			}
		} );

		// On keyup we start the countdown and invoke the actual search when needed.
		searchInput.on( 'keyup', function() {
			clearTimeout( typingTimer );
			typingTimer = setTimeout( doLiveSearch, doneTypingInterval );
		} );

		// On keydown we clear the typing countdown.
		searchInput.on( 'keydown', function() {
			clearTimeout( typingTimer );
		} );

		function showSearchResults( resultSuggestions ) {
			var suggestionHTML = '';

			searchResults.html( '' );
			searchResults.removeClass( 'suggestions-empty' );
			searchResults.addClass( 'suggestions-added' );

			if ( ! jQuery.isEmptyObject( resultSuggestions ) ) {
				jQuery.each( resultSuggestions, function( index, suggestion ) {
					suggestionHTML = '';

					suggestionHTML += '<a class="fusion-search-result" href="' + suggestion.post_url + '" title="' + suggestion.title + '">';
					if ( suggestion.image_url ) {
						suggestionHTML += '<div class="fusion-search-image"><img class="fusion-search-image-tag" src="' + suggestion.image_url + '" alt="Post Thumb' + suggestion.id + '"/></div>';
					}
					suggestionHTML += '<div class="fusion-search-content">';
					suggestionHTML += '<div class="fusion-search-post-title">' + suggestion.title + '</div>';
					if ( suggestion.type ) {
						suggestionHTML += '<div class="fusion-search-post-type">' + suggestion.type + '</div>';
					}
					suggestionHTML += '</div>';
					suggestionHTML += '</a>';

					searchResults.append( suggestionHTML );
				} );
			} else {
				searchResults.addClass( 'suggestions-empty' );
				suggestionHTML += '<div class="fusion-search-result">' + avadaLiveSearchVars.no_search_results + '</div>';
				searchResults.append( suggestionHTML );
			}
		}

		// Do the live search when user stopped typing.
		function doLiveSearch() {
			var searchString, getPostValues;

			searchWrapper = searchInput.closest( '.fusion-live-search' );
			searchString  = searchInput.val();

			getPostValues = function() {
				var postTypes = [];
				searchPostType.each( function () {
					postTypes.push( this.value );
				} );
				return postTypes;
			};

			searchString += getPostValues().toString();

			if ( avadaLiveSearchVars.min_char_count <= searchString.length ) {

				// If there already is a cached version, use it.
				if ( 'undefined' !== typeof cachedSearchResults[ searchString ] ) {
					showSearchResults( cachedSearchResults[ searchString ] );
					return;
				}

				searchWrapper.find( '.fusion-slider-loading' ).show();
				searchWrapper.find( '.fusion-search-submit' ).css( 'color', 'transparent' );
				searchSubmit.css( 'color', 'transparent' );

				jQuery.ajax( {
					url: avadaLiveSearchVars.ajaxurl,
					type: 'post',
					data: {
						action: 'live_search_retrieve_posts',
						search: searchInput.val(),
						perPage: avadaLiveSearchVars.per_page,
						show_feat_img: avadaLiveSearchVars.show_feat_img,
						display_post_type: avadaLiveSearchVars.display_post_type,
						post_type: getPostValues(),
						searchLimiPostTitles: searchLimiPostTitles.val()
					},
					success: function( resultSuggestions ) {
						cachedSearchResults[ searchString ]  = resultSuggestions;
						showSearchResults( resultSuggestions );

						searchWrapper.find( '.fusion-slider-loading' ).hide();
						searchSubmit.css( 'color', searchSubmit.attr( 'data-color' ) );
					}
				} );
			} else {
				searchWrapper.find( '.fusion-slider-loading' ).hide();
				searchSubmit.css( 'color', searchSubmit.attr( 'data-color' ) );
				searchResults.removeClass( 'suggestions-added' );
			}
		}
	} );
};
jQuery( document ).ready( function() {
	avadaLiveSearch();
} );
