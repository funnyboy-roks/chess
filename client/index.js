const socket = io();
// const userInfo = document.querySelector('#user-info');
const joinForm = document.querySelector('#connect');
const output = document.querySelector('#output');
const chat = document.querySelector('#chat');

chat.innerHTML = `<p class="message left">Hello</p><br><p class="message right">Hi</p>`

socket.on('connect', () => {
	output.innerHTML += `<p>Connected to server! ID: ${socket.id}</p>
	<button id="copy-code">Copy</button>`;
	document.querySelector('#copy-code').addEventListener('click', () => {
		copy(socket.id);
	});
});

const copy = (text) => {
	navigator.clipboard.writeText(text);
};

document.querySelector('#send').addEventListener('click', () => {
	const message = document.querySelector('#input').value;
	if (!message) return;
	socket.emit('chat', { message });
	document.querySelector('#input').value = '';
	chat.innerHTML += `<p class="message right">${message}</p><br>`;
});

socket.on('chat', (message) => {
	chat.innerHTML += `<p class="message left">${message}</p><br>`;
});

socket.on('socketInfo', (test) => {
	console.log(`test - ${test}`);
	console.log(`socket id - ${socket.id}`);
});

socket.on('joinResponse', (res) => {
	if (res.error) {
		alert(res.error);
		return;
	}
	output.innerHTML += `<p>You are now connected with ${res.partner}</p>`;
});

socket.on('connected', (req) => {
	output.innerHTML += `<p>You are now connected with ${req.partner}</p>`;
});

joinForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const partner = document.querySelector('#code').value;
	socket.emit('join', { partner });
});
