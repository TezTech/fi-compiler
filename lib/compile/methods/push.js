/*
push(xx, _ key, _ val)
xx.push(_ key, _ val)
*Note xx is of type list, map, big_map or set
*/
module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: false
		}
		const vName = op.shift()
		if (op.length == 2) {
			const map = core.compile.code(vName); const key = core.compile.code(op.shift()); var val = core.compile.code(op.shift())
			if (['map', 'big_map'].indexOf(map.type[0]) < 0) {
				throw `Invalid type for push, expects map or bigmap not ${map.type[0]}`
			}
			if (core.compile.type(key.type) != core.compile.type(map.type[1])) {
				throw `Invalid type for key expects ${map.type[1]} not ${key.type}`
			}
			if (core.compile.type(val.type) != core.compile.type(map.type[2])) {
				throw `Invalid type for value expects ${map.type[2]} not ${val.type}`
			}
			ret.code = key.code
			ret.code.push(['DIP', val.code.concat(['SOME'])])
			ret.code.push(['DIIP', map.code])
			ret.code.push(core.compile.ml('update'))
		}
		else if (op.length == 1) {
			const ls = core.compile.code(vName); var val = core.compile.code(op.shift())
			if (ls.type[0] == 'list') {
				if (core.compile.type(val.type[0]) != core.compile.type(ls.type[1])) {
					throw `Invalid value type for push, expects ${ls.type[1]} not ${val.type[0]}`
				}
				ret.code = val.code
				ret.code.push(['DIP', ls.code])
				ret.code.push(core.compile.ml('cons'))
			}
			else if (ls.type[0] == 'set') {
				if (core.compile.type(val.type[0]) != core.compile.type(ls.type[1])) {
					throw `Invalid value type for push, expects ${ls.type[1]} not ${val.type[0]}`
				}
				ret.code = val.code
				ret.code.push(['DIP', ['PUSH bool True']])
				ret.code.push(['DIIP', ls.code])
				ret.code.push(core.compile.ml('update'))
			}
			else {
				throw `Invalid type for push, expects map, big_map, list or set not ${ls.type[0]}`
			}
		}
		ret.code = ret.code.concat(core.compile.setter(vName[0]).code)
		return ret
	}
}
