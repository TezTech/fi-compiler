/**
 * @overview    Encode raw bytes
 */

'use strict'

const {invert, isArray, isObject} = require('lodash')
const BigNumber = require('bignumber.js')
const {TextEncoder} = require('text-encoding')

const operators = require('./operators')

const invertedOperators = invert(operators)
const invertedPrimitives = {
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

/* eslint-disable complexity, max-statements */
const byteEncode = micheline => {

	if (isArray(micheline)) {
		const bytesArray = ['02']
		const bytes = micheline.map(x => byteEncode(x)).join('')
		const len = bytes.length / 2
		bytesArray.push(len.toString(16).padStart(8, '0'))
		bytesArray.push(bytes)
		return bytesArray.join('')
	}

	if (isObject(micheline)) {
		const bytesArray = []
		if (micheline.prim) {
			const argsLen = micheline.args ? micheline.args.length : 0
			bytesArray.push(invertedPrimitives[argsLen][Boolean(micheline.annots)])
			bytesArray.push(invertedOperators[micheline.prim])
			if (micheline.args) {
				micheline.args.forEach(arg => bytesArray.push(byteEncode(arg)))
			}

			if (micheline.annots) {
				const annotsBytes = micheline.annots.map(x => utility.buf2hex(new TextEncoder().encode(x))).join('20')
				bytesArray.push((annotsBytes.length / 2).toString(16).padStart(8, '0'))
				bytesArray.push(annotsBytes)
			}
		}
		else if (micheline.bytes) {
			const len = micheline.bytes.length / 2
			bytesArray.push('0A')
			bytesArray.push(len.toString(16).padStart(8, '0'))
			bytesArray.push(micheline.bytes)
		}
		else if (micheline.int) {
			const num = new BigNumber(micheline.int, 10)
			const positiveMark = num.toString(2)[0] === '-' ? '1' : '0'
			const binary = num.toString(2).replace('-', '')
			const pad = binary.length <= 6 ? 6 : ((binary.length - 6) % 7 ? binary.length + 7 - (binary.length - 6) % 7 : binary.length)

			const splitted = binary.padStart(pad, '0').match(/\d{6,7}/g)
			const reversed = splitted.reverse()

			reversed[0] = positiveMark + reversed[0]
			const numHex = reversed.map(
				(x, i) => parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
				.toString(16)
				.padStart(2, '0')
			)
			.join('')

			bytesArray.push('00')
			bytesArray.push(numHex)
		}
		else if (micheline.string) {
			const stringBytes = new TextEncoder().encode(micheline.string)
			const stringHex = [].slice.call(stringBytes).map(x => x.toString(16).padStart(2, '0'))
			.join('')
			const len = stringBytes.length
			bytesArray.push('01')
			bytesArray.push(len.toString(16).padStart(8, '0'))
			bytesArray.push(stringHex)
		}
		return bytesArray.join('')
	}
}

module.exports = micheline => `05${byteEncode(micheline).toLowerCase()}`
