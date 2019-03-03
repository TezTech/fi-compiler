function formatMl(mla, ti, pretty) {
	if (typeof pretty == 'undefined') {
		pretty = false
	}
	if (pretty) {
		var bp = ' '; var sce = ' ; '
	}
	else {
		var bp = ''; var sce = ';'
	}
	var sce = ';'
	var mla = mla.slice(0)
	const ret = []; let cl
	for (let i = 0; i < mla.length; i++) {
		if (typeof mla[i] == 'string') {
			cl = mla[i]
		}
		else if (mla[i].length > 1) {
			cl = mla[i].shift()
			cl += `${bp}{${bp}`
			const cll = cl.length
			cl += formatMl(mla[i].shift(), ti + cll, pretty)
			cl += `${bp}}${bp}`
			if (mla[i].length) {
				if (pretty) {
					cl += `\n${(' ').repeat(ti + cll - 3)}`
				}
				cl += `${bp}{${bp}`
				cl += formatMl(mla[i].shift(), ti + cll, pretty)
				cl += `${bp}}${bp}`
			}
		}
		ret.push(cl)
	}
	if (pretty) {
		return ret.join(`${sce}\n${(' ').repeat(ti)}`)
	}
	return ret.join(sce)
}
function formatRemoveMacros(ml) {
	ml = ml.replace(/IFCMP(EQ|NEQ|LT|GT|LE|GE){/g, 'COMPARE;$1;IF{')
	return ml
}

module.exports = function(core) {
	return function(s, config) {
		const definitions = ['const', 'struct', 'storage', 'entry', 'function']; let allowDefault = false
		let tokens = (typeof s == 'string' ? core.parse.main(s) : s); let token; let def; let tokenMap
		if (typeof tokens[0] == 'string') {
			tokens = [tokens]
		}
		core.map = {}, core.currentCall = ''
		// Process definitions
		for (var i = 0; i < tokens.length; i++) {
			token = tokens[i].slice(0)
			def = token.shift()
			if (definitions.indexOf(def) < 0) {
				throw `Unexpected definition at root level: ${def}`
			}
			if (typeof core.map[def] == 'undefined') {
				core.map[def] = []
			}
			switch (def) {
			case 'const':
				var constant = {}
				constant.type = token.shift(), constant.name = token.shift(), constant.value = token.shift()
				core.map[def].push(constant)
				break
			case 'struct':
				var name = token.shift()
				core.map[def].push({
					name
					, type: core.parse.typeList(token)
				})
				break
			case 'storage':
				var type = token.shift(); var name = token.shift()
				core.map[def].push({
					name
					, type: core.parse.type(type)
				})
				break
			case 'entry':
				var n = token.shift()
				if (n == 'default') {
					allowDefault = true
					continue
				}
				var c = token.pop(); var t = []; var tid = []; var ni
				while (token.length) {
					ni = token.shift()
					t.push(ni)
					tid.push(ni[0])
				}
				var v = []; var cc = []
				if (typeof c[0] == 'string') {
					c = [c]
				}
				for (let ii = 0; ii < c.length; ii++) {
					if (c[ii][0] == 'let') {
						c[ii].shift()
						const tt = c[ii].shift(); const nn = c[ii][0]
						v.push({
							name: nn
							, type: core.parse.type(tt)
						})
						if (c[ii].length > 1) {
							c[ii].unshift('set')
						}
						else {
							continue
						}
					}
					cc.push(c[ii])
				}
				core.map[def].push({
					name: n
					, id: `0x${core.sha256(`${n}(${tid.join(',')})`).substr(0, 8)}`
					, input: core.parse.typeList(t)
					, temp: v
					, code: cc
				})

				break
			case 'function':
				throw 'Function is not currently supported'
				break
			}
		}
		if (typeof core.map.entry == 'undefined') {
			throw 'No defined entry calls'
		}

		if (core.map.entry.length <= 0) {
			throw 'No defined entry calls'
		}
		let mlstorage; const mlcode = []
		if (typeof core.map.storage != 'undefined') {
			mlstorage = core.compile.namedType(core.map.storage)
		}
		else {
			mlstorage = 'unit'
		}

		for (let ci = 0; ci < core.map.entry.length; ci++) {
			core.currentCall = ci
			let code = []
			if (core.map.entry[core.currentCall].input.length == 0) {
				code.push('DROP')
			}
			else {
				code.push('DUP')
				code.push('SIZE')
				code.push('PUSH nat 4')
				code.push('SWAP')
				code.push('SUB')
				code.push('DUP')
				code.push('GT')
				code.push(['IF', [], ['PUSH nat 102', 'FAILWITH']])
				code.push('ABS')
				code.push('PUSH nat 4')
				code.push('SLICE')
				code = code.concat(core.compile.error(101))

				code.push(`UNPACK ${core.compile.namedType(core.map.entry[core.currentCall].input)}`)
				code = code.concat(core.compile.error(103))
				code.push('PAIR')
			}

			if (core.map.entry[core.currentCall].temp.length != 0) {
				const nvs = []
				for (var i = 0; i < core.map.entry[core.currentCall].temp.length; i++) {
					nvs.unshift(core.compile.namedType([core.map.entry[core.currentCall].temp[i]]))
				}
				code.push(`NONE ${nvs[0]}`)
				if (nvs.length > 1) {
					for (i = 1; i < nvs.length; i++) {
						code.push(`NONE ${nvs[i]}`)
						code.push('PAIR')
					}
				}
				code.push('PAIR')
			}
			var cc = core.compile.code(core.map.entry[core.currentCall].code)
			code = code.concat(cc.code)

			// End of code, revert back to list operation:storage
			let ee = ''
			if (core.map.entry[core.currentCall].input.length) {
				ee += 'D'
			}
			if (core.map.entry[core.currentCall].temp.length) {
				ee += 'D'
			}
			if (ee) {
				code.push(`C${ee}R`)
			}
			mlcode.push(code)
		}

		// construct final michelson
		let ml = ''
		const mlarray = []; let cmlarray = []
		cmlarray.push('parameter bytes')
		cmlarray.push(`storage ${mlstorage}`)
		cmlarray.push(['code'])
		mlarray.push(cmlarray)
		cmlarray = []
		let toclose = 1

		cmlarray.push('DUP')
		cmlarray.push('CDR')
		cmlarray.push('NIL operation')
		cmlarray.push('PAIR')
		cmlarray.push('SWAP')
		cmlarray.push('CAR')

		if (allowDefault) {
			cmlarray.push('DUP')
			cmlarray.push('PUSH bytes 0x')
			cmlarray.push('COMPARE')
			cmlarray.push('EQ')
			cmlarray.push(['IF'])
			mlarray.push(cmlarray)
			cmlarray = []

			cmlarray.push('DROP')
			mlarray[mlarray.length - 1][mlarray[mlarray.length - 1].length - 1].push(cmlarray)
			cmlarray = []
			toclose++
		}
		cmlarray.push('DUP')
		cmlarray.push('PUSH nat 4')
		cmlarray.push('PUSH nat 0')
		cmlarray.push('SLICE')
		cmlarray = cmlarray.concat(core.compile.error(100))

		for (var i = 0; i < mlcode.length; i++) {
			cmlarray.push('DUP')
			cmlarray.push(`PUSH bytes ${core.map.entry[i].id}`)
			cmlarray.push('COMPARE')
			cmlarray.push('EQ')
			cmlarray.push(['IF'])
			mlarray.push(cmlarray)
			cmlarray = []

			cmlarray.push('DROP')
			cmlarray = cmlarray.concat(mlcode[i])
			mlarray[mlarray.length - 1][mlarray[mlarray.length - 1].length - 1].push(cmlarray)
			cmlarray = []
			toclose++
		}
		cmlarray.push('DROP')
		cmlarray.push('PUSH nat 400')
		cmlarray.push('FAILWITH')

		for (var i = 0; i < toclose; i++) {
			mlarray[mlarray.length - 1][mlarray[mlarray.length - 1].length - 1].push(cmlarray)
			cmlarray = mlarray.pop()
		}

		abi = core.map

		// Format config

		if (config.optimized_abi == 'compact') {
			if (typeof abi.function != 'undefined') {
				delete abi.function
			}
			if (typeof abi.const != 'undefined') {
				delete abi.const
			}
			for (var i = 0; i < abi.entry.length; i++) {
				delete abi.entry[i].temp
				delete abi.entry[i].code
			}
		}
		if (!config.macros) {
			// ml = formatRemoveMacros(ml);
		}
		if (config.ml_format == 'array') {
			ml = cmlarray
		}
		else if (config.ml_format == 'readable') {
			ml = formatMl(cmlarray, 0, true)
		}
		else {
			ml = formatMl(cmlarray, 0)
		}

		return {
			ml
			, abi: JSON.stringify(abi)
			, config
		}
	}
}
