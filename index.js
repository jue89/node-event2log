'use strict';

const events = require( 'events' );
const log = require( './lib/log.js' );

function event2log( eventTable, eventSrc, logDest ) {

	// Some argument checking
	if( typeof eventTable != 'object' ) {
		throw new Error( "The event table must be an object" );
	}

	if( ! (eventSrc instanceof events.EventEmitter) ) {
		throw new Error( "The event source is no instance of the event emitter" );
	}
	if( typeof logDest != 'object' ) {
		throw new Error( "The given logging instance must be an object" );
	}


	let listeners = {};

	for( let e in eventTable ) {

		// Events without function must throw an error
		if( typeof eventTable[ e ] !== 'function' ) {
			throw new Error( "Event " + e + " has no handler function" );
		}

		// Create event listener
		listeners[e] = function() {

			// We don't want to crash the whole system due to runtime errors in the
			// logging methods. How silly would that be. So catch all errors and print
			// them to stderr.
			try {

				// Evaluate translation function
				let ret = eventTable[e].apply( eventSrc, arguments );

				// If we haven't received an array we don't know what to do
				if( ! ( ret instanceof Array ) ) {
					throw new Error( "Unexpected return of event translation method " + e );
				}

				// If the array is empty
				if( ret.length === 0 ) {
					throw new Error( "Event translation method " + e + " returned an empty array" );
				}

				// First array item is the log function to be called
				let logDestFunc = ret.shift();

				// Check if object is acutally a function
				if( typeof logDest[ logDestFunc ] != 'function' ) {
					throw new Error( "Unexpected return of event translation method " + e );
				}

				// Call the log function. The other array items are its arguments.
				logDest[ logDestFunc ].apply( logDest, ret );

			} catch( e ) { log.error( e.message ); }

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
