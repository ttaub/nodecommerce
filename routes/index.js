'use strict';

var Path           = require( 'path' );
var normalizedPath = Path.join( __dirname );

module.exports = function( app ) {

    require( 'fs' ).readdirSync( normalizedPath ).forEach( function( file ) {
        if ( file !== 'index.js' && Path.extname( file ) === '.js' ) {
            var model = require( './' + file );
            app.use( '/' + file.slice( 0, -3 ), model );
        }
    });
};
