'use strict';

var socket = {},
    io = require( 'socket.io' );

socket.addProp = function( obj ) {
    Object.keys( obj ).forEach(
        function( prop ) {
        this[ prop ] = obj[ prop ];
    }, this );
};

socket.listen = function() {
};

module.exports = socket;
