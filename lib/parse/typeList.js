// Converts a list of named unparsed-types into an object of named parsed-types
// [['nat', 'age'],['string', 'name']]
module.exports = function(core) {
	return function(p) {
		const ret = []
		for (let i = 0; i < p.length; i++) {
			if (p[i].length <= 0) {
				continue
			}
			ret.push({
				name: p[i][1]
				, type: core.parse.type(p[i][0])
			})
		}
		return ret
	}
}
