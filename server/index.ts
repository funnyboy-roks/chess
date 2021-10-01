import express = require('express');
import { Socket } from 'socket.io';
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('dotenv').config();
const port = process.env.PORT || 3000;


app.use(express.static('client'));

type UserInfo = {
	partner: string,
	socket: Socket,
}

// socket id : user info
const currentUsers: Map<string, UserInfo> = new Map();

io.on('connection', (socket: Socket) => {
	console.log(`Connected - ${socket.id}`);
	const user = {
		name: '',
		partner: null,
		socket,
	};
	currentUsers.set(socket.id, user);

	socket.on('join', (req) => {
		let error: string = '';

		if (currentUsers.has(req.partner)) {
			user.partner = req.partner;
		} else {
			error = 'User not found';
		}

		if (req.partner === socket.id) {
			error = 'You can\'t connect with yourself!'
		}

		socket.emit('joinResponse', {
			error,
			partner: error ? null : req.partner,
		});

		if (error) return;
		const partner = currentUsers.get(req.partner);
		partner.partner = socket.id;
		partner.socket.emit('connected', {
			partner: socket.id,
			message: `Now connected to ${socket.id}`,
		});
	});

	socket.on('chat', (req) => {
		currentUsers.get(user.partner)?.socket.emit('chat', req.message);
	});

	socket.on('disconnect', () => {
		console.log(`Disconnected - ${socket.id}`);
		if (currentUsers.has(socket.id)) {
			currentUsers.delete(socket.id);
		}
	});
});

http.listen(port, () => {
	console.log(`listening on http://localhost:${port}`);
});
