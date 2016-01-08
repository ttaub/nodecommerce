var jwt     = require( 'jsonwebtoken' );
var config  = require( '../config' );
var utilLib = require( './util' );

function decode( req, cb ) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if ( !token ) return cb( utilLib.createError( 'Missing token', 401 ) );

    jwt.verify( token, config.secret, function( err, body ) {
        if ( err ) return cb( err );
        cb( null, body );
    });
}

// TODO: Finish complete implementation (error handling). Maybe separate to find a specific user
module.exports.verifyUser = function( req, res, next ) {
    decode( req, function( err, body ) {

        // TODO: Check what's contained in the err object
        if ( err ) return next( new Error( err ) );
        req.user = body;
        next();
    });
};

module.exports.verifyAdmin = function( req, res, next ) {
    decode( req, function( err, body ) {

        // TODO: Check what's contained in the err object
        if ( err ) return next( new Error( err ) );
        if ( !body.admin ) return next( utilLib.createError( 'Access denied', 403 ) );
        req.user = body;
        next();
    });
};
