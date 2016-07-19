var path = require('path');

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname, './sqlite/db.sqlite')
    },
    useNullAsDefault : true
});

var bookshelf = require('bookshelf')(knex);

bookshelf.knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
        bookshelf.knex.schema.createTable('users', function (link) {
            link.increments('id').primary();
            link.string('username', 255).unique();
            link.string('user_id', 255);
        }).then(function (table) {
            console.log('Created Table', table);
        });
    }
});

module.exports = bookshelf;