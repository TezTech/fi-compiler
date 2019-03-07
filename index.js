'use strict'

const core = {
	map: {}
	, abi: {}
	, literalTypes: [
		'address'
		, 'bool'
		, 'bytes'
		, 'int'
		, 'key'
		, 'key_hash'
		, 'mutez'
		, 'nat'
		, 'operation'
		, 'pkh'
		, 'signature'
		, 'string'
		, 'timestamp'
		, 'unit'
	]
	, complexTypes: [
		'big_map'
		, 'contract'
		, 'list'
		, 'map'
		, 'option'
		, 'set'
	]
}

core.sha256 = require('js-sha256')
core.helper = require('./lib/helper')
core.parse = require('./lib/parse')(core)
core.compile = require('./lib/compile')(core)
core.abi = require('./lib/abi')(core)

module.exports = {
	compile(ml, config = {}) {
		const {
			abi_format = 'compact'
			, ml_format = 'compact'
			, macros = true
		} = config

		if (abi_format && abi_format !== 'compact') {
			throw new Error(`${abi_format} is not a valid abi_format`)
		}

		if (ml_format && ml_format !== 'compact') {
			throw new Error(`${ml_format} is not a valid ml_format`)
		}

		if (macros && macros !== true) {
			throw new Error(`${macros} is not a valid macros`)
		}

		return core.compile.script(ml, {
			abi_format
			, ml_format
			, macros
		})
	}
	, abi: core.abi
	, version: '0.0.1b'
	, _core: core
}
