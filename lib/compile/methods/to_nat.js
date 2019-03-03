/*
to_nat(mutez) => nat
to_nat(int) 	=> nat
*/
module.exports = function(core) {
	return function(op) {
		const ret = {
			code: []
			, type: ['nat']
		}
		if (op.length != 1) {
			throw 'Invalid arguments for function to_nat, expects 1'
		}
		const a1 = core.compile.code(op.shift())
		if (['mutez', 'int'].indexOf(a1.type[0]) < 0) {
			throw `Invalid type for to_nat, expects mutez, nat or int not ${a1.type[0]}`
		}
		ret.code = a1.code
		if (a1.type[0] == 'mutez') {
			ret.code.push(['DIP', ['PUSH mutez 1']])
			ret.code.push('EDIV')
			ret.code = ret.code.concat(core.compile.error('Error with casting'))
			ret.code.push('CAR')
		}
		else {
			ret.code.push('DUP')
			ret.code.push('GT')
			ret.code.push(['IF', [], ['PUSH string "Nat conversion not possible"', 'FAILWITH']])
			ret.code.push('ABS')
		}
		return ret
	}
}
