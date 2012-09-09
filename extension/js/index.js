'use strict';

var uuid = require( 'node-uuid' );

/**
 * This is what the code must do:
 *   - Connect to the websocket.
 *   - Create a channel which name is a generated UUID.
 *   - Listen on "send key" event from the websocket to get
 *   a keyCode.
 *   - Dispatch a KeyboardEvent using this keyCode.
 */

var socket = io.connect( 'http://remoteprez.margaine.com:8080/' );

var channel = uuid.v4();

socket.on( 'connect', function() {
    // Emit an event to create the channel
    socket.emit( 'create channel', channel );

    // And display a link to the controller link on remoteprez.margaine.com
    showLink();

    // Listen on the "send key" event
    socket.on( 'send key', function( keyCode ) {

        // Dispatch a keyboard event using the keyCode provided
        var evt = document.createEvent( 'KeyboardEvent' );
        evt.initKeyboardEvent(
            'keypress',
            true,
            true,
            window,
            false,
            false,
            false,
            false,
            keyCode,
            0
        );
        document.dispatchEvent( evt );
    });
});

function showLink() {
    // Create a DOM element to show
    var link = document.createElement( 'a' );
    link.href = 'http://remoteprez.margaine.com/prez.html?c=' + channel;
    link.style.position = 'absolute';
    link.style.top = '50px';
    link.style.left = '50px';

    // And append it to the body
    document.body.appendChild( link );
}

