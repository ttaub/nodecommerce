'use strict';

process.env.NODE_ENV = 'testing';

var config     = require( '../../config' );
var app        = require( '../../server' );
var _          = require( 'lodash' );
var request    = require( 'supertest' );
var expect     = require( 'chai' ).expect;
var knex       = require( 'knex' )( config.database );

describe( 'User route', function() {
    describe( 'Creation route', function() {
        var userTemplate = {
            'first_name': 'TestFirstName',
            'last_name':  'TestLastName',
            'email':      'TestEmail@Email.com',
            'phone':      '6474496598',
            'password':   'TestPassword'
        };

        it( 'Should create user when passed correct data', function( done ) {
            var user = _.clone( userTemplate );

            request( app ).post( '/user' )
            .send( user )
            .end( function( err, res ) {
                if ( err ) done( err );

                user.id = res.body.data.id;
                delete user.password;

                expect( res.body.status ).to.equal( 'success' );
                expect( res.body.data ).to.deep.equal( user );
                expect ( res.body.message ).to.equal( 'Created user' );
                done();
            });
        });

        it( 'Should return an error when duplicating emails', function( done ) {
            var user = _.clone( userTemplate );

            // Change the phone number to be different
            user.phone = '6474496599';

            request( app ).post( '/user' )
            .send( user )
            .end( function( err, res ) {
                if ( err ) done( err );

                expect( res.body.status ).to.equal( 'error' );
                expect( res.body.data ).to.be.null;
                expect( res.body.message ).to.equal( 'Email is already in use' );
                done();
            });
        });

        it( 'Should return an error when duplicating phone numbers', function( done ) {
            var user = _.clone( userTemplate );

            // Change the email to be different
            user.email = 'TestEmail2@Email.com';

            request( app ).post( '/user' )
            .send( user )
            .end( function( err, res ) {
                if ( err ) done( err );

                expect( res.body.status ).to.equal( 'error' );
                expect( res.body.data ).to.be.null;
                expect( res.body.message ).to.equal( 'Phone is already in use' );
                done();
            });
        });

        after( function( done ) {
            knex.delete()
            .from( 'users' )
            .then( function() {
                done();
            });
        });
    });
});
