'use strict';

var databaseUser     = process.env.DB_USER     || 'dev';
var databasePassword = process.env.DB_PASSWORD || null;

var database         = {
    client: 'postgresql',
    connection: {
        host:     'localhost',
        user:     databaseUser,
        password: databasePassword
    },
    pool: {
        min: 0,
        max: 8
    }
};

if ( process.env.NODE_ENV === 'staging' )         database.connection.database = 'staging';
else if ( process.env.NODE_ENV === 'production' ) database.connection.database = 'production';
else if ( process.env.NODE_ENV === 'testing' )    database.connection.database = 'test';
else                                              database.connection.database = 'dev';

module.exports.database = database;

// The url will eventually depend on environmental variables as well
module.exports.server = {

    port: 8000,
    url:  'http://localhost:8000'
};

module.exports.secret = 'Zx5CSaCgy8HykKpIQqjk';

var stripe = {
    secret: 'STRIPE_TOKEN_HERE'
};

module.exports.stripe = stripe;
