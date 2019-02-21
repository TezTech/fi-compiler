//
//
module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: false
		}
		if (op.length) {
			if (typeof op[0] == 'string') {
				ret.code = core.compile.code(op).code
			}
			else {
				ret.code = core.compile.code(op.shift()).code
			}
		}
		else {
			ret.code = ['UNIT']
		}
		ret.code.push('FAILWITH')
		return ret
	}
}
