'use strict';

var express  = require( 'express' );
var router   = express.Router();
var jwt      = require( 'jsonwebtoken' );
var bluebird = require( 'bluebird' );
var bcrypt   = bluebird.promisifyAll( require( 'bcrypt' ) );
var utilLib  = require( '../lib/util' );
var config   = require( '../config' );

router.post( '/login', function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'email' ).normalizeEmail();

    req.check( 'email',    'Missing email' ).notEmpty();
    req.check( 'password', 'Missing password' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    knex.select()
    .from( 'users' )
    .where({
        email: req.body.email
    })
    .then( function( user ) {
        if ( user.length === 0 ) {
            return next( utilLib.createError( 'User not found', 401 ) );
        } else {
            user = user[0];

            bcrypt.compareAsync( req.body.password, user.password )
            .then( function( success ) {
                if ( success ) {
                    var token = jwt.sign({
                        id:    user.id,
                        email: user.email,
                        phone: user.phone,
                        admin: user.admin
                    }, config.secret, {
                        expiresInMinutes: 1440
                    });
                    res.status( 200 )
                    .json({
                        status: 'success',
                        data: {
                            token: token
                        },
                        message: 'Generated token'
                    });
                } else {
                    return next( utilLib.createError( 'Incorrect password', 401 ) );
                }
            });
        }
    })
    .catch( function( err ) {
        return next( err );
    });
});

// I think this should be removed before pushing to prod
router.get( '/admin', function( req, res ) {
    var token = jwt.sign({
        admin: true
    }, config.secret );
    res.status( 200 )
    .json({
        token: token
    });
});

module.exports = router;
