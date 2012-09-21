'use strict';

var qrcode = require( 'qrcode' );

module.exports = function( channel, engine ) {
    // Create a wrapper
    var wrapper = document.createElement( 'div' );
    // Add some style
    wrapper.style.background = '#E0ECF8';
    wrapper.style.position = 'absolute';
    wrapper.style.top = '1px';
    wrapper.style.right = '1px';
    wrapper.style.zIndex = 9999;
    wrapper.style.borderRadius = '15px 0px 15px 15px';
    wrapper.style.fontSize = '20px';
    wrapper.style.fontFamily = 'Arial';
    wrapper.style.color = '#2E2E2E';
    // For impress.js, or the wrapper won't be clickable
    wrapper.style.pointerEvents = 'auto';

    // Remove it when you click on it
    wrapper.addEventListener( 'click', function() {
        this.parentNode.removeChild( this );
    }, false );

    // Store the url
    var url = 'http://remoteprez.margaine.com/prez.html?c=' + channel +
        '&e=' + engine;

    // Create a DOM element to show
    var link = document.createElement( 'a' );

    // Add some style
    link.style.display = 'block';
    link.style.margin = '15px';
    link.style.color = '#333';

    link.href = url;
    link.textContent = 'Click here to control your presentation';
    link.target = '_blank';

    // Add it to the wrapper
    wrapper.appendChild( link );

    // Add the "OR"
    var or = document.createElement( 'div' );
    or.textContent = 'or scan this QRcode';
    or.style.margin = '5px';
    or.style.textAlign = 'center';

    wrapper.appendChild( or );

    // Now create the QRCode
    var qr = qrcode( 10, 'M' );
    qr.addData( url );
    qr.make();

    wrapper.innerHTML += qr.createImgTag( 3 );

    var img = wrapper.querySelector( 'img' );
    img.style.margin = '20px auto';
    img.style.display = 'block';

    // And a close button
    var close = document.createElement( 'div' );
    close.textContent = 'Close';
    close.style.margin = '5px';
    close.style.textAlign = 'center';
    close.style.cursor = 'pointer';
    close.style.fontSize = '10px';
    close.style.textDecoration = 'underline';

    wrapper.appendChild( close );

    // And append it to the body
    document.body.appendChild( wrapper );
};

