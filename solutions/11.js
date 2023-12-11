const fs = require('fs');

function countDistance(emptySpaceDist) {
	const input = fs.readFileSync('input/11.txt').toString().split('\n').map(v => v.split('').map(v => v === '.' ? 1 : v));

	// expand empty space
	for (let y = input.length - 1; y >=0; y--) {
		// all-space row
		if (input[y].some(v => v === '#')) continue;

		input[y].forEach((_, i) => input[y][i] = emptySpaceDist);
	}

	for (let x = input[0].length - 1; x >= 0; x--) {
		// check for an all-space column
		let galaxy = false;
		for (let y = 0; y < input.length; y++) {
			galaxy = input[y][x] === '#';
			if (galaxy) break;
		}

		if (galaxy) continue;

		// found an all-space column
		input.map(row => row[x] = emptySpaceDist);
	}

	// now let's find galaxies!
	const galaxies = [];
	input.forEach((row, y) => row.forEach((cell, x) => { 
		if (cell !== '#') return;
		row[x] = 1;
		// position of this galaxy is the sum of all values up to it in the row
		// and the sum of all values up to it in the column
		const pos = [];

		// x is easy
		pos.push(row.slice(0, x+1).reduce((s, v) => s += v));

		// y is a little more complicated
		pos.push(0);
		for (let yy = 0; yy <= y; yy++) {
			pos[1] += input[yy][x];
		}

		galaxies.push(pos); 
	}));

	// find distances between all pairs
	return galaxies.map((a, i) => 
			galaxies.slice(i+1)
			.map(b => b.reduce((s, c, i) => s += Math.abs(c - a[i]), 0)))
		.flat().reduce((s, v) => s += v);
}

// sum!
console.log(`P1 ${countDistance(2)}`);
console.log(`P2 ${countDistance(1000000)}`);