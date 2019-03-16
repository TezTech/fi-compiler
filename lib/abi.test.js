'use strict'

const compiler = require('../index')
const abi = require('./abi')

describe('ABI', () => {
	const blankContract = `entry Blank(){}`
	const compiled = compiler.compile(blankContract)

	it(`loads valid ABI`, () => {
		expect(() => {
			abi.load(compiled.abi)
		}).not.toThrow()
		expect(compiled.abi).toMatchSnapshot()
	})

	it(`entry returns packed bytes`, () => {
		const input = {
			name: `Stephen`
		}
		expect(abi.entry(`Blank`, input)).toMatchSnapshot()
	})

	it(`returns storage`, () => {
		const data = 'sample data'
		expect(abi.storage(data)).toBe(data)
	})
})
