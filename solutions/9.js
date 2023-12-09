const fs = require('fs');

const input = fs.readFileSync('input/9.txt').toString().split('\n').map(l => l.split(' ').map(v => parseInt(v)));

let sumNext = 0, sumPrev = 0;
input.forEach(history => {
	let eval = history;
	const lastValues = [], firstValues = [];

	do {
		const differences = [];
		lastValues.push(eval.at(-1));
		firstValues.push(eval[0]);

		for (let i = 1; i < eval.length; i++) {
			differences.push(eval[i] - eval[i-1]);
		}

		eval = differences;
	} while (!eval.every(v => v === 0));

	sumNext += lastValues.reduce((s, v) => s += v);
	sumPrev += firstValues.reverse().reduce((s, v) => s = v - s);
});

console.log(`P1: ${sumNext}`);
console.log(`P2: ${sumPrev}`);