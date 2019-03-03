module.exports = function(core) {
	return compileType = function(p) {
		var p = p.slice(0)
		if (typeof p == 'string') {
			p = [[p]]
		}
		if (typeof p[0] == 'string') {
			p = [p]
		}
		if (p.length == 0) {
			return 'unit'
		}
		else if (p.length == 1) {
			if (core.literalTypes.indexOf(p[0][0]) >= 0) {
				return p[0][0]
			}
			else if (p[0][0] == 'unit') {
				return p[0][0]
			}
			else if (core.complexTypes.indexOf(p[0][0]) >= 0) {
				switch (p[0][0]) {
				case 'map':
					return `(map ${compileType([p[0][1]])} ${compileType([p[0][2]])})`
					break
				case 'big_map':
					return `(big_map ${compileType([p[0][1]])} ${compileType([p[0][2]])})`
					break
				case 'contract':
					return `(contract ${compileType([p[0][1]])})`
					break
				case 'list':
					return `(list ${compileType([p[0][1]])})`
					break
				case 'set':
					return `(set ${compileType([p[0][1]])})`
					break
				case 'option':
					return `(option ${compileType([p[0][1]])})`
					break
				}
			}
			else {
				return core.compile.namedType(core.map.struct[core.helper.findInObjArray(core.map.struct, 'name', p[0][0])].type)
			}
		}
		else {
			let ret = '(pair '
			ret += compileType([p.shift()])
			ret += ' '
			let e = ''
			while (p.length > 1) {
				ret += '(pair '
				ret += compileType([p.shift()])
				ret += ' '
				e += ')'
			}
			ret += compileType([p.shift()])
			ret += ')'
			ret += e
			return ret
		}
	}
}
