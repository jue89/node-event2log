# event2log

Little helper module for translating events into log messages.

Will perfectly work with NodeJS 4.0.0 and above.

## Example

``` javascript
'use strict';

const events = require( 'events' );
const event2log = require( 'event2log' );


// First we create a dummy instance. It might be anything emitting events.
// This is the instance you are willing to observe and log upon emitted events.
let instanceThrowingEvents = new events.EventEmitter();

// The translation table converts events into human-readable strings.
// The field name corresponds to an event name. The field itself accommodates a
// function that receives the event arguments and alway will return an array!
// The first argument of that array names a logging method and the following
// items will be passed to logging method as arguments.
const translationTable = {
	'event1': ( a, b ) => [ 'log',   `Hello ${a}! Are you afraid of ${b}?` ],
	'event2': ( c )    => [ 'error', `${c} is watching you!` ]
};

// The following statement bundles everything together. For testing purposes it
// just prints stuff to the console. But you also could replace the 'console' by
// something more sophisticated (or bloated?) like 'winston'.
let e2lHandler = event2log( translationTable, instanceThrowingEvents, console );


instanceThrowingEvents.emit( 'event1', "World", "Chuck Norris" );
// Will print to stdout: Hello World! Are you afraid of Chuck Norris?

instanceThrowingEvents.emit( 'event2', "Big Brother" );
// Will print to stderr: Big Brother is watching you!


// Calling the returned e2lHandler releases all listening events bound by
// event2log.
e2lHandler();

instanceThrowingEvents.emit( 'event1', "Universe", "human beings" );
// Won't print anything to the console.
```
