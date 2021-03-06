module.exports = function(core) {
	var _find = function(v, t) {
		var v = v.splice(0)
		const n = v.shift()
		const c = core.helper.findInObjArray(t, 'name', n)
		if (c < 0) {
			throw `Error with variable ${n}`
		}
		const cm = t.length
		if (v.length > 0) {
			nt = t[c].type
			const rinner = _find(v, core.map.struct[core.helper.findInObjArray(core.map.struct, 'name', nt[0])].type)
			const rt = rinner.ind.slice(0)
			rt.push([c, cm])
			return {
				ind: rt
				, type: rinner.type
			}
		}
		return {
			ind: [[c, cm]]
			, type: t[c].type
		}
	}
	const pairer = function(c, cm) {
		let r = ''
		if (c == 0 && cm == 1) {
			return r
		}
		r += 'D'.repeat(c)
		if (c < (cm - 1)) {
			r += 'A'
		}
		return r
	}
	const find = function(v) {
		const originalV = v; var v = v.split('.'); let tt; let t; let n; let rettype
		if (['storage', 'input'].indexOf(v[0]) >= 0) {
			t = v.shift()
		}
		else {
			t = 'temp'
		}
		if (t == 'storage') {
			tt = core.map.storage
		}
		else {
			tt = core.map.entry[core.currentCall][t]
		}
		if (v.length > 0) {
			try {
				const dd = _find(v, tt); var ind = dd.ind.reverse()
				rettype = dd.type
			}
			catch (e) {
				throw `Error: ${e} - for variable ${originalV}`
			}
			var c = 'C'; var a = ''
			for (let i = 0; i < ind.length; i++) {
				a += pairer(ind[i][0], ind[i][1])
			}
		}
		else {
			var c = 'C'; var a = ''
			rettype = [t]
		}
		if (t == 'temp') {
			c += 'A'
			c += a
			c += 'R'
			return {
				code: c
				, type: rettype
			}
		}
		if (core.map.entry[core.currentCall].temp.length > 0) {
			c += 'D'
		}
		if (t == 'input') {
			c += 'A'
			c += a
			c += 'R'
			return {
				code: c
				, type: rettype
			}
		}
		if (core.map.entry[core.currentCall].input.length > 0) {
			c += 'D'
		}
		if (t == 'storage') {
			c += 'D'
			c += a
			c += 'R'
			return {
				code: c
				, type: rettype
			}
		}
		throw 'error'
	}

	return {
		script: require('./compile/script')(core)
		, code: require('./compile/code')(core)
		, condition: require('./compile/condition')(core)
		, type: require('./compile/type')(core)
		, rawType(t) {
			return core.compile.type(core.parse.type(t))
		}
		, namedType: require('./compile/namedType')(core)

		// Helpers
		, operation() {
			let c = 'C'
			if (core.map.entry[core.currentCall].temp.length > 0) {
				c += 'D'
			}
			if (core.map.entry[core.currentCall].input.length > 0) {
				c += 'D'
			}
			c += 'AR'
			return [['DIP', ['DUP', c]], 'CONS', 'SWAP', `SET_${c}`]
		}
		, ml(a, b) {
			let code = a.toUpperCase()
			if (typeof b != 'undefined') {
				code = [a, b]
			}
			return code
		}
		, literal(t, v) {
			if (['bool'].indexOf(t) >= 0) {
				if (v.toLowerCase() === 'true') {
					return 'True'
				}
				else if (v.toLowerCase() === 'false') {
					return 'False'
				}
				throw 'Invalid value for bool'
			}
			else if (['set', 'map', 'big_map', 'contract', 'list', 'option'].indexOf(t) >= 0) {
				return v
			}
			else if (['bytes'].indexOf(t) >= 0) {
				return v
			}
			else if (['nat', 'int', 'mutez'].indexOf(t) >= 0) {
				if (isNaN(v)) {
					throw `NaN error: ${v}`
				}
				return parseInt(v)
			}
			else if (['string'].indexOf(t) >= 0) {
				return `"${v}"`
			}
			else if (['address', 'key', 'key_hash', 'signature'].indexOf(t) >= 0) {
				if (v.substr(0, 2) == '0x') {
					return v
				}
				return `"${v}"`
			}
			else if (['timestamp'].indexOf(t) >= 0) {
				if (!isNaN(v)) {
					return `"${v}"`
				}
				return parseInt(v)
			}
		}
		, error(e) {
			if (typeof e == 'string') {
				e = `string "${e}"`
			}
			else {
				e = `nat ${parseInt(e)}`
			}
			return [['IF_NONE', [`PUSH ${e}`, 'FAILWITH'], []]]
		}
		, getter(v) {
			const f = find(v)
			return {
				code: ['DUP', f.code]
				, type: f.type
			}
		}
		, setter(v) {
			const f = find(v)
			return {
				code: ['SWAP', `SET_${f.code}`]
				, type: f.type
			}
		}
	}
}
