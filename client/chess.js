const board = [];

const w = 40;
const setup = () => {
	const canvas = createCanvas(40 * 8, 40 * 8);
};

const draw = () => {
	background(100);
	for (let x = 0; x < 8; ++x) {
		for (let y = 0; y < 8; ++y) {
			rect(x * w * 40, y * w * 40, w, w);
		}
	}
};
