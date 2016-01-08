// TODO: Fix this because it's a huge fuck-up right now

'use strict';

var bunyan = require( 'express-bunyan-logger' );
var path   = require( 'path' );
var fs     = require( 'fs' );

module.exports = function( app ) {

    // Because it's called once when the server starts, using sync functions is okay
    if ( !fs.existsSync( path.join( __dirname, '..', 'logs' ) ) ) {
        fs.mkdirSync( path.join( __dirname, '..', 'logs' ) );
    }
    if ( !fs.existsSync( path.join( __dirname, '..', 'logs/error.log' ) ) ) {
        fs.closeSync( fs.openSync( path.join( __dirname, '..', 'logs/error.log' ), 'a' ) );
    }
    if ( !fs.existsSync( path.join( __dirname, '..', 'logs/info.log' ) ) ) {
        fs.closeSync( fs.openSync( path.join( __dirname, '..', 'logs/info.log' ), 'a' ) );
    }

    app.use( bunyan({
        name: 'info_logger',
        streams: [{
            level: 'info',
            path: path.join( __dirname, '..', 'logs/info.log' )
        }]
    }) );

    app.use( bunyan.errorLogger({
        name: 'error_logger',
        streams: [{
            level: 'info',
            path: path.join( __dirname, '..', 'logs/error.log' )
        }]
    }) );
};
