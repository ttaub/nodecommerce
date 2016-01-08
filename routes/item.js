'use strict';

var express = require( 'express' );
var router  = express.Router();

router.get( '/', function( req, res, next ) {
    var knex = req.knex;

    req.sanitize( 'item_id' ).toInt();
    req.sanitize( 'store_id' ).toInt();

    req.check( 'item_id',  'Invalid item id' ).optional().isInt({ min: 1 });
    req.check( 'store_id', 'Invalid store id' ).optional().isInt({ min: 1 });

    var errors = req.validationErrors();
    if ( errors ) return next( utilLib.createError( errors[0].msg, 400 ) );

    var query = knex.distinct( 'i.id', 'i.name', 'i.description', 'i.cost' )
    .from( 'items as i' );

    if ( req.query.store_id ) {
        query.join( 'store_items as si', function() {
            this.on( 'i.id', '=', 'si.item_id' );
        })
        .where( 'si.store_id', req.query.store_id );
    }

    if ( req.body.item_id ) query.where( 'i.id', req.query.item_id );

    query.orderBy( 'id', 'asc' )
    .then( function( items ) {
        res.status( 200 )
        .json({
            status:  'success',
            data:    items,
            message: 'Retrieved items'
        });
    })
    .catch( function( err ) {
        return next( err );
    });
});

module.exports = router;
