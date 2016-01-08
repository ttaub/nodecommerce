'use strict';

var express  = require( 'express' );
var router   = express.Router();
var config   = require( '../config' );
var tokenLib = require( '../lib/token' );
var utilLib  = require( '../lib/util' );

router.all( '/*', tokenLib.verifyAdmin, function( req, res, next ) {
    return next();
});

router.get( '/user', function( req, res, next ) {
    var knex = req.knex;

    knex.select( 'id', 'first_name', 'last_name', 'email', 'phone', 'admin' )
    .from( 'users' )
    .then( function( users ) {
        res.status( 200 )
        .json({
            status:  'success',
            data:    users,
            message: 'Retrieved users'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

router.get( '/subscription', function( req, res, next ) {
    var knex = req.knex;

    knex.select()
    .from( 'subscriptions' )
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

router.post( '/item', function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'cost' ).toInt();

    req.check( 'name',        'Missing name' ).notEmpty();
    req.check( 'description', 'Missing description' ).notEmpty();
    req.check( 'cost',        'Cost must be a positive integer' ).notEmpty().isInt({ min: 1 });

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    knex.insert({
        name:        req.body.name,
        description: req.body.description,
        cost:        req.body.cost
    })
    .returning( 'id' )
    .into( 'items' )
    .then( function( id ) {
        id = id[0];
        res.status( 201 )
        .json({
            status: 'success',
            data: {
                id:          id,
                name:        req.body.name,
                description: req.body.description,
                cost:        req.body.cost
            },
            message: 'Created item'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

router.post( '/plan', function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'max_beers' ).toInt();
    req.sanitize( 'monthly_cost' ).toInt();

    req.check( 'name',         'Missing name' ).notEmpty();
    req.check( 'description',  'Missing description' ).notEmpty();
    req.check( 'max_beers',    'Max beers must be a positive integer' ).notEmpty().isInt({ min: 1 });
    req.check( 'monthly_cost', 'Monthly cost must be a positive integer' ).notEmpty().isInt({ min: 1 });
    req.check( 'recurring',    'Recurring value must be a boolean' ).notEmpty().isBoolean( true );

    // This translates it to "true" or "false" after the check above so that only "1", "true", "0", and "false" are accepted
    req.sanitize( 'recurring' ).toBoolean( true );

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    knex.insert({
        name:         req.body.name,
        description:  req.body.description,
        max_beers:    req.body.max_beers,
        monthly_cost: req.body.monthly_cost,
        recurring:    req.body.recurring
    })
    .returning( 'id' )
    .into( 'plans' )
    .then( function( id ) {
        id = id[0];

        res.status( 201 )
        .json({
            status: 'success',
            data: {
                id:           id,
                name:         req.body.name,
                description:  req.body.description,
                max_beers:    req.body.max_beers,
                monthly_cost: req.body.monthly_cost,
                recurring:    req.body.recurring
            },
            message: 'Created plan'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

router.post( '/store', function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'longitude' ).toFloat();
    req.sanitize( 'latitude' ).toFloat();

    req.check( 'name',        'Missing name' ).notEmpty();
    req.check( 'description', 'Missing description' ).notEmpty();
    req.check( 'longitude',   'Longitude must be a valid float' ).notEmpty().isFloat();
    req.check( 'latitude',    'Latitude must be a valid float' ).notEmpty().isFloat();

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    var code;
    var done;
    do {
        done = true;
        code = Math.floor( 100000 + Math.random() * 900000 );
        knex.select( 'code' )
        .from( 'stores' )
        .map( function( store ) {
            if ( store.code === code ) done = false;
            return false;
        });
    } while ( !done );

    knex.insert({
        name:        req.body.name,
        description: req.body.description,
        longitude:   req.body.longitude,
        latitude:    req.body.latitude,
        code:        code
    })
    .returning( 'id' )
    .into( 'stores' )
    .then( function( id ) {
        id = id[0];

        res.status( 201 )
        .json({
            status: 'success',
            data: {
                id:          id,
                name:        req.body.name,
                description: req.body.description,
                latitude:    req.body.latitude,
                longitude:   req.body.longitude,
                code:        code
            },
            message: 'Created store'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

router.post( '/addItemToStore', function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'item_id' ).toInt();
    req.sanitize( 'store_id' ).toInt();

    req.check( 'item_id',  'Invalid item id' ).notEmpty().isInt({ min: 1 });
    req.check( 'store_id', 'Invalid store id' ).notEmpty().isInt({ min: 1 });

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    knex.insert({
        item_id:  req.body.item_id,
        store_id: req.body.store_id
    })
    .into( 'store_items' )
    .then( function() {
        res.status( 201 )
        .json({
            status: 'success',
            data: {
                item_id:  req.body.item_id,
                store_id: req.body.store_id
            },
            message: 'Added item to store'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

module.exports = router;
