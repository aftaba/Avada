/* global fusionVideoGeneralVars, YT, Vimeo, fusionGetConsent */
/* eslint no-unused-vars: 0*/
/* eslint max-depth: 0*/
var fusionTimeout = [];
var prevCallback = window.onYouTubePlayerAPIReady;
function insertParam( url, parameterName, parameterValue, atStart ) {

	var replaceDuplicates = true,
		cl,
		urlhash,
		sourceUrl,
		urlParts,
		newQueryString,
		parameters,
		i,
		parameterParts;

	if ( 0 < url.indexOf( '#' ) ) {
		cl      = url.indexOf( '#' );
		urlhash = url.substring( url.indexOf( '#' ), url.length );
	} else {
		urlhash = '';
		cl      = url.length;
	}
	sourceUrl = url.substring( 0, cl );

	urlParts = sourceUrl.split( '?' );
	newQueryString = '';

	if ( 1 < urlParts.length ) {
		parameters = urlParts[ 1 ].split( '&' );
		for ( i = 0; ( i < parameters.length ); i++ ) {
			parameterParts = parameters[ i ].split( '=' );
			if ( ! ( replaceDuplicates && parameterParts[ 0 ] === parameterName ) ) {
				if ( '' === newQueryString ) {
					newQueryString = '?' + parameterParts[ 0 ] + '=' + ( parameterParts[ 1 ] ? parameterParts[ 1 ] : '' );
				} else {
					newQueryString += '&';
					newQueryString += parameterParts[ 0 ] + '=' + ( parameterParts[ 1 ] ? parameterParts[ 1 ] : '' );
				}
			}
		}
	}
	if ( '' === newQueryString ) {
		newQueryString = '?';
	}

	if ( atStart ) {
		newQueryString = '?' + parameterName + '=' + parameterValue + ( 1 < newQueryString.length ? '&' + newQueryString.substring( 1 ) : '' );
	} else {
		if ( '' !== newQueryString && '?' !== newQueryString ) {
			newQueryString += '&';
		}
		newQueryString += parameterName + '=' + ( parameterValue ? parameterValue : '' );
	}
	return urlParts[ 0 ] + newQueryString + urlhash;
}

// Define YTReady function.
window.YTReady = ( function() {
	var onReadyFuncs = [],
		apiIsReady   = false;

	/* @param func function	 Function to execute on ready
	 * @param func Boolean	  If true, all qeued functions are executed
	 * @param bBefore Boolean  If true, the func will added to the first
	 position in the queue*/
	return function( func, bBefore ) {
		if ( true === func ) {
			apiIsReady = true;
			while ( onReadyFuncs.length ) {

				// Removes the first func from the array, and execute func
				onReadyFuncs.shift()();
			}
		} else if ( 'function' === typeof func ) {
			if ( apiIsReady ) {
				func();
			} else {
				onReadyFuncs[ bBefore ? 'unshift' : 'push' ]( func );
			}
		}
	};
}() );

function registerYoutubePlayers( forced ) {
	if ( Number( fusionVideoGeneralVars.status_yt ) && true === window.yt_vid_exists ) {
		window.$youtube_players = [];

		jQuery( '.tfs-slider' ).each( function() {
			var $slider = jQuery( this ),
				length  = $slider.find( '[data-youtube-video-id]' ).find( 'iframe' ).length,
				slider  = false;

			$slider.find( '[data-youtube-video-id]' ).find( 'iframe' ).each( function( index ) {
				var $iframe = jQuery( this );

				if ( length === ( index + 1 ) && 'undefined' !== typeof forced ) {
					slider = $slider.data( 'flexslider' );
				}
				window.YTReady( function() {
					window.$youtube_players[ $iframe.attr( 'id' ) ] = new YT.Player( $iframe.attr( 'id' ), {
						events: {
							onReady: onPlayerReady( $iframe.parents( 'li' ), slider ),
							onStateChange: onPlayerStateChange( $iframe.attr( 'id' ), $slider )
						}
					} );
				} );
			} );
		} );
	}
}

// Load the YouTube iFrame API
function loadYoutubeIframeAPI() {

	var tag,
		firstScriptTag;

	if ( Number( fusionVideoGeneralVars.status_yt ) && ( true === window.yt_vid_exists || jQuery( 'body' ).hasClass( 'fusion-builder-live' ) ) ) {
		tag = document.createElement( 'script' );
		tag.src = 'https://www.youtube.com/iframe_api';
		firstScriptTag = document.getElementsByTagName( 'script' )[ 0 ];
		firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
	}
}

// This function will be called when the API is fully loaded
function onYouTubePlayerAPIReadyCallback() {
	window.YTReady( true );
}

if ( prevCallback ) {
	window.onYouTubePlayerAPIReady = function() {
		prevCallback();
		onYouTubePlayerAPIReadyCallback();
	};
} else {
	window.onYouTubePlayerAPIReady = onYouTubePlayerAPIReadyCallback;
}

function onPlayerStateChange( $frame, $slider ) {
	return function( $event ) {
		if ( $event.data == YT.PlayerState.PLAYING ) {
			jQuery( $slider ).flexslider( 'pause' );
		}

		if ( $event.data == YT.PlayerState.PAUSED ) {
			jQuery( $slider ).flexslider( 'play' );
		}

		if ( $event.data == YT.PlayerState.BUFFERING ) {
			jQuery( $slider ).flexslider( 'pause' );
		}

		if ( $event.data == YT.PlayerState.ENDED ) {
			if ( '1' == jQuery( $slider ).data( 'autoplay' ) ) {
				if ( 'undefined' !== typeof jQuery( $slider ).find( '.flex-active-slide' ).data( 'loop' ) && 'yes' !== jQuery( $slider ).find( '.flex-active-slide' ).data( 'loop' ) ) {
					jQuery( $slider ).flexslider( 'next' );
				}

				jQuery( $slider ).flexslider( 'play' );
			}
		}
	};
}

function onPlayerReady( $slide, slider ) {

	return function( $event ) {
		if ( 'yes' === jQuery( $slide ).data( 'mute' ) ) {
			$event.target.mute();
		}
		if ( slider ) {
			setTimeout( function() {
				playVideoAndPauseOthers( slider );
			}, 300 );
		}
	};
}

function ytVidId( url ) {
	var p = /^(?:https?:)?(\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	return ( url.match( p ) ) ? RegExp.$1 : false;
}

function playVideoAndPauseOthers( slider ) {

	// Play the youtube video inside the current slide
	var $currentSliderIframes = jQuery( slider ).find( '[data-youtube-video-id]' ).find( 'iframe' ),
		$currentSlide         = jQuery( slider ).data( 'flexslider' ).slides.eq( jQuery( slider ).data( 'flexslider' ).currentSlide ),
		$currentSlideIframe   = $currentSlide.find( '[data-youtube-video-id]' ).find( 'iframe' );

	// Stop all youtube videos.
	$currentSliderIframes.each( function() {

		// Don't stop current video, but all others
		if ( jQuery( this ).attr( 'id' ) !== $currentSlideIframe.attr( 'id' ) && 'undefined' !== typeof window.$youtube_players && 'undefined' !== typeof window.$youtube_players[ jQuery( this ).attr( 'id' ) ] ) {
			window.$youtube_players[ jQuery( this ).attr( 'id' ) ].stopVideo(); // Stop instead of pause for preview images
		}
	} );

	if ( $currentSlideIframe.length && ( 'function' !== typeof fusionGetConsent || fusionGetConsent( 'youtube' ) ) && 'undefined' !== typeof window.$youtube_players ) {

		// Play only if autoplay is setup.
		if ( ! $currentSlideIframe.parents( 'li' ).hasClass( 'clone' ) && $currentSlideIframe.parents( 'li' ).hasClass( 'flex-active-slide' ) && 'yes' === $currentSlideIframe.parents( 'li' ).attr( 'data-autoplay' ) ) {
			if ( 'undefined' === typeof window.$youtube_players || 'undefined' === typeof window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ] || 'undefined' === typeof window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].playVideo ) {
				fusionYouTubeTimeout( $currentSlideIframe.attr( 'id' ) );
			} else if ( 'slide' === jQuery( slider ).data( 'animation' ) && 0 === slider.currentSlide && undefined === jQuery( slider ).data( 'iteration' ) ) {
				if ( window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ] ) {
					setTimeout( function() {
						window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].playVideo();
						jQuery( slider ).data( 'iteration', 1 );

						// Stop slider so that it does not move to next slide.
						slider.stop();

						// Play Slider again when video in finished.
						setTimeout( function() {
							slider.play();
						}, ( window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].getDuration() * 1000 ) - 6000 );
					}, 2000 );
				}
			} else {
				window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].playVideo();
			}
		}

		if ( 'yes' === $currentSlide.attr( 'data-mute' ) && 'undefined' !== typeof window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ] && 'undefined' !== typeof window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].mute ) {
			window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].mute();
		}
	}

	// Vimeo videos.
	if ( Number( fusionVideoGeneralVars.status_vimeo ) && ( 'function' !== typeof fusionGetConsent || fusionGetConsent( 'vimeo' ) ) ) {
		setTimeout(
			function() {
				jQuery( slider ).find( '[data-vimeo-video-id] > iframe' ).each( function() {
					new Vimeo.Player( jQuery( this )[ 0 ] ).pause();
				} );

				if ( 0 !== slider.slides.eq( slider.currentSlide ).find( '[data-vimeo-video-id] > iframe' ).length ) {
					if ( 'yes' === jQuery( slider.slides.eq( slider.currentSlide ) ).data( 'autoplay' ) ) {
						new Vimeo.Player( slider.slides.eq( slider.currentSlide ).find( 'iframe' )[ 0 ] ).play();
					}
					if ( 'yes' === jQuery( slider.slides.eq( slider.currentSlide ) ).data( 'mute' ) ) {
						new Vimeo.Player( slider.slides.eq( slider.currentSlide ).find( 'iframe' )[ 0 ] ).setVolume( 0 );
					}
				}
			}, 300 );
	}

	// Self hosted videos.
	jQuery( slider ).find( 'video' ).each( function() {
		if ( 'function' === typeof jQuery( this )[ 0 ].pause ) {
			jQuery( this )[ 0 ].pause();
		}
		if ( ! jQuery( this ).parents( 'li' ).hasClass( 'clone' ) && jQuery( this ).parents( 'li' ).hasClass( 'flex-active-slide' ) && 'yes' === jQuery( this ).parents( 'li' ).attr( 'data-autoplay' ) ) {
			if ( 'function' === typeof jQuery( this )[ 0 ].play ) {
				jQuery( this )[ 0 ].play();
			}
		}
	} );
}

function fusionYouTubeTimeout( sliderID ) {

	if ( 'undefined' === typeof fusionTimeout[ sliderID ] ) {
		fusionTimeout[ sliderID ] = 0;
	}

	setTimeout( function() {
		if ( 'undefined' !== typeof window.$youtube_players && 'undefined' !== typeof window.$youtube_players[ sliderID ] && 'undefined' !== typeof window.$youtube_players[ sliderID ].playVideo ) {
			window.$youtube_players[ sliderID ].playVideo();
		} else if ( 5 > ++fusionTimeout[ sliderID ] ) {
			fusionYouTubeTimeout( sliderID );
		}
	}, 325 );
}

jQuery( document ).ready( function() {

	var iframes;

	jQuery( '.fusion-fullwidth.video-background' ).each( function() {
		if ( jQuery( this ).find( '[data-youtube-video-id]' ) ) {
			window.yt_vid_exists = true;
		}
	} );

	iframes = jQuery( 'iframe' );
	jQuery.each( iframes, function( i, v ) {
		var src     = jQuery( this ).attr( 'src' ),
			datasrc = jQuery( this ).data( 'privacy-src' ),
			newSrc,
			newSrc2,
			realsrc = ! src && datasrc ? datasrc : src;

		if ( realsrc ) {
			if ( Number( fusionVideoGeneralVars.status_vimeo ) && 1 <= realsrc.indexOf( 'vimeo' ) ) {
				jQuery( this ).attr( 'id', 'player_' + ( i + 1 ) );
			}

			if ( Number( fusionVideoGeneralVars.status_yt ) && ytVidId( realsrc ) ) {
				jQuery( this ).attr( 'id', 'player_' + ( i + 1 ) );

				newSrc  = insertParam( realsrc, 'enablejsapi', '1', false );
				newSrc2 = insertParam( newSrc, 'wmode', 'opaque', false );

				if ( src ) {
					jQuery( this ).attr( 'src', newSrc2 );
				} else if ( datasrc ) {
					jQuery( this ).attr( 'data-privacy-src', newSrc2 );
				}

				window.yt_vid_exists = true;
			}
		}
	} );

	if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live' ) ) {
		jQuery( '.full-video, .video-shortcode, .wooslider .slide-content, .fusion-portfolio-carousel .fusion-video' ).not( '#bbpress-forums .full-video, #bbpress-forums .video-shortcode, #bbpress-forums .wooslider .slide-content, #bbpress-forums .fusion-portfolio-carousel .fusion-video' ).fitVids();
		jQuery( '#bbpress-forums' ).fitVids();
	} else {
		setTimeout( function() {
			jQuery( '.full-video, .video-shortcode, .wooslider .slide-content, .fusion-portfolio-carousel .fusion-video' ).not( '#bbpress-forums .full-video, #bbpress-forums .video-shortcode, #bbpress-forums .wooslider .slide-content, #bbpress-forums .fusion-portfolio-carousel .fusion-video' ).fitVids();
			jQuery( '#bbpress-forums' ).fitVids();
		}, 350 );
	}

	if ( 'function' !== typeof fusionGetConsent || fusionGetConsent( 'youtube' ) ) {
		registerYoutubePlayers();
		loadYoutubeIframeAPI();
	}
} );
