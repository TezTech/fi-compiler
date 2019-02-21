//
//
module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: false
		}
		const condition = core.compile.condition(op.shift())
		ret.code = condition

		let er
		if (op.length) {
			er = core.compile.code(op.shift()).code
		}
		else {
			er = ['PUSH string "Failed assert"']
		}
		er.push('FAILWITH')

		ret.code.push(['IF', [], er])
		return ret
	}
}
