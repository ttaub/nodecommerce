exports.up = function( knex, Promise ) {
    return knex.schema
        .table( 'users', function( userTable ) {
            userTable.text( 'stripe_token' );
        })
        .table( 'subscriptions', function( subscriptionTable ) {
            subscriptionTable.text( 'charge_token' );
        });
};

exports.down = function( knex, Promise ) {

    // These have to be in reverse order
    return knex.schema
        .table( 'users', function( userTable ) {
            userTable.dropColumn( 'stripe_token' );
        })
        .table( 'subscriptions', function( subscriptionTable ) {
            subscriptionTable.dropColumn( 'charge_token' );
        });
};
