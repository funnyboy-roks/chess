/**
 * For user handling
 */

import { Socket } from 'socket.io';
import { Connection, Colour } from './types';
import * as game from './GamePlay';
import Board from './Board';

export const connnections: Map<string, Connection> = new Map();

const findOpponent = (socket: Socket, connection: Connection, { name }: any) => {

    for (const c of connnections.values()) {
        if (c.name === name) {
            if (c.opponent) {
                socket.emit('findOpponentError', { error: 'Player already in a game.' });
                return;
            }
            const boardId = game.boards.push(new Board(c, connection)) - 1;

            connection.opponent = c;
            c.opponent = connection;

            connection.boardId = boardId;
            c.boardId = boardId;

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


}

export const connect = (socket: Socket) => {

    console.log(`Connected - ${socket.id}`);

    const connection: Connection = {
        name: null,
        boardId: null,
        socket,
        opponent: null,
        colour: 'white',
    };

    connnections.set(socket.id, connection);

    socket.on('registerName', ({ username }) => {
        for (const connection of connnections.values()) {
            if (connection.name === username) {
                socket.emit('registerNameReply', { error: 'Username already taken' });
                return;
            }
        }
        connection.name = username;
        console.log(`${socket.id} registered as ${username}.`)
        socket.emit('registerNameReply', { success: true });
    });

    socket.on('findOpponent', (data) => findOpponent(socket, connection, data));

    game.registerGameEvents(socket);

    socket.on('disconnect', () => {
        console.log(`Disconnected - ${socket.id}`);
        connnections.delete(socket.id);
    });
};