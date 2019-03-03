//
//
module.exports = function(core) {
	return function(op) {
		const ret = {
			code: []
			, type: false
		}
		if (op.length != 2) {
			throw 'Invalid arguments for function unpack, expects 2'
		}
		const bytes = core.compile.code(op.shift()); const type = op.shift()
		ret.code = bytes.code
		ret.code.push(`UNPACK ${core.compile.type(type)}`)
		ret.code = ret.code.concat(core.compile.error('Unable to unpack'))
		ret.type = type
		return ret
	}
}
