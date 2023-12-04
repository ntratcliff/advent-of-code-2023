const fs = require('fs');

const input = fs.readFileSync('input/4.txt').toString();

// create an array of matching numbers by card
const matches = input.split('\n').map(
	l => l.substring(l.indexOf(':') + 2).split('|').map(
		a => a.trim().split(/ +/).map(
			v => parseInt(v)
		)
	)
	.reduce((w, n) => n.filter(v => w.includes(v)).length)
);

// reduce to total score
console.log(`P1: ${matches.reduce((s, v) => s + Math.floor(Math.pow(2,v-1)), 0)}`);

// create an array of card counts
const copies = matches.reduce((ca, p, ci) => {
	// increment counts in ca from [ci+1...ci+p+1] by ca[ci]
	for (let i = ci; i < ci+p; i++) {
		ca[i+1] += ca[ci];
	}

	return ca;
}, new Array(matches.length).fill(1));

// reduce to total count
console.log(`P2 ${copies.reduce((s, v) => s + v)}`);
