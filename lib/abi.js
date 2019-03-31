/**
 * @overview    ABI
 */

'use strict'

const {isString, find, isUndefined} = require('lodash')
const {namedTypevalue, pack} = require('./abi/helper')
let abi = {}

/**
 * ABI
 * @type {Object}
 */
module.exports = {
	load(a) {
		if (isString(a)) {
			abi = JSON.parse(a)
			return
		}

		abi = a
	}
	, entry(functionName, data) {
		const entry = find(abi.entry, ['name', functionName])

		if (isUndefined(entry)) {
			throw new Error(`Function "${functionName}" not found in ABI entry.`)
		}

		let newData = data

		if (!isString(data)) {
			newData = namedTypevalue(entry.input, data, abi)
		}

		return `${entry.id}${pack(newData)}`
	}
	, storage(data) {
		if (isString(data)) {
			return data
		}
		return namedTypevalue(abi.storage, data, abi).toString()
	}
}
