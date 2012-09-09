#!/usr/bin/env node

'use strict';

// Browserify part
var fs = require( 'fs' ),
    browserify = require( 'browserify' ),
    entry,
    output,
    debug,
    uglify;

if ( process.argv[ 3 ] === 'debug' ) {
    debug = true;
    uglify = false;
}
else {
    debug = false;
    uglify = true;
}

var b = browserify( {
    watch: true,
    debug: debug
});

switch( process.argv[ 2 ] ) {
case 'prez':
    entry = 'public/assets/js/prez/index.js';
    output = 'public/assets/js/prez.js';
    break;
case 'extension':
    entry = 'extension/js/index.js';
    output = 'extension/remoteprez.js';
    break;
}

b.addEntry( entry );

fs.writeFileSync( output, b.bundle() );

// Uglify part
if ( uglify ) {
    var exec = require( 'child_process' ).exec,
        command = 'uglifyjs ' +
            output + ' > tmp.js && mv tmp.js ' + output;

    exec( command );

    b.on( 'bundle', function() {
        exec( command );
    });
}

