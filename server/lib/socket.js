'use strict';

var io = require( 'socket.io' );

function Socket( url, req, res ) {
    this.url = url;
    this.req = req;
    this.res = res;
}

Socket.prototype = {
    constructor: Socket,

    listen: function() {
    }
};

// Static property
Socket.clients = [];

module.exports = Socket;
