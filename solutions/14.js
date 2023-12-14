const fs = require('fs');
const input = fs.readFileSync('input/14.txt').toString().split('\n').map(l => l.split(''));

function rollH(a, r, c, d) {
	if (a[r][c] !== 'O') return -1;
	// move the rock the furthest in d we can
	let x;
	for (x = c + d; x >= 0 && x < a[r].length; x += d) {
		if (a[r][x] !== '.') break;
	}
	x -= d;

	if (x !== c) {
		a[r][c] = '.';
		a[r][x] = 'O';
	}

	return x;
}

function rollV(a, r, c, d) {
	if (a[r][c] !== 'O') return -1;

	// move the rock the furthest in d we can
	let y;
	for (y = r + d; y >= 0 && y < a.length; y += d) {
		if (a[y][c] !== '.') break;
	}
	y -= d;

	if (y !== r) {
		a[r][c] = '.';
		a[y][c] = 'O';
	}

	return y;
}

let shifted = input.slice();
let sum = shifted.reduce((s, l, r, a) => {
	l.forEach((_, c) => {
		let row = rollV(a, r, c, -1);
		if (row >= 0) {
			s += a.length - rollV(a, r, c, -1);
		}
	});

	return s;
}, 0);

console.log(`P1 ${sum}`);

// spin cycle
shifted = input.slice();
const cycles = 1000000000;
const seen = new Set();
let cycle;
let loopStart;
for (cycle = 0; cycle < cycles; cycle++) {
	// N
	shifted.forEach((l, c, a) => l.forEach((_, r) => rollV(a, r, c, -1)));

	// W
	shifted.forEach((l, c, a) => l.forEach((_, r) => rollH(a, r, c, -1)));

	// S
	for(let c = shifted.length - 1; c >= 0; c--) { 
		for(let r = shifted[c].length - 1; r >= 0; r--) {
			rollV(shifted, r, c, 1);
		}
	}

	// E
	for(let c = shifted.length - 1; c >= 0; c--) { 
		for(let r = shifted[c].length - 1; r >= 0; r--) {
			rollH(shifted, r, c, 1);
		}
	}

	// if we see a state we've seen before, then we know we're in a loop
	const state = shifted.map(r => r.join('')).join('\n');
	if (seen.has(state)) {
		// we loop at or after this state
		if (loopStart) break;
		loopStart = cycle;
		seen.clear();
	}

	seen.add(state);
}

// calculate load for the state at seen[((cycles-loopStart)%seen.size)-1]
sum = Array.from(seen).at(((cycles-loopStart)%seen.size)-1).split('\n').reduce((s, l, r, a) => s += l.split('').reduce((s, v) => s += v === 'O' ? a.length - r : 0, 0), 0);
console.log(`P2 ${sum}`);