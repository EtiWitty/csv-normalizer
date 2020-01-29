function sanitize(str) {
	// replace invalid UTF characters with \ufffd
	var surrogates = /[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
	return str.replace(surrogates , function ($0) {
		return $0.length > 1 ? $0 : '\ufffd';
	});
}

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
	function pad(number) {
		if (number < 10) {
		  return '0' + number;
		}
		return number;
	}
	let d = new Date(timestamp);
	const timeZoneOffset = 3 * 60 * 60 * 1000; // 3 hours between PST and EST
	d = new Date(+d + timeZoneOffset);

	// toISOString() of Date returns UTC.  We need to mock that for our own use.
	// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
	return d.getFullYear() +
        '-' + pad(d.getMonth() + 1) +
        '-' + pad(d.getDate()) +
        'T' + pad(d.getHours()) +
        ':' + pad(d.getMinutes()) +
        ':' + pad(d.getSeconds()) +
        '.' + (d.getMilliseconds() / 1000).toFixed(3).slice(2, 5);
}

function processAddress(address) {
	return sanitize(address);
}

function processZip(zip) {
	while (zip.length < 5) {
	 	zip = "0" + zip;
	}
	return zip;
}

module.exports = function(line) {
	const parts = splitToColumns(line);

	return [
		processTimestamp(parts[0]),
		processAddress(parts[1]),
		processZip(parts[2])
	]
}
