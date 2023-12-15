const fs = require('fs');

const input = fs.readFileSync('input/15.txt').toString().split(',');

const sum = input.map(l => l.split('').reduce((hash, c) => (hash + c.charCodeAt(0)) * 17 % 256, 0))
	.reduce((s, v) => s += v);

console.log(`P1: ${sum}`);

const conf = input.reduce((boxes, op) => {
	const f = parseInt(op.at(-1));
	const label = op.substring(0, op.length - (isNaN(f) ? 1 : 2));
	const hash = label.split('').reduce((hash, c) => (hash + c.charCodeAt(0)) * 17 % 256, 0);

	if (isNaN(f)) { // instruction is -
		boxes[hash].delete(label);
	} else {
		boxes[hash].set(label, f);
	}

	return boxes;
}, Array(256).fill().map(_ => new Map()));

const power = conf.reduce((sum, m, i) => sum += [...m].reduce((p, l, s) => p += (i+1) * (s+1) * l[1], 0), 0); 

console.log(`P2: ${power}`);