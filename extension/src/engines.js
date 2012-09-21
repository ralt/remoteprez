'use strict';

var util = require( './util.js' );

module.exports = {
    guess: function() {
        // Ugly hack, but hey
        util.injectCode( ';(' + setEngine.toString() + '());' );

        // There we have the engine in the dataset
        return document.body.dataset.remoteprez;
    }
};

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

