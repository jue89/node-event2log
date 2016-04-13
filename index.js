'use strict';

function event2log( events, eventSrc, logDest ) {

	let listeners = {};

	for( let e in events ) {

		// Skip all events without event translation function
		if( typeof events[ e ] !== 'function' ) continue;

		// Create event listener
		listeners[e] = function() {

			// Evaluate translation function
			let ret = events[e].apply( eventSrc, arguments );

			// If we haven't received an array we don't know what to do
			if( ! ( ret instanceof Array ) ) throw new Error( "Unexpected return of event translation method " + e );

			// First array item is the log function to be called
			let logDestFunc = ret.shift();

			// Call the log function. The other array items are its arguments.
			logDest[ logDestFunc ].apply( logDest, ret );

		};

		// Install event listener
		eventSrc.on( e, listeners[e] );

	}

	return function() {

		// Remote all event listeners
		for( let l in listeners ) {
			eventSrc.removeListener( l, listeners[l] );
		}

	};

}

module.exports = event2log;
