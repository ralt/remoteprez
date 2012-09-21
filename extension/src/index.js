'use strict';

var uuid = require( 'node-uuid' ),
    qrcode = require( 'qrcode' );

/**
 * This is what the code must do:
 *   - Connect to the websocket.
 *   - Create a channel which name is a generated UUID.
 *   - Listen on "send key" event from the websocket to get
 *   a keyCode.
 *   - Dispatch a KeyboardEvent using this keyCode.
 */

var socket = io.connect( 'http://remoteprez.margaine.com:8080/' );

var channel = uuid.v4(),
    engine = guessEngine();

socket.on( 'connect', function() {
    // Emit an event to create the channel
    socket.emit( 'create channel', channel );

    // And display a link to the controller link on remoteprez.margaine.com
    showLink();

    // Listen on the "send key" event
    socket.on( 'send direction', function( engine, direction ) {
        // Mapping object
        var mapping = {
            'impress.js': {
                'top': 'impress().prev()',
                'bottom': 'impress().next()',
                'left': 'impress().prev()',
                'right': 'impress().next()'
            },
            'reveal.js': {
                'top': 'Reveal.navigateUp()',
                'bottom': 'Reveal.navigateDown()',
                'left': 'Reveal.navigateLeft()',
                'right': 'Reveal.navigateRight()'
            },
            'html5slides': {
                'top': 'prevSlide()',
                'bottom': 'nextSlide()',
                'left': 'prevSlide()',
                'right': 'nextSlide()'
            },
            'csss': {
                'top': 'slideshow.previous()',
                'bottom': 'slideshow.next()',
                'left': 'slideshow.previous()',
                'right': 'slideshow.next()'
            }
        };

        // Just inject the right function
        injectCode( mapping[ engine ][ direction ] );
    });
});

function guessEngine() {
    // Ugly hack, but hey
    injectCode( ';(' + setEngine.toString() + '());' );

    // There we have the engine in the dataset
    return document.body.dataset.remoteprez;
}

function setEngine() {
    // To avoid errors in the mapping object
    // And let's not forget about hoisting :-)
    var engines = {
        Reveal: window.Reveal || '',
        impress: window.impress || '',
        prevSlide: window.prevSlide || '',
        slideshow: window.slideshow || ''
    };

    // Some aren't functions so we need this check
    var isObj = {
        Reveal: {
            obj: engines.Reveal,
            method: 'toggleOverview'
        },
        slideshow: {
            obj: engines.slideshow,
            method: 'previous'
        }
    };

    Object.keys( isObj ).forEach( function( key ) {
        if ( typeof isObj[ key ].obj === 'object' ) {
            engines[ key ] = window[ key ][ isObj[ key ].method ];
        }
    });

    var mapping = {
        'reveal.js': engines.Reveal,
        'impress.js': engines.impress,
        'html5slides': engines.prevSlide,
        'csss': engines.slideshow
    };

    Object.keys( mapping ).forEach( function( f ) {
        // If the function exists
        if ( typeof mapping[ f ] === 'function' ) {
            // Add it on the body data-*
            document.body.dataset.remoteprez = f;
        }
    });
}

function injectCode( code ) {
    // Create the element
    var script = document.createElement( 'script' );
    script.textContent = code;

    // Inject it
    document.body.appendChild( script );

    // And immediately remove it
    //script.parentNode.removeChild( script );
}

function showLink() {
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

    wrapper.innerHTML += qr.createImgTag( 4 );

    var img = wrapper.querySelector( 'img' );
    img.style.margin = 'auto';
    img.style.display = 'block';
    img.style.marginBottom = '10px';

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
}

