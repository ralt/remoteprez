'use strict';

var http = require( 'http' ),
    server = http.createServer(),

    // The list of urls is quite think
    urls = [
        '^/$',
        '^/prez/*',
        '^/favicon.ico$'
    ];

server.on( 'request', function( req, res ) {
    // Check if we have the URL
    var success = urls.some( function( url ) {
        if ( ( new RegExp( url ) ).exec( req.url ) ) {
            return true;
        }
        else {
            return false;
        }
    });

    // If we do, success!
    if ( success ) {
        console.log( 'Hit ' + req.url );
        res.writeHead( 200 );
        res.end();
    }
    else {
        console.log( 'Miss ' + req.url );
        res.writeHead( 404 );
        res.end();
    }
});


server.listen( 1111 );

