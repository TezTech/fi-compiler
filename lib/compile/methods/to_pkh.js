/*
to_pkh(key) => key_hash
*/
module.exports = function(core) {
	return function(op) {
		const ret = {
			code: []
			, type: ['key_hash']
		}
		if (op.length != 1) {
			throw 'Invalid arguments for function, expects 1'
		}
		const a1 = core.compile.code(op.shift())
		if (a1.type[0] != 'key') {
			throw `Invalid type for to_pkh, expects key not ${a1.type[0]}`
		}
		ret.code = a1.code
		ret.code.push('HASH_KEY')
		return ret
	}
}
