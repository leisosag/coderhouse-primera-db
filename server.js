const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
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
		const product = { socketId: socket.id, product: data };
		products.push(product);
		io.sockets.emit('products', products);
	});

	socket.on('new-message', function (data) {
		const message = { socketId: socket.id, message: data };
		messages.push(message);
		io.sockets.emit('messages', messages);
	});
});

app.get('/', (req, res) => res.render('form'));

const PORT = 8082;
const srv = server.listen(PORT, () =>
	console.log(`Servidor corriendo en el puerto ${srv.address().port}`)
);
srv.on('error', (err) => console.error(`Error en el servidor ${err}`));
