/*
verify(bytes data, signature signature, key) => bool
*/
module.exports = function(core) {
	return function(op) {
		const ret = {
			code: []
			, type: ['bool']
		}
		if (op.length != 3) {
			throw 'Invalid arguments for verify function, expects 3'
		}
		const bytes = core.compile.code(op.shift()); const sig = core.compile.code(op.shift()); const key = core.compile.code(op.shift())

		if (key.type[0] != 'key') {
			throw `Invalid type for key, expecting key not ${key.type[0]}`
		}
		if (bytes.type[0] != 'bytes') {
			throw `Invalid type for data, expecting bytes not ${bytes.type[0]}`
		}
		if (sig.type[0] != 'signature') {
			throw `Invalid type for signature, expecting signature not ${sig.type[0]}`
		}

		ret.code = key.code
		ret.code.push(['DIP', sig.code])
		ret.code.push(['DIIP', bytes.code])
		ret.code.push('CHECK_SIGNATURE')
		return ret
	}
}
