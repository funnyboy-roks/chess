/**
 * For game handling
 */

import { Socket } from 'socket.io';
import Board from './Board';
import * as users from './Users';


export const registerGameEvents = (socket: Socket) => {

    socket.on('startGame', (data) => {
        const connection = users.connnections.get(socket.id);
        const board = boards[connection.boardId];

        board.startGame();

        socket.emit('start', {
            board: board.board,
            colour: connection.colour,
        });

        connection.opponent.socket.emit('start', {
            board: board.board,
            colour: connection.opponent.colour,
        });
    });

    socket.on('movePiece', ({ from, to, attack }) => {
        const connection = users.connnections.get(socket.id);
        const board = boards[connection.boardId];

        const valid = board.movePiece(connection, from, to, attack);

        connection.opponent.socket.emit('update', {
            board: board.board,
            turn: board.turn,
        });

        connection.socket.emit('update', {
            board: board.board,
            turn: board.turn,
        });
        
        socket.emit('movePieceReply', {
            error: !valid ? 'Invalid Move!' : false,
        });
    });

    socket.on('getUpdate', () => {
        const connection = users.connnections.get(socket.id);
        const board = boards[connection.boardId];
        socket.emit('update', {
            board: board?.board,
            turn: board?.turn,
        });
    });
}

export const boards: Board[] = [];