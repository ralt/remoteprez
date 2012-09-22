'use strict';

var uuid = require( 'node-uuid' ),
    engines = require( './engines.js' ),
    util = require( './util.js' );

/**
 * This is what the code must do:
 *   - Connect to the websocket.
 *   - Create a channel which name is a generated UUID.
 *   - Listen on "send key" event from the websocket to get
 *   a keyCode.
 *   - Inject some code to run the next/previous command
 */

var socket = io.connect( 'http://remoteprez.margaine.com:8080/' );

var channel = uuid.v4(),
    engine = engines.guess();

if ( !engine ) {
    alert( "You're not on a supported presentation page. Sorry." );
}
else {
    socket.on( 'connect', function() {
        // Emit an event to create the channel
        socket.emit( 'create channel', channel );

        // Display the link/qrcode
        require( './html.js' )( channel, engine );

        // Listen on the "send key" event
        socket.on( 'send direction', function( engine, direction ) {
            // Mapping object
            var mapping = {
                'impress.js': {
                    'top': 'impress().prev()',
                    'bottom': 'impress().next()',
                    'left': 'impress().prev()',
                    'right': 'impress().next()'
                },
                'reveal.js': {
                    'top': 'Reveal.navigateUp()',
                    'bottom': 'Reveal.navigateDown()',
                    'left': 'Reveal.navigateLeft()',
                    'right': 'Reveal.navigateRight()'
                },
                'html5slides': {
                    'top': 'prevSlide()',
                    'bottom': 'nextSlide()',
                    'left': 'prevSlide()',
                    'right': 'nextSlide()'
                },
                'csss': {
                    'top': 'slideshow.previous()',
                    'bottom': 'slideshow.next()',
                    'left': 'slideshow.previous()',
                    'right': 'slideshow.next()'
                }
            };

            // Just inject the right function
            util.injectCode( mapping[ engine ][ direction ] );
        });
    });
}

