"use strict";

const assert = require( 'assert' );
const mockery = require( 'mockery' );

describe( "event2log", () => {

	let e2l;
	let events;
	let log;

	before( ( done ) => {

		mockery.enable( {
			useCleanCache: true,
			warnOnReplace: false,
			warnOnUnregistered: false
		} );

		log = { error: () => {} };
		mockery.registerMock( './lib/log.js', log );

		e2l = require( '../index.js' );
		events = require( 'events' );

		done();

	} );

	after( ( done ) => {

		mockery.disable();

		done();

	} );

	it( "should complain about event table not being an object", ( done ) => {
		try {

			e2l();

		} catch( e ) { /*console.log(e);*/ done(); }
	} );

	it( "should complain about event source not being an instance of event emitter", ( done ) => {
		try {

			e2l( {}, true );

		} catch( e ) { /*console.log(e);*/ done(); }
	} );

	it( "should complain about the logging instance not being an object", ( done ) => {
		try {

			e2l( {}, new events(), true );

		} catch( e ) { /*console.log(e);*/ done(); }
	} );

	it( "should complain about the logging instance not being an object", ( done ) => {
		try {

			e2l( {}, new events(), true );

		} catch( e ) { /*console.log(e);*/ done(); }
	} );

	it( "should complain about items in the event table that are no functions", ( done ) => {
		try {

			let et = {
				'event1': () => [],
				'event2': true
			};
			e2l( et, new events(), {} );

		} catch( e ) { /*console.log(e);*/ done(); }
	} );

	it( "should not crash if the event handler does not return an array", ( done ) => {

		let e = new events();

		let et = {
			'event1': () => [],
			'event2': () => true
		};

		e2l( et, e, {} );

		log.error = () => done();

		e.emit( 'event2' );

	} );

	it( "should not crash if the event handler returns an empty array", ( done ) => {

		let e = new events();

		let et = {
			'event1': () => []
		};

		e2l( et, e, {} );

		log.error = () => done();

		e.emit( 'event1' );

	} );

	it( "should not crash if the event handler returns a non-existent log function", ( done ) => {

		let e = new events();

		let et = {
			'event1': () => [ 'test' ]
		};

		e2l( et, e, {} );

		log.error = () => done();

		e.emit( 'event1' );

	} );

	it( "listen to an event, bypass event arguments and call the log function", ( done ) => {

		let e = new events();

		let et = {
			'event1': ( a, b ) => [ 'test', a, b ]
		};

		let l = {
			'test': ( a, b ) => {
				try {
					assert.strictEqual( a, true );
					assert.strictEqual( b, 42 );
					done();
				} catch( e ) { done( e ); }
			}
		};

		log.error = done;

		e2l( et, e, l );

		e.emit( 'event1', true, 42 );

	} );

} );
