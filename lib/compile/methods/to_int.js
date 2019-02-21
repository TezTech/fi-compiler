/*
to_int(mutez) => int
to_int(nat)		=> int
*/
module.exports = function(core) {
	return function(op) {
		const ret = {
			code: []
			, type: ['int']
		}
		if (op.length != 1) {
			throw 'Invalid arguments for function to_int, expects 1'
		}
		const a1 = core.compile.code(op.shift())
		if (['mutez', 'nat'].indexOf(a1.type[0]) < 0) {
			throw `Argument for to_int must be mutez, nat or int not ${a1.type[0]}`
		}
		ret.code = a1.code
		if (a1.type[0] == 'mutez') {
			ret.code.push(['DIP', ['PUSH mutez 1']])
			ret.code.push('EDIV')
			ret.code = ret.code.concat(core.compile.error('Error with casting'))
			ret.code.push('CAR')
		}
		ret.code.push('PUSH int 1')
		ret.code.push('MUL')
		return ret
	}
}
