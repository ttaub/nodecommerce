![alt tag](https://github.com/ttaub/nodecommerce/blob/master/nodecommerce.png?raw=true)

 Nodecommerce is an express based ecommerce API which already includes:
* includes database migrations using the knex ORM
* integrated with the stripe payments API
* mocha and chai unit tests along with istanbul code coverage
* production grade logging with buynan
* secure user authentication system using json web tokens

#Initialization

###Setting Up Packages

This is easily done with a simple `npm install`

###Running

This is also quite easy. A simple `npm start` will do. It can also be run through nodemon with `nodemon -x npm start`

###Environmental Variables:

1. NODE_ENV: If this is not specified, the default is development

#Using the knex migrations library

It must be installed globally: `(sudo) npm install -g knex`

The knexfile specifies the different settings for different environments  
The default is development

`knex -h` for help

#Running migrations

`knex migrate:latest` to apply all unapplied migrations

#Changing the database

To change something, create a new migration and make the edit in there. Don't edit any of the previously created migrations  
Unless you are 100% sure no one has applied it to their database

`knex migrate:make` to create a new migration

#Editing migrations

Migrations must return a promise. If you don't, the migration will be "run", which means it'll be marked as having been run, but it won't change the database

The "down" section should be in reverse order from the "up" section





