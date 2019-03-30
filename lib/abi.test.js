/**
 * @overview    ABI unit tests
 */

'use strict'

const fs = require('fs').promises

const compiler = require('../index')
const abi = require('./abi')

// Jest can't do better than this at the moment for async setup.
// Had to resort to https://github.com/facebook/jest/issues/1256#issuecomment-230996710
let compiledContract = null

beforeAll(async done => {
	const testContract = await fs.readFile('e2e/fi-samples/input_test.fi', {
		encoding: 'utf-8'
	})
	compiledContract = compiler.compile(testContract)
	done()
})

describe('ABI', () => {
	it(`loads valid ABI`, () => {
		expect(() => {
			abi.load(compiledContract.abi)
		}).not.toThrow()
		expect(compiledContract.abi).toMatchSnapshot()
	})

	it(`entry returns packed bytes`, () => {
		expect(abi.entry(`TestInputSimple`, {
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
		})).toMatchSnapshot()

		// Complex input has not been implemented. Test should fail.
/*		expect(abi.entry(`TestInputComplex`, {
			mapLabel: {
				a: 1
				, b: 2
				, c: 3
			}
			, listLabel: [
				'string1'
				, 'string2'
				, 'string3'
			]
			, setLabel: [
				1
				, 2
				, 3
			]
		})).toMatchSnapshot()
*/	})

	it(`returns storage`, () => {
		const data = 'sample data'
		expect(abi.storage(data)).toBe(data)
	})
})
