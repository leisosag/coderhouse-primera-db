const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const { knexMariaDB } = require('./options/database');
const { knexSQLite } = require('./options/database');
let products = [];
let messages = [];

app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, './views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('*/js', express.static('public/js'));
app.use('*/css', express.static('public/css'));

io.on('connection', function (socket) {
	console.log('Conectado!');
	socket.emit('products', products);
	socket.emit('messages', messages);

	socket.on('new-product', function (data) {
		const productDB = {
			name: data.name,
			price: data.price,
			thumbnail: data.thumbnail,
			socketId: socket.id,
		};
		knexMariaDB('products')
			.insert(productDB)
			.then(() => console.log('Producto insertado'))
			.catch((err) => console.error(err))
			.finally(() => {
				knexMariaDB
					.from('products')
					.select('*')
					.then((rows) => {
						products = rows;
						io.sockets.emit('products', products);
					})
					.catch((err) => console.error(err));
			});
	});

	socket.on('new-message', function (data) {
		const messageDB = {
			email: data.email,
			text: data.text,
			time: data.time,
		};
		knexSQLite('messages')
			.insert(messageDB)
			.then(() => console.log('Mensaje insertado'))
			.catch((err) => console.error(err))
			.finally(() => {
				knexSQLite
					.from('messages')
					.select('*')
					.then((rows) => {
						messages = rows;
						io.sockets.emit('messages', messages);
					})
					.catch((err) => console.error(err));
			});
	});
});

app.get('/', (req, res) => res.render('form'));

const PORT = 8082;
const srv = server.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${srv.address().port}`);
	knexMariaDB.schema
		.dropTable('products')
		.then(() => console.log('Tabla products borrada'))
		.catch((err) => console.error(err));
	knexMariaDB.schema
		.createTable('products', (table) => {
			table.string('name');
			table.float('price');
			table.string('thumbnail');
			table.string('socketId');
			table.increments('id');
		})
		.then(() => console.log('Tabla products creada'))
		.catch((err) => console.error(err));
	knexSQLite.schema
		.dropTable('messages')
		.then(() => console.log('Tabla messages borrada'))
		.catch((err) => console.error(err));
	knexSQLite.schema
		.createTable('messages', (table) => {
			table.string('email');
			table.string('text');
			table.string('time');
			table.increments('id');
		})
		.then(() => console.log('Tabla messages creada'))
		.catch((err) => console.error(err));
});
srv.on('error', (err) => console.error(`Error en el servidor ${err}`));
