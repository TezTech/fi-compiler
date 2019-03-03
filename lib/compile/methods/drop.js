/*
drop(xx, _ key)
xx.drop(_ key)
*Note xx is of type map, big_map or set
*/
module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: false
		}
		const vvName = op.shift(); const key = core.compile.code(op.shift()); const vv = core.compile.code(vvName)
		if (['map', 'big_map', 'set'].indexOf(vv.type[0]) < 0) {
			throw `Invalid type for drop, expecting map, big_map or set, not ${vv.type[0]}`
		}
		if (core.compile.type(key.type[0]) != core.compile.type(vv.type[1])) {
			throw `Invalid key type, expecting ${vv.type[1]} not ${key.type[0]}`
		}
		ret.code = key.code
		if (vv.type[0] == 'set') {
			ret.code.push(['DIP', ['PUSH bool False']])
		}
		else {
			ret.code.push(['DIP', [`NONE ${core.compile.type(vv.type[2])}`]])
		}
		ret.code.push(['DIIP', vv.code])
		ret.code.push('UPDATE')
		ret.code = ret.code.concat(core.compile.setter(vvName[0]).code)
		return ret
	}
}
