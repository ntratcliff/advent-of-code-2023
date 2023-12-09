const fs = require('fs');

const input = fs.readFileSync('input/3.txt').toString().split('\n');

// create an array of all part numbers, their line number, and their start/end index 
const parts = input.reduce((a, l, i) => {

	const la = [];
	const regex = /\d+/g;

	while ((match = regex.exec(l)) != null) {
		la.push({
			number: parseInt(match[0]),
			startIndex: match.index,
			endIndex: match.index + match[0].length - 1
		});
	}

	a.push(la);
	return a;
}, []);

// now let's find symbols and add numbers adjacent to a sum
let sum = input.reduce((s, l, i) => {

	const regex = /[^\d\.]/g;

	while ((match = regex.exec(l)) != null) {
		// find parts on previous, current, and next lines that are adjacent and add to sum
		const si = match.index;
		for (let line = Math.max(i-1, 0); line <= Math.min(i+1, parts.length); line++) {
			parts[line].forEach((part) => {
				if (si >= part.startIndex - 1 && si <= part.endIndex + 1) {
					s += part.number;
				}
			});
		}
	}

	return s;
}, 0);

console.log(`P1: ${sum}`);

// find parts adjacent to a * symbol and add their product to a sum only if there are 2
sum = input.reduce((s, l, i) => {

	const regex = /\*/g;

	while ((match = regex.exec(l)) != null) {
		// find parts on previous, current, and next lines that are adjacent and add to array
		const si = match.index;
		const adj = [];
		for (let line = Math.max(i-1, 0); line <= Math.min(i+1, parts.length); line++) {
			parts[line].forEach((part) => {
				if (si >= part.startIndex - 1 && si <= part.endIndex + 1) {
					adj.push(part.number);
				}
			});
		}

		if (adj.length == 2) {
			s += adj[0]*adj[1];
		}
	}

	return s;
}, 0);

console.log(`P2: ${sum}`)