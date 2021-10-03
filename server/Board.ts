import { Socket } from 'socket.io';
import { Location } from './types';

export default class Board {
    board: Piece[][];
    player1Colour: 'white' | 'black';
    turn: 'white' | 'black';
    player1: Socket;
    player2: Socket;

    constructor(player1: Socket, player2: Socket) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1Colour = 'white';
        this.turn = 'white';
    }

    startGame() {
        this.board = [];
        this.addPieces();
    }

    movePiece(from: Location, to: Location, attack: boolean) {
        const piece: Piece = this.board[from.y][from.x];
        if(piece.isValidMove(to.x - from.x, to.y - from.y, attack)) {
            this.board[to.y][to.x] = piece;
            this.board[from.y][from.x] = null;
            this.switchTurn();
        

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
type Color = 'white' | 'black';

export class Piece {
    type: PieceType;
    color: Color;
    moveCount: number;

    constructor(type: PieceType, color: Color) {
        this.type = type;
        this.color = color;
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
                if (attacking) {
                    return Math.abs(dx) == 1 && dy == 1;
                }
                return dx == 0 && (dy === 1 || (dy === 2 && this.moveCount === 0));
            case 'R':
                return Math.abs(dx) == 0 || Math.abs(dy) == 0;
            case 'N':
                return (Math.abs(dx) == 2 && Math.abs(dy) == 1) || (Math.abs(dx) == 1 && Math.abs(dy) == 2);
            case 'B':
                return Math.abs(dx) == Math.abs(dy);
            case 'Q':
                return Math.abs(dx) == 0 || Math.abs(dy) == 0 || Math.abs(dx) == Math.abs(dy);
            case 'K':
                return Math.abs(dx) == 1 || Math.abs(dy) == 1;
            default:
                return false;

        }

    }
}
