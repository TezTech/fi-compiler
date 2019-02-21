/*
get(xx, _ key) => _
xx.get(_ key)  => _
*Note xx is of type map, big_map
*/
module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: false
		}
		const map = core.compile.code(op.shift()); const key = core.compile.code(op.shift())
		if (['map', 'big_map'].indexOf(map.type[0]) < 0) {
			throw `Invalid type for get, expect map or big_map not ${map.type[0]}`
		}
		ret.code = key.code
		ret.code.push(['DIP', map.code])
		ret.code.push('GET')
		ret.code.push(['IF_NONE', ['PUSH string "Key not found in map"', 'FAILWITH'], []])
		ret.type = map.type[2]
		return ret
	}
}
