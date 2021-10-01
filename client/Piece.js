class Piece {
	constructor(type = ' ', white = true) {
		this.type = type;
		this.white = white;
	}

	show(x, y, w) {
		push();
		imageMode(CENTER);
		image(
			(flipped ? flippedSprites : sprites)[
				(this.white ? 'white' : 'black') + this.type
			],
			x + w / 2,
			y + w / 2,
			w * 0.8,
			w * 0.8
		);
		pop();
	}
}
