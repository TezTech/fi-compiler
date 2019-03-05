'use strict'

const fs = require('fs').promises
const path = require('path')
const compiler = require('../index')

const compileFile = async file => {
	const filePath = path.join(process.cwd(), file)
	const data = await fs.readFile(filePath, {
		encoding: 'utf-8'
	})
	return compiler.compile(data)
}

describe(`Compiler`, () => {
	const contracts = [
		'bigmap'
		, 'blank'
		, 'bool'
		, 'bytes'
		, 'input'
		, 'key'
		, 'key_hash'
		, 'list'
		, 'map'
		, 'mutez'
		, 'numbers'
		, 'optional'
		, 'set'
		, 'signature'
		, 'storage'
		, 'string'
		, 'timestamp'
	]

	const blankContract = `entry Blank(){}`

	contracts.forEach(contract => {
		it(`${contract} sample compiles correctly`, async () => {
			const compiled = await compileFile(`e2e/fi-samples/${contract}_test.fi`)
			expect(compiled).toMatchSnapshot()
		})
	})

	it(`has valid default config`, () => {
		const defaultConfig = {
			abi_format: 'compact'
			, ml_format: 'compact'
			, macros: true
		}
		const {config} = compiler.compile(blankContract)
		expect(config).toMatchObject(defaultConfig)
	})

	it(`throws on invalid config`, () => {
		expect(() => {
			compiler.compile(blankContract, {
				abi_format: 'bad'
			})
		})
		.toThrow()

		expect(() => {
			compiler.compile(blankContract, {
				ml_format: 'bad'
			})
		})
		.toThrow()

		expect(() => {
			compiler.compile(blankContract, {
				macros: 'bad'
			})
		})
		.toThrow()
	})
})
