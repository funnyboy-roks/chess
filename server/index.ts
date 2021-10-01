import express = require('express');
import { Server, Socket } from 'socket.io';
import Board from './Board';

const app = express();
const http = require('http').Server(app);
const io: Server = require('socket.io')(http);
require('dotenv').config();
const port = process.env.PORT || 3000;

type Connection = {
	name: string;
	board: number;
	socket: Socket;
	opponent: Connection;
}

// socketid : connection
const connections: Map<string, Connection> = new Map();

app.use(express.static('client'));

const boards: Board[] = [];

io.on('connection', (socket: Socket) => {
	console.log(`Connected - ${socket.id}`);

	const connection: Connection = {
		name: null,
		board: null,
		socket,
		opponent: null,
	};

	connections.set(socket.id, connection);

	socket.on('registerName', ({ username }) => {
		for (const connection of connections.values()) {
			if (connection.name === username) {
				socket.emit('registerNameReply', { error: 'Username already taken' });
				return;
			}
		}
		connection.name = username;
		console.log(`${socket.id} registered as ${username}.`)
		socket.emit('registerNameReply', { success: true });
	});

	socket.on('findOpponent', (data) => {
		const { name } = data;
		for (const c of connections.values()) {
			if (c.name === name) {
				if (c.opponent) {
					socket.emit('findOpponentError', { error: 'Player already in a game.' });
					return;
				}
				connection.opponent = c;
				c.opponent = connection;
				const boardId = boards.push(new Board()) - 1;
				connection.board = boardId;
				c.board = boardId;

				c.socket.emit('playerConnect', {
					opponent: connection.name
				});
				connection.socket.emit('playerConnect', {
					opponent: c.name
				});

				console.log(`${connection.name}(${socket.id}) connected with ${c.name}(${c.socket.id})!`)
				return;
			}
		}
		socket.emit('findOpponentError', {
			error: 'Name not found'
		});

	});

	socket.on('disconnect', () => {
		console.log(`Disconnected - ${socket.id}`);
		connections.delete(socket.id);
	});
});

http.listen(port, () => {
	console.log(`listening on http://localhost:${port}`);
});
