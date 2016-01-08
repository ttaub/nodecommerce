'use strict';

var express  = require( 'express' );
var router   = express.Router();
var config   = require( '../config' );
var tokenLib = require( '../lib/token' );
var utilLib  = require( '../lib/util' );

router.get( '/', tokenLib.verifyUser, function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'subscription_id' ).toInt();

    req.check( 'subscription_id',  'Invalid subscription id' ).optional().isInt({ min: 1 });

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    var query = knex.distinct( 's.id', 's.name', 's.description', 's.cost' )
    .from( 'subscriptions as s' )
    .join( 'user_subscriptions as us', function() {
        this.on( 's.id', '=', 'us.subscription_id' );
    })
    .where( 'us.user_id', Number( req.user.id ) );

    if ( req.query.subscription_id ) query.where( 's.id', req.query.subscription_id );

    query.orderBy( 'id', 'asc' )
    .then( function( subscriptions ) {
        res.status( 200 )
        .json({
            status:  'success',
            data:    subscriptions,
            message: 'Retrieved subscriptions'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

router.post( '/', tokenLib.verifyUser, function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'plan_id' ).toInt();

    req.check( 'plan_id', 'Invalid item id' ).optional().isInt({ min: 1 });

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    // Make sure the plan actually exists
    knex.select( 'id' )
    .from( 'plans' )
    .where( id, req.body.plan_id )
    .then( function( plan ) {
        if ( plan.length === 0 ) throw utilLib.createError( 'Plan does not exist', 400 );
    })
    .catch( function( err ) {
        return next( err );
    });

    knex.insert({
        plan_id: req.body.plan_id
    })
    .returning( 'id' )
    .into( 'subscriptions' )
    .then( function( id ) {
        id = id[0];
        knex.insert({
            user_id:         req.user.id,
            subscription_id: id
        })
        .into( 'user_subscriptions' )
        .then( function() {
            res.status( 200 )
            .json({
                status: 'success',
                data: {
                    subscription_id: id,
                    user_id:         req.user.id,
                    plan_id:         req.body.plan_id
                },
                message: 'Created subscription'
            });
        })
        .catch( function( err ) {
            return next( err );
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

module.exports = router;
