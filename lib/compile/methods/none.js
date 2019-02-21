//
//
module.exports = function(core) {
	return function(op) {
		const ret = {
			code: []
			, type: ['option']
		}
		const type = op.shift()
		ret.code = [`NONE ${core.compile.type(type)}`]
		ret.type.push(type)
		return ret
	}
}
