/**
 * @overview    Helper tests
 */

'use strict'

const fs = require('fs').promises
const {find} = require('lodash')

const compiler = require('../../index')
const helper = require('./helper')
const encodeRawBytes = require('./encodeRawBytes')
const namedTypevalue = require('./namedTypevalue')
const sexp2mic = require('./sexp2mic')

let inputCompiledContract = null
let allCompiledContract = null

beforeAll(async done => {
	const inputTestContract = await fs.readFile('e2e/fi-samples/input_test.fi', {
		encoding: 'utf-8'
	})
	inputCompiledContract = compiler.compile(inputTestContract)

	const allTestContract = await fs.readFile('e2e/fi-samples/all_test.fi', {
		encoding: 'utf-8'
	})
	allCompiledContract = compiler.compile(allTestContract)
	done()
})

describe('ABI Helpers', () => {
	it(`has required helpers`, () => {
		expect(helper).toHaveProperty('pack')
		expect(helper).toHaveProperty('namedTypevalue')
	})

	it(`transforms input to sexp, micheline and raw bytes`, () => {
		const abi = JSON.parse(inputCompiledContract.abi)
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
		expect(sexp).toMatchSnapshot()

		const micheline = sexp2mic(sexp)
		expect(micheline).toMatchSnapshot()

		const rawBytes = encodeRawBytes(micheline)
		expect(rawBytes).toMatchSnapshot()
	})

	it(`transforms all to sexp, micheline and raw bytes`, () => {
		const abi = JSON.parse(allCompiledContract.abi)
		const input = null
		const params = null

		const sexp = namedTypevalue(input, params, abi)
		expect(sexp).toMatchSnapshot()

		const micheline = sexp2mic(sexp)
		expect(micheline).toMatchSnapshot()

		const rawBytes = encodeRawBytes(micheline)
		expect(rawBytes).toMatchSnapshot()
	})
})
