const socket = io();
const userInfo = document.querySelector('form#user-info');
const nameInfo = document.querySelector('#name-info');
const connectForm = document.querySelector('form#connect');
const startButton = document.querySelector('button#start-game');
let username;

socket.on('connect', () => {
	if (userInfo.classList.contains('hide')) {
		location.reload();
	}
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
		nameInfo.querySelector('#self-name').value = username;
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
	console.log(`Connected to ${opponent}!`);
	connectForm.classList.add('hide');
	nameInfo.classList.add('hide');
	startButton.classList.remove('hide');
});

startButton.addEventListener('click', () => {
	socket.emit('startGame');
});

socket.on('start', (data) => {
	startButton.classList.add('hide');
	const { board, colour } = data;
	canvas?.elt.classList.remove('hide');
	startGame(board, colour);
});

socket.on('update', ({ board, turn }) => {
	updateBoard(board, turn);
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
