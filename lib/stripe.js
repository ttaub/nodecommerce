'use strict';

var config = require( '../config' );
var stripe = require( 'stripe' )( config.stripe.secret );

module.exports.createCustomer = function( req, res, next ) {

    var user = req.user.id;
    var stripe_token = req.params.stripe_token;

    stripe.customers.create({

        description: 'Customer for ' + user,
        source: stripe_token

    }, function( err, customer ) {

        if ( err ) return next( err );
        if ( !req.stripe ) req.stripe = {};

        req.stripe.customer = customer;
        next();
    });
};

module.exports.createCharge = function( req, res, next ) {

    var user            = req.user.id;
    var stripe_customer = req.stripe.customer_id;
    var amount          = req.plan.amount;
    var name            = req.plan.name;

    stripe.charges.create({

        amount: amount,
        currency: 'cad',
        source: stripe_customer, // Obtained with Stripe.js
        description: name + ' for ' + user

    }, function( err, charge ) {

        if ( err ) return next( err );
        if ( !req.stripe ) req.stripe = {};

        req.stripe.charge = charge;
        next();
    });
};
