# Nodecommerce

 Nodecommerce is an express based ecommerce API which already includes:
* includes database migrations using the knex ORM
* integrated with the stripe payments API
* mocha and chai unit tests along with codecoverage with istanbul
* production grade logging with buynan
* secure user authentication system using json web tokens

#Code Style

1. Don't use more that one newline to separate blocks. It starts to look like crap after a while
2. Install jscs using npm: `(sudo) npm install -g jscs`, and use the `JSCS-Formatter` plugin for Sublime Text, or whatever the equivalent is for your editor of choice. More info on jscs can be found [here](https://medium.com/@addyosmani/auto-formatting-javascript-code-style-fe0f98a923b8)
3. The .jscsrc file is included with this repo. It is based on the wordpress styleguide, but is slightly modified
4. The jscs plugin may not always know best. For single line else statements, it'll always try to keep one single space, but aligning them may be desired. First format it and then align them
5. Always have newlines at the end of files. This is a *very* common style, and is also reccommended by git
6. Align code whenever possible. This can be done easily with the `Alignment` package for Sublime Text. Sublime Text's multiple cursor support (along with the `ctrl+d` shortcut to add the next instance of the highlighted word to the selection) also makes this easy
7. Single quotes, not double quotes. This should be enforced by jscs
8. Semicolons: Use them. Note when returning objects to have the bracket on the same line as the return keyword. JS's auto semicolon insertion will add the semicolon after the return, causing it to return null
9. Controls statement braces: Use them. The only exception should be when the only line inside the statement is on the same line
10. `else` should go on the same line as the closing brace of the previous `if`
11. Comments: Should be used when the code isn't obvious. They should also be as snarky as possible. Multi line comments should be created through repeated single line comments. They should have a newline between them and the previous line
12. Chained methods: the first one goes on the same line as the object. The rest on new lines. They should all be at the same indentation level as the object, not one above. For example:  
```
// CORRECT
object.method1()
.method2()
.method3();

//INCORRECT
object.method1()
    .method2()
    .method3();
```

#Running Code

First, make sure you have created postgres databases called `dev` and `test`. Info on database users will be in the "Environmental Variables" section

Make sure you have the latest version of the database. Check the migrations repo and its readme for more info

###Environmental Variables:

1. NODE_ENV: If this is not specified, the default is development
2. DB_USER: If this is not specified, the default is "dev"
3. DB_PASSWORD: If this is not specified, the default is null

###Setting Up Packages

This is easily done with a simple `npm install`

###Running

This is also quite easy. A simple `npm start` will do. It can also be run through nodemon with `nodemon -x npm start`


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


