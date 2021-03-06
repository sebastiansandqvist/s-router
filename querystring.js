// Notes:
// - Does not handle nested objects
// - Does not handle arrays of form a[0]=foo&a[1]=bar

// Accepts arrays of the following forms:
// a=foo&a=bar
// a[]=foo&a[]=bar
// both become: { a: ['foo', 'bar'] }

function parseQueryString(string) {

	if (string[0] === '?') {
		string = string.slice(1);
	}

	if (!string) {
		return {};
	}

	const result = {};
	const entries = string.split('&');

	entries.forEach(function(entry) {

		const split = entry.split('=');
		let key = decodeURIComponent(split[0]);
		let value = decodeURIComponent(split[1]);

		// TODO: add test
		if (value === 'true') { value = true; }
		else if (value === 'false') { value = false; }

		// if key is in array form `foo[]`, then convert it to `foo`
		// and force it to be an array
		// TODO: come up with more elegant expression of this logic
		if (key[key.length - 1] === ']' && key[key.length - 2] === '[') {
			key = key.slice(0, -2);
			if (result[key] === undefined) { result[key] = []; }
			if (Array.isArray(result[key])) { result[key].push(value); }
			else { result[key] = [result[key]].concat(value); }
		}
		else {
			// if there is already a value in result[key],
			// convert to array: 'a=foo&a=bar' => { a: ['foo', 'bar'] }
			result[key] = result[key] === undefined ? value : [result[key]].concat(value);
		}

	});

	return result;

}

export default parseQueryString;