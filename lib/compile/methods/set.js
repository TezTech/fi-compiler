// auto-instruction
module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: false
		}
		if (op.length < 2) {
			throw 'Not enough arguments for function'
		}
		const vName = op.shift(); const v = core.compile.setter(vName); const val = core.compile.code(op.shift())
		if (core.compile.type(v.type) != core.compile.type(val.type)) {
			throw `Type mismatch for ${vName} - expecting ${v.type[0]} not ${val.type[0]}`
		}
		ret.code = val.code
		ret.code = ret.code.concat(v.code)
		return ret
	}
}
