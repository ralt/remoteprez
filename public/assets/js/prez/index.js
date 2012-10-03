'use strict';

/**
 * This client reads the URL to get the UUID he has to use.
 * For example, the UUID can be "azerty" if the URL is
 * /prez.html?c=azerty
 *
 * Once it has the UUID, it can connect to the websocket to register
 * itself on it.
 *
 * Then, it has to listen at the click events on the table and
 * send the corresponding key to the websocket.
 */

// Get the channel used with a simple method.
// I could use a fully featured solution, but use the extension
// correctly or not, ffs.
var channel = getParameterByName( 'c' ),
    engine = getParameterByName( 'e' );

var socket = io.connect( 'http://remoteprez.margaine.com:8080/' );
socket.once('reconnect',function(){
 socket.once('disconnect',function(){
  io.transports = ["htmlfile","xhr-polling","jsonp-polling"];
 });
});
socket.once( 'connect', function() {
    // Emit an event to join the channel
    socket.emit( 'join channel', channel );

    // Add an event listener to handle the click events
    document.body.addEventListener( 'click', handleClick, false );

    // Also add event listeners to simulate the css pseudo active on mobiles
    document.body.addEventListener( 'touchstart', touchStart, false );
    document.body.addEventListener( 'touchend', touchEnd, false );

    function handleClick( e ) {
        // Check if we clicked on an arrow
        if ( ~e.target.className.indexOf( 'arrow' ) ) {

            // The direction is the second class in alphabetical order,
            // the first being "arrow".
            var direction = e.target.className.split( ' ' ).sort()[ 1 ];

            // Send the event to the websocket
            socket.emit( 'send direction', {
                channel: channel,
                direction: direction,
                engine: engine
            });
        }
    }

    function touchStart( e ) {
        if ( ~e.target.className.indexOf( 'arrow' ) ) {
            // Add the "active" class
            e.target.className += ' active';
        }
    }

    function touchEnd( e ) {
        if ( ~e.target.className.indexOf( 'arrow' ) ) {
            // Remove the "active" class
            var classes = e.target.className.split( ' ' );
            classes.splice( classes.indexOf( 'active' ), 1 );
            e.target.className = classes.join( ' ' );
        }
    }
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)')
                    .exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

