'use strict';

var io = require( 'socket.io' ),
    uuid = require( 'node-uuid' );

function Socket() {
    // Initialize the connection
    this.init();
}

Socket.prototype = {
    constructor: Socket,

    init: function() {
    }
};

// Static property
Socket.clients = [];

module.exports = Socket;
