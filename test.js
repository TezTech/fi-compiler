const fs = require('fs').promises
const path = require('path')
const ficompiler = require('./index')

const tests = [
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

tests.forEach(test => {
	it(`Testing ${test}`, async () => {
		const compiled = await compileFile(`test/${test}_test.fi`)
		expect(compiled).toMatchSnapshot()
	})
})

async function compileFile(file) {
	const filePath = path.join(process.cwd(), file)
	const data = await fs.readFile(filePath, {
		encoding: 'utf-8'
	})
	return ficompiler.compile(data)
}