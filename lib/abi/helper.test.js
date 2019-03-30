/**
 * @overview    Helper tests
 */

'use strict'

const fs = require('fs').promises
const {isString, find, isUndefined} = require('lodash')
const debug = require('../debug')
const helper = require('./helper')
const encodeRawBytes = require('./encodeRawBytes')
const namedTypevalue = require('./namedTypevalue')
// const op_mapping = require('./op_mapping')
// const prim_mapping = require('./prim_mapping')
const sexp2mic = require('./sexp2mic')
// const typevalue = require('./typevalue')
const compiler = require('../../index')

let compiledContract = null
beforeAll(async done => {
	const testContract = await fs.readFile('e2e/fi-samples/input_test.fi', {
		encoding: 'utf-8'
	})
	compiledContract = compiler.compile(testContract)
	done()
})

describe('ABI Helpers', () => {
	it(`has required helpers`, () => {
		expect(helper).toHaveProperty('pack')
		expect(helper).toHaveProperty('namedTypevalue')
	})

	it(`encodes raw bytes`, () => {
		const encoded = encodeRawBytes()
		// console.log(encoded)
		// expect(encoded).toMatchSnapshot()
	})

	it(`converts sexp to michelson`, () => {
		const abi = JSON.parse(compiledContract.abi)
		const {input} = find(abi.entry, ['name', 'TestInputSimple'])
		const params = {
			boolLabel: 'true'
			, natLabel: 1234
			, intLabel: -5678
			, stringLabel: `string`
			, mutezLabel: 1000
			, addressLabel: `address`
			, keyLabel: `key`
			, pkhLabel: `pkh`
			, signatureLabel: `signature`
			, bytesLabel: `bytes`
		}
		const sexp = namedTypevalue(input, params, abi)
		// debug(sexp)
		const michelson = sexp2mic(sexp)
		// debug(michelson)
		// debug(simpleParamsSexp)
		// const michelson = sexp2mic(simpleParamsSexp)
		// debug(michelson)
	})

	it(`transforms s-epressions to michelson`, () => {

		const mic = sexp2mic('Unit(g()); Unit ')
		// console.log(mic)
		// expect(encoded).toMatchSnapshot()
	})
})
