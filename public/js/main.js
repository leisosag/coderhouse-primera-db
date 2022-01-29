// const dayjs = require('dayjs');
let socket = io.connect();

socket.on('products', function (data) {
	renderProducts(data);
});

socket.on('messages', function (data) {
	renderMessages(data);
});

const renderProducts = (data) => {
	let row = `
		<th>Nombre</th>
		<th>Precio</th>
		<th>Thumbnail</th>
	`;
	row += data
		.map((item) => {
			return `
			<tr>
				<td>${item.product.name}</td>
				<td>${item.product.price}</td>
				<td class='table-image'><img class='img-thumbnail' src='${item.product.thumbnail}' alt='image'/></td>
			</tr>
		`;
		})
		.join(' ');
	document.getElementById('products').innerHTML = row;
};

const renderMessages = (data) => {
	let html = data
		.map((item) => {
			return `
				<div class='message col-md-12 mt-3 p-1'>
					<div class='row d-flex mt-2'>
						<p class='font-weight-bold mb-0 ml-4'>${item.message.email}</p>
						<p class='text-time mb-0 mx-2'>${item.message.time}</p>
					</div>
					<div class='row d-flex mt-2'>
					<p class='ml-4 mb-0 pb-1'>${item.message.text}</p>
					</div>
				</div>
			`;
		})
		.join(' ');
	document.getElementById('messages').innerHTML = html;
};

const addProduct = (e) => {
	let product = {
		name: document.getElementById('name').value,
		price: document.getElementById('price').value,
		thumbnail: document.getElementById('thumbnail').value,
	};
	socket.emit('new-product', product);
	return false;
};

const sendMessage = (e) => {
	let message = {
		email: document.getElementById('email').value,
		text: document.getElementById('message').value,
		time: dayjs().format('DD/MM/YYYY HH:mm:ss'),
	};
	socket.emit('new-message', message);
	document.getElementById('message').value = '';
	document.getElementById('message').focus();
	return false;
};
