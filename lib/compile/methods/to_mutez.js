/*
to_mutez(int) 	=> mutez
to_mutez(nat)		=> mutez
*/
module.exports = function(core) {
	return function(op) {
		const ret = {
			code: []
			, type: ['mutez']
		}
		if (op.length != 1) {
			throw 'Invalid arguments for function to_mutez, expects 1'
		}
		const a1 = core.compile.code(op.shift())
		if (['nat', 'int'].indexOf(a1.type[0]) < 0) {
			throw `Argument for to_mutez must be mutez, nat or int not ${a1.type[0]}`
		}
		ret.code = a1.code
		if (a1.type[0] == 'int') {
			ret.code.push('DUP')
			ret.code.push('GT')
			ret.code.push(['IF', [], ['PUSH string "Mutez conversion not possible"', 'FAILWITH']])
			ret.code.push('ABS')
		}
		ret.code.push(['DIP', ['PUSH mutez 1']])
		ret.code.push(core.compile.ml('mul'))
		return ret
	}
}
