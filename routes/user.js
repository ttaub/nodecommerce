'use strict';

var express   = require( 'express' );
var router    = express.Router();
var bluebird  = require( 'bluebird' );
var validator = require( 'validator' );
var bcrypt    = bluebird.promisifyAll( require( 'bcrypt' ) );
var config    = require( '../config' );
var utils     = require( '../lib/util' );
var tokenLib  = require( '../lib/token' );
var stripeLib = require( '../lib/stripe' );

// POST route ===================================

function validateFields( req, res, next ) {

    if ( !req.body.first_name )                                return next( new Error( 'Missing first name' ) );
    if ( !req.body.last_name )                                 return next( new Error( 'Missing last name' ) );
    if ( !req.body.email )                                     return next( new Error( 'Missing email' ) );
    if ( !req.body.phone )                                     return next( new Error( 'Missing phone number' ) );
    if ( !req.body.password )                                  return next( new Error( 'Missing password' ) );
    if ( !validator.isEmail( req.body.email ) )                return next( new Error( 'Email is formated incorrectly' ) );
    if ( !validator.isMobilePhone( req.body.phone, 'en-US' ) ) return next( new Error( 'Phone number is invalid' ) );
    if ( req.body.password.length < 8 )                        return next( new Error( 'Password is too short' ) );

    next();
}

function addUser( req, res, next ) {

    var knex = req.knex;

    knex.select( 'phone', 'email' )
    .from( 'users' )
    .map( function( user ) {

        // These errors will be caught by the .catch below
        if ( user.phone === req.body.phone ) throw new Error( 'Phone is already in use' );
        if ( user.email === req.body.email ) throw new Error( 'Email is already in use' );

    }).then( function() {
        bcrypt.hashAsync( req.body.password, 10 ).then( function( password ) {
            knex.insert({
                first_name: req.body.first_name,
                last_name:  req.body.last_name,
                email:      req.body.email,
                phone:      req.body.phone,
                password:   password
            }).returning( 'id' )
            .into( 'users' )
            .then( function( id ) {
                id = id[0];

                res.status( 201 )
                .json({
                    status: 'success',
                    data: {
                        id:         id,
                        first_name: req.body.first_name,
                        last_name:  req.body.last_name,
                        email:      req.body.email,
                        phone:      req.body.phone
                    },
                    message: 'Created user'
                });
            }).catch( function( err ) {
                return next( err );
            });
        });
    }).catch( function( err ) {
        return next( err );
    });
}

// GET Route ====================================

function getUser( req, res, next ) {

    var knex = req.knex;

    var user_id = Number( req.params.user_id );

    if ( !utils.positiveInteger( user_id ) ) return next( new Error( 'User ID must be a positive integer' ) );
    else {
        knex.select( 'id', 'first_name', 'last_name', 'email', 'phone' )
        .from( 'users' )
        .where( 'id', user_id )
        .then( function( user ) {
            user = user[0];

            if ( !user ) {
                return next( new Error( 'User not found' ) );
            } else {
                res.status( 200 )
                .json({
                    status:  'success',
                    data:    user,
                    message: 'Retrieved user'
                });
            }
        }).catch( function( err ) {
            return next( err );
        });
    }
}

// TODO: Payment route

// TODO: Route for changing user information

router.post( '/', validateFields, addUser );

router.get( '/id/:user_id', tokenLib.verifyUser, getUser );

router.post( '/paymentInfo', tokenLib.verifyUser, stripeLib.createCustomer  );

module.exports =  router;
