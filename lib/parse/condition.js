module.exports = function(core) {
	return parseCondition = function(cond) {
		cond = cond.replace(/!=/g, 'neq')
		cond = cond.replace(/<=/g, 'le')
		cond = cond.replace(/>=/g, 'ge')
		cond = cond.replace(/</g, 'lt')
		cond = cond.replace(/>/g, 'gt')
		cond = cond.replace(/==/g, 'eq')
		cond = cond.replace(/&&/g, 'and')
		cond = cond.replace(/\|\|/g, 'or')
		let escaped = false; let instring = false; const fna = []; let cfn = ''; const condArray = []; const current = []; var ret = ''; let cc = ''; let val = ''; let co = []; let cos = []; var ret = ''; const cmp = ''; let clevel = 0; const lhs = false; let cs = []; let op
		for (let i = 0; i < cond.length; i++) {
			cc = cond[i]
			if (instring) {
				if (escaped) {
					escaped = false
				}
				else if (cc == '\\') {
					escaped = true
				}
				else if (cc == '"') {
					cs.push(val)
					instring = false
					val = ''
					continue
				}
				val += cc
				continue
			}
			else if (val == '' && (/\s/).test(cc)) {
				continue
			}
			else if (clevel > 0) {
				if (cc == ')') {
					clevel--
				}
				if (cc == '(') {
					clevel++
				}
				if (clevel == 0) {
					if (cfn) {
						cs = (core.parse.main(`${cfn}(${val})`))
						cfn = ''
					}
					else {
						cs = parseCondition(val)
					}
					val = ''
					continue
				}
				val += cc
			}
			else if (cc == '"') {
				instring = true
				if (val.trim() != '') {
					cs.push(val.trim())
				}
				val = ''
				continue
			}
			else if (cc == '!') {
				co.unshift('neq')
				continue
			}
			else {
				if (cc == '(') {
					if (val) {
						cfn = val
					}
					val = ''
					clevel++
					continue
				}
				else if (cc == ' ') {
					if (['and', 'or'].indexOf(val) >= 0) {
						if (cs.length && co.length) {
							co.push(cs)
						}
						if (cs.length && !co.length) {
							co = cs
						}
						if (cos.length) {
							cos.push(co)
							cos = [val, cos]
						}
						else {
							cos = [val, co]
						}
						co = []
						cs = []
					}
					else
					if (['neq', 'le', 'ge', 'lt', 'gt', 'eq'].indexOf(val) >= 0) {
						co = [val, cs]
						cs = []
					}
					else {
						cs.push(val)
					}
					val = ''
					continue
				}
				val += cc
			}
		}
		if (val != '') {
			cs.push(val)
		}
		if (cs.length) {
			if (co.length) {
				co.push(cs)
			}
			else {
				cos.push(cs)
			}
		}
		if (co.length) {
			cos.push(co)
		}
		if (cos.length == 1) {
			cos = cos[0]
		}
		if (['neq', 'le', 'ge', 'lt', 'gt', 'eq', 'and', 'or'].indexOf(cos[0]) < 0) {
			cos = ['eq', cos]
		}
		return cos
	}
}
