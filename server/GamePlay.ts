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
            colour: board.player1Colour
        });

        connection.opponent.socket.emit('start', {
            board: board.board,
            colour: board.player1Colour === 'white' ? 'black' : 'white'
        });
    });

    socket.on('movePiece', ({ from, to, attack }) => {
        const connection = users.connnections.get(socket.id);
        const board = boards[connection.boardId];

        board.movePiece(from, to, attack);

        connection.opponent.socket.emit('update', {
            board: board.board,
            turn: board.turn,
        });
    });
}

export const boards: Board[] = [];