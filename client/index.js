const socket = io();
const userInfo = document.querySelector('form#user-info');
const nameInfo = document.querySelector('div#name-info');
const connectForm = document.querySelector('form#connect');
let username;

socket.on('connect', () => {
	document.querySelector('#self-name').value = socket.id;
	document.querySelector('#self-name-copy').addEventListener('click', (e) => {
		e.preventDefault();
		copy(username);
	});
});

userInfo.addEventListener('submit', (e) => {
	e.preventDefault();
	username = userInfo.querySelector('#name').value;
	socket.emit('registerName', { username });
});

socket.on('registerNameReply', (data) => {
	if (!data.error) {
		userInfo.classList.add('hide');
		connectForm.classList.remove('hide');
		nameInfo.classList.remove('hide');
	} else {
		alert(data.error);
	}
});

connectForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const oppName = connectForm.querySelector('#name').value;
	socket.emit('findOpponent', { name: oppName });
});

socket.on('findOpponentError', (data) => {
	alert(data.error);
});

socket.on('playerConnect', (data) => {
	const { opponent } = data;
	alert(`Connected to ${opponent}!`);
});

socket.on('start', (data) => {
	const { board, colour } = data;
	canvas?.elt.classList.remove('hide');
	startGame(board, colour);
});

const copy = (text) => {
	navigator.clipboard.writeText(text);
};

socket.on('socketInfo', (data) => {
	console.log(`test - ${data}`);
	console.log(`socket id - ${socket.id}`);
});

connectForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const partner = connectForm.querySelector('#name').value;
	socket.emit('join', { partner });
});
