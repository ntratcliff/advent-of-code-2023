const fs = require('fs');
const input = fs.readFileSync('input/16.txt').toString().split('\n').map(l => l.split(''));

function dirToCoord(dir) {
	switch (dir) {
		case 0: return [-1, 0];
		case 1: return [0, 1];
		case 2: return [1, 0];
		case 3: return [0, -1];
	}
}

function mod(v, m) {
	// js mod will return negative numbers so we have to do this
	return ((v % m) + m) % m;
}

function reflect(mirror, dir) {
	if (dir % 2 === 0) {
		return mod(dir + (mirror === '/' ? 1 : -1), 4);
	} else {
		return mod(dir + (mirror === '/' ? -1 : 1), 4);
	}
}

function move(photon, direction) {
	return {
		pos: dirToCoord(direction).map((v, i) => v += photon.pos[i]),
		dir: direction
	};
}

const contraption = input.map(r => r.map(v => ({ type: v, energized: false })));

// simulate the laser
function getEnergized(contraption, startingPhoton) {
	contraption = JSON.parse(JSON.stringify(contraption));
	const photons = [startingPhoton];
	const visited = new Set();

	while (photons.length > 0) {
		const photon = photons.pop();
		const [r, c] = photon.pos;
		const dir = photon.dir;

		// make sure r,c are valid
		if (r === contraption.length || r < 0 || c === contraption.length || c < 0) continue;

		const json = JSON.stringify(photon);
		// if we've already been here moving in the same or exact opposite direction
		if (visited.has(json)) continue;

		visited.add(json);

		const tile = contraption[r][c];

		tile.energized = true;

		// resolve our current tile
		if (tile.type === '.' || (tile.type === '|' && dir % 2 === 0) || (tile.type === '-' && (dir - 1) % 2 === 0)) {
			// continue moving in current direction
			photons.push(move(photon, dir));
		} else if (tile.type === '\\' || tile.type === '/') {
			// reflect based on direction
			let newDir = reflect(tile.type, dir);
			photons.push(move(photon, newDir));
		} else if (tile.type === '|') {
			// split vert
			photons.push(move(photon, 0));
			photons.push(move(photon, 2));
		} else if (tile.type === '-') {
			// split horiz
			photons.push(move(photon, 1));
			photons.push(move(photon, 3));
		}
	}

	return contraption;
}

function countEnergized(contraption) { return contraption.flat().reduce((s, v) => s += v.energized ? 1 : 0, 0); }

console.log(`P1 ${countEnergized(getEnergized(contraption, {pos: [0,0], dir: 1}))}`);

// find the most energized state
let highest = 0;
for (let r = 0; r < contraption.length; r++) {
	// check l/r sides
	highest = Math.max(
		countEnergized(getEnergized(contraption, {pos: [r, 0], dir: 1})),
		countEnergized(getEnergized(contraption, {pos: [r, contraption[0].length-1], dir: 3})),
		highest
	);
}

for (let c = 0; c < contraption[0].length; c++) {
	// check top/bottom
	highest = Math.max(
		countEnergized(getEnergized(contraption, {pos: [0, c], dir: 2})),
		countEnergized(getEnergized(contraption, {pos: [contraption.length-1, c], dir: 0})),
		highest
	);
}

console.log(`P2 ${highest}`)