'use strict';

var express  = require( 'express' );
var router   = express.Router();
var config   = require( '../config' );
var tokenLib = require( '../lib/token' );
var utilLib  = require( '../lib/util' );

router.get( '/', tokenLib.verifyUser, function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'transaction_id' ).toInt();

    req.check( 'transaction_id',  'Invalid subscription id' ).optional().isInt({ min: 1 });

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    var query = knex.distinct( 't.id', 't.time_redeemed', 't.subscription_id', 't.item_id', 't.user_id' )
    .from( 'transactions as t' )
    .join( 'user_transactions as ut', function() {
        this.on( 't.id', '=', 'ut.transaction_id' );
    })
    .where( 'ut.user_id', Number( req.user.id ) );

    if ( req.query.transaction_id ) query.where( 's.id', req.query.transaction_id );

    query.orderBy( 'id', 'asc' )
    .then( function( transactions ) {
        res.status( 200 )
        .json({
            status:  'success',
            data:    transactions,
            message: 'Retrieved transactions'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

// TODO: Add route for creating transactions. Basically the most important route
module.exports = router;
