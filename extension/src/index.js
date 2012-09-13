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

var channel = uuid.v4(),
    engine = prompt( 'Which engine is it? impress.js, reveal.js or html5slides?' );

socket.on( 'connect', function() {
    // Emit an event to create the channel
    socket.emit( 'create channel', channel );

    // And display a link to the controller link on remoteprez.margaine.com
    showLink();

    // Listen on the "send command" event
    socket.on( 'send command', function( command ) {
        // Just inject the command
        injectCode( command );
    });
});

function injectCode( code ) {
    // Create the element
    var script = document.createElement( 'script' );
    script.textContent = code;

    // Inject it
    document.body.appendChild( script );

    // And immediately remove it
    script.parentNode.removeChild( script );
}

function showLink() {
    // Create a DOM element to show
    var link = document.createElement( 'a' );
    link.href = 'http://remoteprez.margaine.com/prez.html?c=' +
        channel + '&e=' + engine;
    link.textContent = 'Click here to control your presentation';
    link.target = '_blank';

    // Add some style
    link.style.background = 'white';
    link.style.position = 'absolute';
    link.style.top = '10px';
    link.style.left = '10px';
    // For impress.js, or the link won't be clickable
    link.style.pointerEvents = 'auto';

    // Remove it when you click on it
    link.addEventListener( 'click', function() {
        this.parentNode.removeChild( this );
    }, false );

    // And append it to the body
    document.body.appendChild( link );
}

