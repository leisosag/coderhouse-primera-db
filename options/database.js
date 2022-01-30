const knexMariaDB = require('knex')({
	client: 'mysql',
	connection: {
		host: '127.0.0.1',
		port: 3306,
		user: 'root',
		password: '',
		database: 'ecommerce',
	},
});

const knexSQLite = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: './DB/mydb.sqlite',
	},
	useNullAsDefault: true,
});

// module.exports = { knexMariaDB };
module.exports = { knexMariaDB, knexSQLite };
