'use strict';

module.exports.boolean = function( variable ) {
    return ( variable === 'true' || variable === 'false' );
};

module.exports.createError = function( message, code ) {
    var err = new Error( message );
    err.code = code;
    return err;
};
