'use strict';

// Requires =====================================
var express           = require( 'express' );
var app               = express();

var express_validator = require( 'express-validator' );
var body_parser       = require( 'body-parser' );
var utilLib           = require( './lib/util' );
var config            = require( './config' );

var knex              = require( 'knex' )( config.database );

// Middleware ===================================
app.use( body_parser.json() );
app.use( body_parser.urlencoded({
    extended: true
}) );

app.use( express_validator() );

app.use( function( req, res, next ) {
    req.knex = knex;
    next();
});

// Create logger
require( './lib/logger' )( app );

// Routes =======================================
app.get( '/', function( req, res ) {
    res.json({
        status: 'success',
        data: null,
        message: 'Welcome to the API'
    });
});

require( './routes' )( app );

// 404 Route
app.use( function( req, res, next ) {
    return next( utilLib.createError( 'Invalid route', 404 ) );
});

// Error handling middleware
// Takes care of internal errors, and missing tokens
// Errors like insufficient privileges should be handled by each route
// This must be applied after the routes above

// Using next(err) with an error object is the best way to call this
// Use the utilLib.createError function to specify a status code

// Keeping this function's signature like this is critical
// If the 'next' argument is removed, it stops working as an error handler
app.use( function( err, req, res, next ) {

        res.status( err.code || 500 )
        .json({
            status:  'error',
            data:    null,
            message: err.message
        });
});

module.exports = app;
