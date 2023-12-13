const fs = require('fs');
const input = fs.readFileSync('input/13.txt').toString().split('\n\n').map(p => p.split('\n').map(l => l.split('')));

// returns the index of the row on the top side of a horizontal reflection in the pattern
function findReflection (pattern) {
	// scan forward until the current line is the same as the previous
	for (let i = 1; i < pattern.length; i++) {
		if (pattern[i].every((v, c) => v === pattern[i-1][c])) {
			// scan forwards and backwards being sure every line matches until we reach either end of the pattern array
			let found = true;
			for (let s = i + 1; s < pattern.length && i-(s-i)-1 >= 0; s++) {
				if (!pattern[s].every((v, c) => v === pattern[i-(s - i)-1][c])) {
					found = false;
					break;
				}
			}

			if (found) return i - 1;
		}
	}

	return -1;
}

let sum = 0;
input.forEach(pattern => {
	// try to find a horizontal reflection
	const horizontal = findReflection(pattern) + 1;

	if (horizontal > 0) {
		sum += horizontal * 100;
		return;
	}

	// rotate the pattern array to try to find a vertical reflection
	const rotatedPattern = [];
	for (let c = 0; c < pattern[0].length; c++) {  
		const row = [];
		for (let r = pattern.length - 1; r >= 0; r--) {
			row.push(pattern[r][c]);
		}
		rotatedPattern.push(row);
	}

	const vertical = findReflection(rotatedPattern) + 1;

	sum += vertical;
});

console.log(`P1 ${sum}`);

function countDiff(pattern, ai, bi) {
	let differences = 0;
	pattern[ai].forEach((v, c) => {
		if (v !== pattern[bi][c]) {
			differences++;
		}
	});

	return differences;
}

function findReflectionWithSmudge(pattern, excludeRow) {
	// scan forward until the current line is different by no more than one character
	for (let i = 1; i < pattern.length; i++) {

		if (i - 1 === excludeRow) continue;

		let differences = countDiff(pattern, i, i - 1);
		if (differences <= 1) {
			// scan forwards and backwards being sure every line matches until we reach either end of the pattern array
			differences = 0;
			for (let s = i; s < pattern.length && i-(s-i)-1 >= 0 && differences <= 1; s++) {
				differences += countDiff(pattern, s, i-(s-i)-1);
			}

			if (differences <= 1) return [i - 1, differences];
		}
	}

	return [-1, -1];
}

sum = 0;
input.forEach(pattern => {
	// try to find a horizontal reflection
	const [r, hDiff] = findReflectionWithSmudge(pattern, findReflection(pattern));
	if (hDiff === 1) {
		sum += 100 * (r + 1);
		return;
	}

	// rotate the pattern array to try to find a vertical reflection
	const rotatedPattern = [];
	for (let c = 0; c < pattern[0].length; c++) {  
		const row = [];
		for (let r = pattern.length - 1; r >= 0; r--) {
			row.push(pattern[r][c]);
		}
		rotatedPattern.push(row);
	}

	const [c, _] = findReflectionWithSmudge(rotatedPattern, findReflection(rotatedPattern));

	sum += c + 1;
});

console.log(`P2 ${sum}`);