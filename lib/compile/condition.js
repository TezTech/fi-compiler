module.exports = function(core) {
	return compileCondition = function(co) {
		if (co.length < 2 || co.length > 3) {
			throw 'Error with condition'
		}
		const com = co[0]; let lhs = co[1]
		if (['and', 'or', 'neq', 'le', 'ge', 'lt', 'gt', 'eq'].indexOf(lhs[0]) >= 0) {
			lhs = compileCondition(lhs)
		}
		else {
			lhs = core.compile.code(lhs).code
		}
		if (co.length == 2) {
			rhs = ['bool', 'True']
		}
		else {
			rhs = co[2]
		}
		if (['and', 'or', 'neq', 'le', 'ge', 'lt', 'gt', 'eq'].indexOf(rhs[0]) >= 0) {
			rhs = compileCondition(rhs)
		}
		else {
			rhs = core.compile.code(rhs).code
		}
		let code = lhs.concat([['DIP', rhs]])
		if (['and', 'or'].indexOf(com) >= 0) {
			code = code.concat([com.toUpperCase()])
		}
		else if (['neq', 'le', 'ge', 'lt', 'gt', 'eq'].indexOf(com) >= 0) {
			code = code.concat(['COMPARE', com.toUpperCase()])
		}
		return code
	}
}
