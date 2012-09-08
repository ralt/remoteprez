'use strict';

/**
 * Handles the few static files there is:
 *   - static/index.html
 *   - static/styles.css
 *   - static/bundle.js
 *   - static/favicon.ico
 */

var urlsMap = {
    '/favicon.ico': './static/favicon.ico',
    '/': './static/index.html',
    '/styles.css': './static/styles.css',
    '/bundle.js': './static/bundle.js',
    '/prez.html': './static/prez.html'
},
    extMap = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'ico': 'image/x-icon'
},
    fs = require( 'fs' ),
    server = {};

server.serve = function( url, req, res ) {
    // Read the file
    fs.readFile( urlsMap[ url ], 'utf-8',
        function( err, data ) {
        if ( err ) throw err;

        // Get the extension of the file
        var ext = url.split( '.' ).pop();

        // Set the correct headers
        res.writeHead( 200, {
            'Content-Length': data.length,
            'Content-Type': extMap[ ext ]
        });

        res.end( data, 'utf-8' );
    });
};

module.exports = server;

