
function splitToColumns(line) {
	const parts = [];

	let lastSeenComma = 0;
	let isInQuote = false;
	for (let i=0; i<line.length; i++) {
		if (line[i] === '"') {
			isInQuote = !isInQuote;
		} else if (line[i] === "," && !isInQuote) {
			const currentToken = line.substring(lastSeenComma, i);
			parts.push(currentToken);
			lastSeenComma = i + 1;
		}
	}

	if (lastSeenComma != line.length - 1) {
		parts.push(line.substring(lastSeenComma, line.length));
	}
	return parts;
}

function processTimestamp(timestamp) {
	//convert to ISO 8601
	const newDate = new Date(timestamp).toISOString(); 	
	return newDate;
}

module.exports = function(line) {
	const parts = splitToColumns(line);

	return [
		processTimestamp(parts[0])
	]
}
