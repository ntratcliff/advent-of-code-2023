const fs = require('fs');

const input = fs.readFileSync('input/10.txt').toString().split('\n').map(v => v.split(''));
const height = input.length, width = input[0].length;

const direction = { up: [0,-1], right: [1,0], down: [0,1], left: [-1, 0] };

const connections = {
	'|': [direction.up, direction.down],
	'-': [direction.left, direction.right],
	'L': [direction.up, direction.right],
	'J': [direction.up, direction.left],
	'7': [direction.left, direction.down],
	'F': [direction.right, direction.down],
	'.': [],
	'S': Object.values(direction)
}

function getSymbolAt(pos) {
	const [x,y] = pos;
	if (x < 0 || x >= width || y < 0 || y >= height) return undefined;
	return input[y][x];
}

function getPossibleConnections(pos) {
	return connections[getSymbolAt(pos)].map(p => p.map((v,i) => v += pos[i]));
}

function getAllAdjacencies(pos) {
	return Object.values(direction).map(p => p.map((v,i) => v += pos[i]));
}

function anyIncludes(posArr, pos) {
	for (let i = 0; i < posArr.length; i++) {
		if(posEquals(posArr[i], pos)) return true;
	}

	return false;
}

function posEquals(a, b) { return a[0] === b[0] && a[1] === b[1]; }

// start at S
const start = (() => {
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (input[y][x] === 'S') {
				return [x, y];
			}
		}
	}
})();

const positions = [[start]];
// build a linked list of the tube as we go 
do {
	// find positions of next connected pipes (should be 2)
	const prev = positions.length > 1 ? positions.at(-2) : undefined;
	const current = positions.at(-1);
	const found = current.reduce((f, pos) => {
		// get all possible connected positions 
		f.push(...getPossibleConnections(pos)
			// that
			.filter(p => 
				// have a symbol
				getSymbolAt(p) &&
				// can connect to us 
				anyIncludes(getPossibleConnections(p), pos) &&
				// and are not in the previous step 
				(!prev || !anyIncludes(prev, p)) &&
				// and are not in current found
				!anyIncludes(f, p)
			)
		);
		return f;
	}, []);

	positions.push(found);

	// continue the above until next connected set are the same 2 positions
} while (positions.at(-1).length == 2);


console.log(`P1: ${positions.length - 1}`);

// build a list of positions of the tube starting at S and travelling clockwise
const tube = [], secondHalf = [];
positions.forEach(ps => {
	tube.push(ps[0]);
	if (ps.length > 1){
		secondHalf.push(ps[1])
	}
});

tube.push(...secondHalf.reverse());

// starting at S, walk around the loop and note empty spaces on LHS and RHS
const lhs = [], rhs = [];

// note: making a teensy assumption that we shouldn't need to care about empty spaces near S for simplicity
for (let i = 1; i < tube.length; i++) {
	const current = tube[i];
	const last = tube[i-1];
	const delta = current.map((v, i) => v -= last[i]);
	const heading = Object.values(direction).findIndex(dir => dir.every((v, i) => v === delta[i]));

	const symbol = getSymbolAt(current);
	// we need to know which way we're going to determine what's on the lhs vs rhs
	// hack: ugh I hate this but it works and I don't have time to clean it up
	let ext, int;
	let extSl, intSl;
	switch(symbol) {
		case '|':
			extSl = [1];
			intSl = [3];
			if (heading == 0) {
				ext = rhs;
				int = lhs;
			} else {
				ext = lhs;
				int = rhs;
			}
			break;
		case '-':
			extSl = [0];
			intSl = [2];
			if (heading == 1) {
				ext = lhs;
				int = rhs;
			} else {
				ext = rhs;
				int = lhs;
			}
			break;
		case 'L':
			extSl = [2, 3];
			ext = (heading == 2) ? rhs : lhs;
			break;
		case 'J':
			extSl = [1, 2];
			ext = (heading == 2) ? lhs : rhs;
			break;
		case '7': 
			extSl = [0, 1];
			ext = (heading == 0) ? rhs : lhs;
			break;
		case 'F':
			extSl = [3, 0];
			ext = (heading == 0) ? lhs : rhs;
			break;
	}

	const adj = getAllAdjacencies(current);
	extSl?.forEach(v => {
		var p = adj[v];
		if (anyIncludes(tube, p) || anyIncludes(ext, p)) return;
		ext.push(p);
	});

	intSl?.forEach(v => {
		var p = adj[v];
		if (anyIncludes(tube, p) || anyIncludes(int, p)) return;
		int.push(p);
	})
}

// if any of the points are on the edge, then that's the outside of the loop
// note: I could do a bfs from each point to the edge until I do (or don't) find an edge point but there seems to be always 1 point on the edge :)
const search = lhs.some(pos => pos[0] == 0 || pos[0] == width - 1 || pos[1] == height - 1 || pos[1] == 0) ? rhs : lhs;

// visit each non-tube point adjacent to every point in the list 
const visited = [];
while (search.length > 0) {
	const current = search.pop();

	if (anyIncludes(visited, current)) continue;

	visited.push(current);
	search.push(...getAllAdjacencies(current).filter(p => !anyIncludes(tube, p)));
}

console.log(`P2: ${visited.length}`);