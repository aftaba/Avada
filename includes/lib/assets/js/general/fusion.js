/* eslint getter-return: off */
/* jshint -W098 */
/**
 * A collection of utilities.
 *
 * @since 2.0
 */
var fusion = {

	fusionResizeWidth: 0,
	fusionResizeHeight: 0,

	/**
	 * Converts a value to bool.
	 * Used to accomodate all cases in the fusion options-network.
	 *
	 * @since 2.0
	 * @param {string|number|boolean} val - The value.
	 * @return {boolean} - The value as bool.
	 */
	toBool: function( val ) {
		return ( 1 === val || '1' === val || true === val || 'true' === val || 'on' === val );
	},

	// Some functions take a variable number of arguments, or a few expected
	// arguments at the beginning and then a variable number of values to operate
	// on. This helper accumulates all remaining arguments past the function’s
	// argument length (or an explicit `startIndex`), into an array that becomes
	// the last argument. Similar to ES6’s "rest parameter".
	restArguments: function( func, startIndex ) {
		startIndex = null == startIndex ? func.length - 1 : +startIndex;
		return function() {
			var length = Math.max( arguments.length - startIndex, 0 ),
				rest = Array( length ),
				index = 0,
				args;
			for ( ; index < length; index++ ) {
				rest[ index ] = arguments[ index + startIndex ];
			}
			switch ( startIndex ) {
			case 0: return func.call( this, rest );
			case 1: return func.call( this, arguments[ 0 ], rest );
			case 2: return func.call( this, arguments[ 0 ], arguments[ 1 ], rest );
			}
			args = Array( startIndex + 1 );
			for ( index = 0; index < startIndex; index++ ) {
				args[ index ] = arguments[ index ];
			}
			args[ startIndex ] = rest;
			return func.apply( this, args );
		};
	},

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	debounce: function( func, wait, immediate ) {
		var timeout,
			result,
			self = this,
			later,
			debounced,
			callNow;

		later = function( context, args ) {
			timeout = null;
			if ( args ) {
				result = func.apply( context, args );
			}
		};

		debounced = this.restArguments( function( args ) {
			if ( timeout ) {
				clearTimeout( timeout );
			}

			if ( immediate ) {
				callNow = ! timeout;
				timeout = setTimeout( later, wait );
				if ( callNow ) {
					result = func.apply( this, args );
				}
			} else {
				timeout = self.delay( later, wait, this, args );
			}

			return result;
		} );

		debounced.cancel = function() {
			clearTimeout( timeout );
			timeout = null;
		};

		return debounced;
	}
};

fusion.delay = fusion.restArguments( function( func, wait, args ) {
	return setTimeout( function() {
		return func.apply( null, args );
	}, wait );
} );

fusion.ready = function( fn ) {

	// Sanity check.
	if ( 'function' !== typeof fn ) {
		return;
	}

	// If document is already loaded, run method.
	if ( 'complete' === document.readyState ) {
		return fn();
	}

	// Otherwise, wait until document is loaded
	document.addEventListener( 'DOMContentLoaded', fn, false );
};

/**
 * Set the global fusionResponsiveTypographyPassiveSupported.
 *
 * @since 2.2.0
 * @return {void}
 */
fusion.passiveSupported = function() {
	var passiveSupported, options;

	if ( 'undefined' === typeof fusion.supportsPassive ) {
		try {
			options = {
				get passive() {
					passiveSupported = true;
				}
			};

			window.addEventListener( 'test', options, options );
			window.removeEventListener( 'test', options, options );
		} catch ( err ) {
			passiveSupported = false;
		}
		fusion.supportsPassive = passiveSupported ? { passive: true } : false;
	}
	return fusion.supportsPassive;
};

/**
 * Get an array of elements.
 *
 * @param {string|object} elements - The elements we're querying.
 * @return {Array}
 */
fusion.getElements = function( elements ) {
	var els = [];

	// Sanity check: If nothing is defined early exit.
	if ( ! elements ) {
		return [];
	}

	if ( 'object' === typeof elements ) {
		Object.keys( elements ).forEach( function( i ) {
			if ( Element.prototype.isPrototypeOf( elements[ i ] ) ) {
				els.push( elements[ i ] );
			}
		} );
	} else if ( 'string' === typeof elements ) {
		// Get the elements array.
		els = document.querySelectorAll( elements );

		// We're using Array.prototype.slice because we'll need to run forEach later
		// and NodeList.forEach is not supported in IE.
		els = Array.prototype.slice.call( els );
	}
	return els;
};

/**
 * Add polyfill for Element.closest() method.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 */
if ( ! Element.prototype.matches ) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if ( ! Element.prototype.closest ) {
	Element.prototype.closest = function( s ) {
		var el = this;
		do {
			if ( el.matches( s ) ) {
				return el;
			}
			el = el.parentElement || el.parentNode;
		} while ( null !== el && 1 === el.nodeType );
		return null;
	};
}

jQuery( document ).ready( function() {
	var	_fusionResize = fusion.debounce( function() {
		if ( fusion.fusionResizeWidth !== jQuery( window ).width() ) {
			window.dispatchEvent( new Event( 'fusion-resize-horizontal', { 'bubbles': true, 'cancelable': true } ) );
			fusion.fusionResizeWidth = jQuery( window ).width();
		}

		if ( fusion.fusionResizeHeight !== jQuery( window ).height() ) {
			jQuery( window ).trigger( 'fusion-resize-vertical' );
			fusion.fusionResizeHeight = jQuery( window ).height();
		}
	}, 250 );

	fusion.fusionResizeWidth  = jQuery( window ).width();
	fusion.fusionResizeHeight = jQuery( window ).height();

	jQuery( window ).on( 'resize', _fusionResize );
} );
