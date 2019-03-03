module.exports = function(core) {
	return function(p) {
		var p = p.slice(0)
		if (p.length == 0) {
			return 'unit'
		}
		const types = []
		while (p.length) {
			const tt = p.shift()
			types.push(tt.type)
		}
		return core.compile.type(types)
	}
}
