/*
slice(string, nat offset, nat length)	 => string
slice(bytes, nat offset, nat length)	 => bytes
*/
module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: ''
		}
		if (op.length != 3) {
			throw 'Invalid arguments for function slice, expects 3'
		}
		const v = core.compile.code(op.shift()); const offset = core.compile.code(op.shift()); const length = core.compile.code(op.shift())
		if (['bytes', 'string'].indexOf(v.type[0]) < 0) {
			throw `Invalid type, expecting bytes or string not ${v.type[0]}`
		}
		if (offset.type != 'nat') {
			throw `Invalid type for offset, expecting nat not ${offset.type}`
		}
		if (length.type != 'nat') {
			throw `Invalid type for length, expecting nat not ${length.type}`
		}

		ret.code = offset.code
		ret.code.push(['DIP', length.code])
		ret.code.push(['DIIP', v.code])
		ret.code.push(core.compile.ml('slice'))
		ret.code = ret.code.concat(core.compile.error('Unable to slice'))
		ret.type = v.type
		return ret
	}
}
