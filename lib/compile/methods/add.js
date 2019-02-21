/*
add(int, int, ...) 				=> int
add(int, nat, ...) 				=> int
add(nat, int, ...) 				=> int
add(nat, nat, ...) 				=> nat
add(mutez, mutez, ...) 		=> mutez
add(timestamp, int, ...) 	=> timestamp
add(int, timestamp, ...) 	=> timestamp
*/

const iotypes = {
	int: {
		int: 'int'
		, nat: 'int'
		, timestamp: 'timestamp'
	}
	, nat: {
		int: 'int'
		, nat: 'nat'
	}
	, mutez: {
		mutez: 'mutez'
	}
	, timestamp: {
		int: 'timestamp'
	}
}

module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: false
		}
		if (op.length < 2) {
			throw 'Not enough arguments for function add, expects at least 2'
		}
		const instr = core.compile.ml('add'); const a1 = core.compile.code(op.shift()); let an
		if (typeof iotypes[a1.type[0]] == 'undefined') {
			throw `Invalid type for add, expects int, nat, mutez or timestamp not ${a1.type[0]}`
		}
		ret.type = a1.type
		ret.code = a1.code
		while (op.length) {
			an = core.compile.code(op.shift())
			if (typeof iotypes[ret.type[0]][an.type[0]] == 'undefined') {
				throw `Invalid type for add ${an.type[0]}`
			}
			ret.type = [iotypes[ret.type[0]][an.type[0]]]
			ret.code.push(['DIP', an.code])
			ret.code.push('ADD')
		}
		return ret
	}
}
