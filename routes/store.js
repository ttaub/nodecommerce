'use strict';

var express = require( 'express' );
var router  = express.Router();

router.get( '/', function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'store_id' ).toInt();
    req.sanitize( 'item_id' ).toInt();

    req.check( 'store_id', 'Invalid store id' ).optional().isInt({ min: 1 });
    req.check( 'item_id',  'Invalid item id' ).optional().isInt({ min: 1 });

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    var query = knex.distinct( 's.id', 's.name', 's.description', 's.latitude', 's.longitude' )
    .from( 'stores as s' );

    if ( req.query.item_id ) {
        query.join( 'store_items as si', function() {
            this.on( 's.id', '=', 'si.store_id' );
        })
        .where( 'si.item_id', req.query.item_id );
    }

    if ( req.body.store_id ) query.where( 's.id', req.query.store_id );

    query.orderBy( 'id', 'asc' )
    .then( function( stores ) {
        res.status( 200 )
        .json({
            status:  'success',
            data:    stores,
            message: 'Retrieved stores'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

module.exports = router;
