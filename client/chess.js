const w = 80;

let canvas;

/**
 * @type {Piece[][]}
 */
let board = [];

let selected;
let whiteTurn;
let colour = 'white';

const sprites = {};
const flippedSprites = {};

const spriteUrls = {
	normal: {
		whiteR: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
		whiteN: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
		whiteB: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
		whiteQ: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
		whiteK: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
		whitep: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',

		blackR: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
		blackN: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
		blackB: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
		blackQ: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
		blackK: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
		blackp: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
	},
	flipped: {
		whiteR: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Chess_mlt45.svg',
		whiteN: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Chess_Nlt45.svg',
		whiteB: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Chess_Blt45.svg',
		whiteQ: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_glt45.svg',
		whiteK: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Chess_flt45.svg',
		whitep: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Chess_hlt45.svg',

		blackR: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_mdt45.svg',
		blackN: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Chess_Ndt45.svg',
		blackB: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Chess_Bdt45.svg',
		blackQ: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Chess_gdt45.svg',
		blackK: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Chess_fdt45.svg',
		blackp: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Chess_hdt45.svg',
	},
};

function loadSprites() {
	Object.entries(spriteUrls.normal).forEach(([key, url]) => {
		sprites[key] = loadImage(url);
	});
	Object.entries(spriteUrls.flipped).forEach(([key, url]) => {
		flippedSprites[key] = loadImage(url);
	});
}

function preload() {
	loadSprites();
}

let flipped = false;

function reset() {
	board = [];
	whiteTurn = true;
	selected = {
		piece: null,
		x: 0,
		y: 0,
	};
	for (let i = 0; i < 8; i++) {
		board.push([null, null, null, null, null, null, null, null]);
	}
	for (let i = 0; i < 8; i++) {
		board[1][i] = new Piece('p', false); // Row 2
		board[6][i] = new Piece('p', true); // Row 7
	}

	board[0] = [
		// Row 1
		new Piece('R', false),
		new Piece('N', false),
		new Piece('B', false),
		new Piece('Q', false),
		new Piece('K', false),
		new Piece('B', false),
		new Piece('N', false),
		new Piece('R', false),
	];
	board[7] = [
		// Row 8
		new Piece('R', true),
		new Piece('N', true),
		new Piece('B', true),
		new Piece('Q', true),
		new Piece('K', true),
		new Piece('B', true),
		new Piece('N', true),
		new Piece('R', true),
	];
}

function setup() {
	canvas = createCanvas(8 * w, 8 * w);
	canvas?.elt.classList.add('hide');
	reset();
}

function draw() {
	if (flipped) {
		translate(width, height);
		rotate(PI);
	}
	background(200);
	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++) {
			noStroke();
			if ((x + y) % 2 == 0) {
				fill(150);
			} else {
				fill(50);
			}
			rect(x * w, y * w, w, w);
			fill(0);
			if (selected.x == x && selected.y == y && selected.piece != null) {
				fill(255, 0, 0, 127);
				rect(x * w, y * w, w, w);
			}
			board[y][x]?.show(x * w, y * w, w);
		}
	}
}

function moveSelected(x, y) {
	const current = board[y][x];
	if ((board[y][x]?.white != colour) == 'white') {
		selected.x = -1;
		selected.y = -1;
		return;
	}

	socket.emit('movePiece', {
		from: { x: selected.x, y: selected.y },
		to: { x, y },
		attack: current != null,
	});

	socket.off('movePieceReply');
	socket.on('movePieceReply', (data) => {
		if (!data.error) {
			const { piece } = selected;
			board[y][x] = piece;
			board[selected.y][selected.x] = null;
		} else {
			console.log(data.error);
		}
	});
}

function mouseClicked() {
	const x = flipped ? 7 - Math.floor(mouseX / w) : Math.floor(mouseX / w);
	const y = flipped ? 7 - Math.floor(mouseY / w) : Math.floor(mouseY / w);
	if (x < 0 || y < 0 || x > 7 || y > 7) {
		return;
	}
	if (canvas.elt.classList.contains('hide')) {
		return;
	}
	if ((board[y][x]?.white != colour) == 'white') {
		selected.x = -1;
		selected.y = -1;
		return;
	}

	// console.log(x, y, selected);
	if (selected.piece === null) {
		selected.piece = board[y][x];
		selected.x = x;
		selected.y = y;
	} else {
		moveSelected(x, y);
		selected.piece = null;
	}
	socket.emit('getUpdate');
}

function keyPressed() {
	if (key === 'x') {
		flipped = !flipped;
	} else if (key == 'r') {
		socket.emit('getUpdate');
	}
}

function startGame(currentBoard, colour) {
	reset();
	flipped = colour === 'black';
	colour = colour;
	updateBoard(currentBoard);
}

function updateBoard(boardUpdate, turn) {
	newBoard = [];
	for (let y in boardUpdate) {
		const row = [];
		for (let x in boardUpdate[y]) {
			if (boardUpdate[y][x] === null) {
				row.push(null);
				continue;
			}
			const { type, colour } = boardUpdate[y][x];
			row.push(new Piece(type, colour == 'white'));
		}
		newBoard.push(row);
	}
	board = newBoard;
	whiteTurn = turn === 'white';
}
