module.exports = {
    injectCode: function( code ) {
        // Create the element
        var script = document.createElement( 'script' );
        script.textContent = code;

        // Inject it
        document.body.appendChild( script );

        // And immediately remove it
        script.parentNode.removeChild( script );
    }
};

