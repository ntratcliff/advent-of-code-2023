const fs = require('fs');

const max = { "red": 12, "green": 13, "blue": 14};

const input = fs.readFileSync('input/2.txt').toString();

let sum = input.split('\n').reduce((s, l) => {
	const id = parseInt(l.match(/\d+/)[0]);

	const g = l.match(/\d+ \w+/g).reduce((g, m) => {
		const a = m.split(' ');

		g[a[1]] = Math.max(parseInt(a[0]), g[a[1]] ?? 0);

		return g;
	}, {});

	const k = Object.keys(g);

	for (let i = 0; i < k.length; i++) 
	{
		if (max[k[i]] < g[k[i]]) return s;
	}

	return s + id;
}, 0);

console.log(`P1: ${sum}`);

sum = input.split('\n').reduce((s, l) => {
	const g = l.match(/\d+ \w+/g).reduce((g, m) => {
		const a = m.split(' ');

		g[a[1]] = Math.max(parseInt(a[0]), g[a[1]] ?? 0);

		return g;
	}, {});

	return s + Object.keys(g).map(k => g[k]).reduce((a, v) => a * v);
}, 0);

console.log(`P2: ${sum}`);