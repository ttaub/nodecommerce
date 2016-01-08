'use strict';

var express = require( 'express' );
var router  = express.Router();
var utils   = require( '../lib/util' );

router.get( '/', function( req, res, next ) {
    var knex = req.knex;

    knex.select()
    .from( 'plan' )
    .orderBy( 'id', 'asc' )
    .then( function( plans ) {
        res.status( 200 )
        .json({
            status: 'success',
            data:    plans,
            message: 'Retrieved plans'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

router.get( '/id/:plan_id', function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'plan_id' ).toInt();

    req.check( 'plan_id', 'Invalid plan id' ).notEmpty().isInt({ min: 1 });
    req.check( 'password', 'Missing password' ).notEmpty();

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    knex.select()
    .from( 'plans' )
    .where( 'id', plan_id )
    .then( function( plan ) {
        if ( plan.length === 0 ) return next( utils.createError( 'Plan not found', 400 ) );
        plan = plan[0];
        res.status( 200 )
        .json({
            status:  'success',
            data:    req.params.plan_id,
            message: 'Retrieved plan'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

module.exports = router;
