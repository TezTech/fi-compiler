module.exports = function(core) {
	var parse = function(script) {
		let escaped = false; let tokens = []; let token = []; let cc = ''; let val = ''; let instring = false; let incomment = false; let cl = 0; let bl = 0; let sl = 0; let append = false; let currentLine = 1; let currentChar = 1
		function throwError(e) {
			throw `${e} at line ${currentLine}, character ${currentChar}`
		}
		for (let i = 0; i < script.length; i++) {
			cc = script[i]
			if (cc == '\n') {
				currentLine++
				currentChar = 1
			}
			currentChar++
			if (incomment) {
				if (cc == '\n') {
					incomment = false
				}
				continue
			}
			else if (instring) {
				if (!escaped && cc == '"') {
					token.push(val)
					instring = false
					val = ''
					continue
				}
				else if (escaped) {
					escaped = false
				}
				else if (cc == '\\') {
					escaped = true
				}
			}
			else if (val == '' && (/\s/).test(cc)) {
				continue
			}
			else if (sl > 0) {
				if (cc == ']') {
					sl--
				}
				if (cc == '[') {
					sl++
				}
				if (sl == 0) {
					var t = token.pop()
					t += `[${val.trim()}]`
					token.push(t)
					val = ''
					continue
				}
			}
			else if (cl > 0) {
				if (cc == ')') {
					cl--
				}
				if (cc == '(') {
					cl++
				}
				if (cl == 0 || (cl == 1 && cc == ',')) {
					if (['if', 'assert'].indexOf(token[0]) >= 0) {
						if (cc == ',') {
							throwError('Syntax error in condition')
						}
						token.push(core.parse.condition(val.trim()))
					}
					else if (val.trim() != '') {
						token.push(parse(val.trim()))
					}
					else if (cc == ',') {
						throwError('Syntax error')
					}
					val = ''
					continue
				}
			}
			else if (bl > 0) {
				if (cc == '}') {
					bl--
				}
				if (cc == '{') {
					bl++
				}
				if (bl == 0) {
					token.push(parse(val.trim()))
					tokens.push(token)
					token = []
					val = ''
					continue
				}
			}
			else if (cc == '#') {
				if (val.trim() != '') {
					token.push(val.trim())
				}
				val = ''
				incomment = true
				continue
			}
			else if (cc == '"') {
				instring = true
				if (val.trim() != '') {
					token.push(val.trim())
				}
				val = ''
				continue
			}
			else if (cc == '[') {
				sl = 1
				if (val.trim() != '') {
					token.push(val.trim())
				}
				val = ''
				continue
			}
			else if (cc == '{') {
				bl = 1
				if (val.trim() != '') {
					if (val.trim() == 'else') {
						token = tokens.pop()
					}
					else {
						token.push(val.trim())
					}
				}
				val = ''
				continue
			}
			else if (cc == '(') {
				cl = 1
				if (val.trim() != '') {
					if (val.indexOf('.') > 0) {
						const vv = val.split('.')
						token.unshift(vv.pop())
						token.unshift('ext')
						val = vv.join('.')
						token.push(val.trim())
					}
					else {
						token.push(val.trim())
					}
				}
				val = ''
				continue
			}
			else if (cc == '=') {
				if (val.trim() != '') {
					token.push(val.trim())
				}
				if (token[0] != 'let') {
					token.unshift('set')
				}
				tokens.push(token)
				token = []
				append = true
				val = ''
				continue
			}
			else if (cc == ',') {
				token.push(val.trim())
				val = ''
				continue
			}
			else if (cc == ' ') {
				if (val == 'else') {
					token = tokens.pop()
				}
				else {
					token.push(val.trim())
				}
				val = ''
				continue
			}
			else if (cc == ';') {
				if (val != '') {
					token.push(val.trim())
				}
				if (token.length) {
					if (append) {
						var t = tokens.pop()
						t.push(token)
						tokens.push(t)
						append = false
					}
					else {
						tokens.push(token)
					}
				}
				token = []
				val = ''
				continue
			}
			val += cc
		}
		if (instring) {
			throw 'Syntax error, string not closed'
		}
		if (sl > 0) {
			throw 'Unclosed square bracket'
		}
		if (cl > 0) {
			throw 'Unclosed parenthesis'
		}
		if (bl > 0) {
			throw 'Unclosed curly bracket'
		}
		if (val.trim()) {
			token.push(val.trim())
		}
		if (token.length) {
			tokens.push(token)
		}
		if (tokens.length == 1) {
			tokens = tokens[0]
		}
		return tokens
	}
	return parse
}
