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
    engine = guessEngine();

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

function guessEngine() {
    // Ugly hack, but hey
    injectCode( setEngine.toString() + 'setEngine();' );

    // There we have the engine in the dataset
    return document.body.dataset.remoteprez;
}

function setEngine() {
    // To avoid errors in the mapping object
    // And let's not forget about hoisting :-)
    var Reveal = window.Reveal || '',
        impress = window.impress || '',
        prevSlide = window.prevSlide || '';

    // Reveal isn't a function, so we need this
    if ( typeof Reveal === 'object' ) {
        Reveal = Reveal.toggleOverview;
    }

    var mapping = {
        'reveal.js': Reveal,
        'impress.js': impress,
        'html5slides': prevSlide
    };

    Object.keys( mapping ).forEach( function( f ) {
        // If the function exists
        if ( typeof mapping[ f ] === 'function' ) {
            // Add it on the body data-*
            document.body.dataset.remoteprez = f;
        }
    });
}

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

