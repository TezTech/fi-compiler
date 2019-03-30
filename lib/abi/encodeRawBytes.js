/**
 * @overview    Encode raw bytes
 */

'use strict'

const BigNumber = require('bignumber.js')
const {TextEncoder} = require('text-encoding')
const op_mapping = require('./op_mapping')
const prim_mapping = require('./prim_mapping')

// const op_mapping_reversed =

const reverseOpMapping = mapping => {
	const result = {}
	for (const key in mapping) {
		result[mapping[key]] = key
	}
	return result
}

const op_mapping_reversed = reverseOpMapping(op_mapping)

const prim_mapping_reverse = {
	0: {
		false: '03'
		, true: '04'
	}
	, 1: {
		false: '05'
		, true: '06'
	}
	, 2: {
		false: '07'
		, true: '08'
	}
	, 3: {
		true: '09'
	}
}

const rec = function(input) {
	const result = []

	if (input instanceof Array) {
		result.push('02')
		const bytes = input.map(x => rec(x)).join('')
		const len = bytes.length / 2
		result.push(len.toString(16).padStart(8, '0'))
		result.push(bytes)
	}
	else if (input instanceof Object) {
		if (input.prim) {
			const args_len = input.args ? input.args.length : 0
			result.push(prim_mapping_reverse[args_len][Boolean(input.annots)])
			result.push(op_mapping_reversed[input.prim])
			if (input.args) {
				input.args.forEach(arg => result.push(rec(arg)))
			}

			if (input.annots) {
				const annots_bytes = input.annots.map(x => utility.buf2hex(new TextEncoder().encode(x))).join('20')
				result.push((annots_bytes.length / 2).toString(16).padStart(8, '0'))
				result.push(annots_bytes)
			}
		}
		else if (input.bytes) {
			const len = input.bytes.length / 2
			result.push('0A')
			result.push(len.toString(16).padStart(8, '0'))
			result.push(input.bytes)
		}
		else if (input.int) {
			const num = new BigNumber(input.int, 10)
			const positive_mark = num.toString(2)[0] === '-' ? '1' : '0'
			const binary = num.toString(2).replace('-', '')
			const pad = binary.length <= 6 ? 6 : ((binary.length - 6) % 7 ? binary.length + 7 - (binary.length - 6) % 7 : binary.length)

			const splitted = binary.padStart(pad, '0').match(/\d{6,7}/g)
			const reversed = splitted.reverse()

			reversed[0] = positive_mark + reversed[0]
			const num_hex = reversed.map((x, i) => parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
			.toString(16)
			.padStart(2, '0')).join('')

			result.push('00')
			result.push(num_hex)
		}
		else if (input.string) {
			const string_bytes = new TextEncoder().encode(input.string)
			const string_hex = [].slice.call(string_bytes).map(x => x.toString(16).padStart(2, '0'))
			.join('')
			const len = string_bytes.length
			result.push('01')
			result.push(len.toString(16).padStart(8, '0'))
			result.push(string_hex)
		}
	}
	return result.join('')
}

module.exports = input => {
	return `05${rec(input).toLowerCase()}`
}
