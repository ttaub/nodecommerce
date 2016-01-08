// **********
// * README *
// **********
// If you didn't read the readme.md file, go do it now
// This file shouldn't really be modified
// Any changes to the database should be made through a new migration
// The readme.md file has info on the proper way of doing that

exports.up = function( knex, Promise ) {
    return knex.schema
        .createTable(  'users', function( userTable ) {
            userTable.increments( 'id' ).primary();
            userTable.text( 'first_name' ).notNullable();
            userTable.text( 'last_name' ).notNullable();
            userTable.text( 'email' ).unique().notNullable();
            userTable.string( 'phone', 20 ).unique().notNullable();
            userTable.text( 'password' ).notNullable();
            userTable.boolean( 'admin' ).defaultTo( false ).notNullable();
        })
        .createTable(  'stores', function( storeTable ) {
            storeTable.increments( 'id' ).primary();
            storeTable.text( 'name' ).notNullable();
            storeTable.text( 'description' ).notNullable();
            storeTable.integer( 'code' ).unique().notNullable();
            storeTable.decimal( 'latitude' ).notNullable();
            storeTable.decimal( 'longitude' ).notNullable();
        })
        .createTable(  'plans', function( planTable ) {
            planTable.increments( 'id' ).primary();
            planTable.text( 'name' ).notNullable();
            planTable.text( 'description' ).notNullable();
            planTable.integer( 'max_beers' ).notNullable();
            planTable.integer( 'monthly_cost' ).notNullable();
            planTable.boolean( 'recurring' ).defaultTo( false ).notNullable();
        })
        .createTable(  'items', function( itemTable ) {
            itemTable.increments( 'id' ).primary();
            itemTable.text( 'name' ).notNullable();
            itemTable.text( 'description' ).notNullable();
            itemTable.integer( 'cost' ).notNullable();
        })
        .createTable(  'subscriptions', function( subscriptionTable ) {
            subscriptionTable.increments( 'id' ).primary();
            subscriptionTable.integer( 'beers_redeemed' ).defaultTo( 0 ).notNullable();
            subscriptionTable.timestamp( 'created_at' ).defaultTo( knex.raw( 'now()' ) ).notNullable();
            subscriptionTable.boolean( 'active' ).defaultTo( true ).notNullable();
            subscriptionTable.integer( 'plan_id' ).references( 'id' ).inTable( 'plans' ).onDelete( 'cascade' ).notNullable();
        })
        .createTable(  'transactions', function( transactionTable ) {
            transactionTable.increments( 'id' ).primary();
            transactionTable.timestamp( 'time_redeemed' ).notNullable();
            transactionTable.integer( 'subscription_id' ).references( 'id' ).inTable( 'subscriptions' ).onDelete( 'cascade' ).notNullable();
            transactionTable.integer( 'item_id' ).references( 'id' ).inTable( 'items' ).onDelete( 'cascade' ).notNullable();
            transactionTable.integer( 'store_id' ).references( 'id' ).inTable( 'stores' ).onDelete( 'cascade' ).notNullable();
        })
        .createTable(  'user_transactions', function( userTransactionTable ) {
            userTransactionTable.integer( 'user_id' ).references( 'id' ).inTable( 'users' ).onDelete( 'cascade' ).notNullable();
            userTransactionTable.integer( 'transaction_id' ).references( 'id' ).inTable( 'transactions' ).onDelete( 'cascade' ).notNullable();
        })
        .createTable(  'user_subscriptions', function( userSubscriptionTable ) {
            userSubscriptionTable.integer( 'user_id' ).references( 'id' ).inTable( 'users' ).onDelete( 'cascade' ).notNullable();
            userSubscriptionTable.integer( 'subscription_id' ).references( 'id' ).inTable( 'subscriptions' ).onDelete( 'cascade' ).notNullable();
        })
        .createTable(  'store_items', function( storeItemTable ) {
            storeItemTable.integer( 'store_id' ).references( 'id' ).inTable( 'stores' ).onDelete( 'cascade' ).notNullable();
            storeItemTable.integer( 'item_id' ).references( 'id' ).inTable( 'items' ).onDelete( 'cascade' ).notNullable();
        });
};

exports.down = function( knex, Promise ) {

    // These have to be in reverse order
    return knex.schema
        .dropTable( 'store_items' )
        .dropTable( 'user_subscriptions' )
        .dropTable( 'user_transactions' )
        .dropTable( 'transactions' )
        .dropTable( 'subscriptions' )
        .dropTable( 'items' )
        .dropTable( 'plans' )
        .dropTable( 'stores' )
        .dropTable( 'users' );
};
