'use strict';

var io = require( 'socket.io' ).listen( 8080 ),
    channels = {};

/**
 * This is how it works:
 *   1. The extension connects to the websocket with a UUID.
 *   2. This UUID is used to create a channel.
 *   3. The websocket waits for the other client to connect with the same UUID.
 *   4. Once it's done, it listens to the second client's commands and sends
 *   them to the first client.
 *
 * The `channels` object contains all the clients in such a structure:
 *   {
 *       'UUID': [ client1, client2 ],
 *       'UUID2': [ client3, client4 ]
 *   }
 */
io.sockets.on( 'connection', function( socket ) {
    // Listen to the "create channel" even sent from the extension
    socket.on( 'create channel', function( channel ) {
        channels[ channel ] = [];
        channels[ channel ].push( socket.id );
    });

    // Listen to the second client connection
    socket.on( 'join channel', function( channel ) {
        channels[ channel ].push( socket.id );
    });

    // Listen to the "send key" event from the second client
    // and sent it to the first client
    socket.on( 'send key', function( obj ) {
        // Get the channel to send it on
        var channel = channels[ obj.channel ];

        // Get the first client of this channel
        var client = channel[ 0 ];

        // And send the key to it
        io.sockets.socket( client ).emit( 'send key', obj.key );
    });

    // Handles deletion or the array is never going to be freed up.
    socket.on( 'disconnect', function() {

        // Remove the channel in which the client just disconnected
        Object.keys( channels ).some( function( channel ) {
            var index = channel.indexOf( socket.id );
            if ( ~index ) {
                delete channels[ channel ];
                return true;
            }
            else {
                return false;
            }
        });
    });
});

