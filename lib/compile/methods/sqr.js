/*
sqr(mutez) 	=> mutez
sqr(nat) 		=> nat
sqr(int) 		=> int
*/
module.exports = function(core) {
	return function(op) {
		const ret = {
			code: []
			, type: false
		}
		if (op.length != 1) {
			throw 'Not enough arguments for sqr, expects 1'
		}
		const a1 = core.compile.code(op.shift())
		if (['nat', 'int', 'mutez'].indexOf(a1.type[0]) < 0) {
			throw `Invalid type for sqr, expects nat, int or mutez not ${a1.type[0]}`
		}
		ret.code = a1.code
		ret.code.push('DUP')
		ret.code.push('MUL')
		ret.type = a1.type
		return ret
	}
}
