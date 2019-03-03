/*
in(xx, _ key) => bool
xx.in(_ key)	=> bool
*Note xx is of type map, big_map or set
*/
module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: ['bool']
		}
		if (op.length != 2) {
			throw 'Invalid arguments for function in, expects 2'
		}
		const vv = core.compile.code(op.shift()); const key = core.compile.code(op.shift())
		if (['map', 'big_map', 'set'].indexOf(vv.type[0]) < 0) {
			throw `Invalid type for in, expects map, big_map or set not ${vv.type[0]}`
		}
		if (core.compile.type(key.type[0]) != core.compile.type(vv.type[1])) {
			throw `Invalid key type, expects ${vv.type[1]} not ${key.type[0]}`
		}
		ret.code = key.code
		ret.code.push(['DIP', vv.code])
		ret.code.push('MEM')
		return ret
	}
}
