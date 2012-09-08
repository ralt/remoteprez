'use strict';

var http = require( 'http' ),
    server = http.createServer(),
    Socket = require( './socket.js' );

    // The list of urls is quite thin
    urls = [
        '^/$',
        '^/prez/server/*',
        '^/prez/client/*',
        '^/favicon.ico$'
    ].map( function( url ) {
        // Only create the new regex once
        return new RegExp( url );
    });

function init() {
    // Initialize the static server
    server.on( 'request', function( req, res ) {
        // Check if we have the URL
        var success = urls.some( function( url ) {
            if ( url.exec( req.url ) ) {
                return true;
            }
            else {
                return false;
            }
        });

        // If we do, success!
        if ( success ) {
            var staticServer = require( './static.js' ),
            staticServer.serve( req.url, req, res );
        }
        else {
            console.log( 'Miss ' + req.url );
            res.writeHead( 404 );
            res.end();
        }
    });

    // Initialize the socket
    var socket = new Socket();
}

module.exports = {
    listen: function( port ) {
        init();
        server.listen( port );
    }
};

