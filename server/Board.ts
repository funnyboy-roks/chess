import { Socket } from 'socket.io';
import { Connection, Location } from './types';

export default class Board {
    board: Piece[][];
    turn: Colour;
    player1: Connection;
    player2: Connection;

    constructor(player1: Connection, player2: Connection) {
        this.player1 = player1;
        this.player2 = player2;

        this.player1.colour = 'white';
        this.player2.colour = 'black';
        
        this.turn = 'white';
    }

    startGame() {
        this.board = [];
        this.addPieces();
    }

    movePiece(connection: Connection, from: Location, to: Location, attack: boolean): boolean {
        const piece: Piece = this.board[from.y][from.x];
        if (
            (connection.colour === piece.colour) || // Move opponent Piece
            this.turn != piece.colour // Wrong turn
            ) {
            return false;
        }

        if (piece.isValidMove(to.x - from.x, to.y - from.y, attack)) {
            this.board[to.y][to.x] = piece;
            this.board[from.y][from.x] = null;
            this.switchTurn();

            return true;

        } else {
            return false;
        }
    }

    switchTurn() {
        this.turn = this.turn === 'white' ? 'black' : 'white';
    }


    private addPieces() {
        for (let i = 0; i < 8; i++) {
            this.board[i] = [];
            for (let j = 0; j < 8; j++) {
                this.board[i][j] = null;
            }
        }
        for (let i = 0; i < 8; i++) {
            this.board[1][i] = new Piece('p', 'white');
            this.board[6][i] = new Piece('p', 'black');
        }
        this.board[0][0] = new Piece('R', 'white');
        this.board[0][7] = new Piece('R', 'white');
        this.board[7][0] = new Piece('R', 'black');
        this.board[7][7] = new Piece('R', 'black');

        this.board[0][1] = new Piece('N', 'white');
        this.board[0][6] = new Piece('N', 'white');
        this.board[7][1] = new Piece('N', 'black');
        this.board[7][6] = new Piece('N', 'black');

        this.board[0][2] = new Piece('B', 'white');
        this.board[0][5] = new Piece('B', 'white');
        this.board[7][2] = new Piece('B', 'black');
        this.board[7][5] = new Piece('B', 'black');

        this.board[0][3] = new Piece('Q', 'white');
        this.board[7][3] = new Piece('Q', 'black');
        this.board[0][4] = new Piece('K', 'white');
        this.board[7][4] = new Piece('K', 'black');

    }
}

type PieceType = 'p' | 'R' | 'N' | 'B' | 'Q' | 'K';
type Colour = 'white' | 'black';

export class Piece {
    type: PieceType;
    colour: Colour;
    moveCount: number;

    constructor(type: PieceType, colour: Colour) {
        this.type = type;
        this.colour = colour;
        this.moveCount = 0;
    }

    /**
     * @param dx delta x
     * @param dy delta y
     * @param attacking is it an attacking move (mainly for pawns)
     * @returns if the move is valid
     */
    isValidMove(dx: number, dy: number, attacking: boolean): boolean {
        switch (this.type) {
            case 'p':
                const direction = (this.colour === 'white' ? 1 : -1);
                if (attacking) {
                    return Math.abs(dx) === 1 && dy === direction;
                }
                return (
                    dx == 0 && // Vertical Move
                    (dy === direction || // Move 1 step
                        (dy === 2 * direction && this.moveCount === 0) // Move two on first move
                    ));
            case 'R':
                return Math.abs(dx) === 0 || Math.abs(dy) === 0;
            case 'N':
                return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);
            case 'B':
                return Math.abs(dx) === Math.abs(dy);
            case 'Q':
                return Math.abs(dx) === 0 || Math.abs(dy) === 0 || Math.abs(dx) === Math.abs(dy);
            case 'K':
                return Math.abs(dx) === 1 || Math.abs(dy) === 1;
            default:
                return false;

        }

    }
}
