/**
 * @overview    Transorm types and values into typevalues
 */

'use strict'

const core = require('../core')
const {literal} = require('../compile')(core)
const namedTypevalue = require('./namedTypevalue')
const {isString, isEmpty} = require('lodash')

const {Console} = require('console')
const debug = new Console({ stdout: process.stdout, stderr: process.stderr })

/* eslint-disable complexity */

/**
 * Transorm types and values into typevalues
 * @param  {Array} paramTypes  [description]
 * @param  {Array} paramValues [description]
 * @param  {Object} abi         [description]
 * @return {Object}             [description]
 */
module.exports = function typevalue(paramTypes, paramValues, abi) {
	// console.log(paramTypes)
	// console.log(paramValues)


	/*
	var paramTypes = paramTypes.slice(0)
	var paramValues = paramValues.slice(0)

	if (isString(paramTypes)) {
		paramTypes = [[paramTypes]]
	}

	if (isString(paramTypes[0])) {
		paramTypes = [paramTypes]
	}

	if (isEmpty(paramTypes)) {
		return 'Unit'
	}

	if (paramTypes.length === 1) {
		if (core.literalTypes.indexOf(paramTypes[0][0]) >= 0) {
			return literal(paramTypes[0][0], paramValues[0])
		}
		else if (paramTypes[0][0] === 'unit') {
			return 'Unit'
		}
		else if (core.complexTypes.indexOf(paramTypes[0][0]) >= 0) {
			return literal(paramTypes[0][0], paramValues[0])
		}

		return namedTypevalue(
			abi.struct[core.helper.findInObjArray(
				abi.struct
				, 'name'
				, paramTypes[0][0])].type
			, paramValues[0]
			, abi
		)
	}

	let ret = '(Pair '
	ret += typevalue([paramTypes.shift()], [paramValues.shift()], abi)
	ret += ' '

	let e = ''
	while (paramTypes.length > 1) {
		ret += '(Pair '
		ret += typevalue([paramTypes.shift()], [paramValues.shift()], abi)
		ret += ' '
		e += ')'
	}

	ret += typevalue([paramTypes.shift()], [paramValues.shift()], abi)
	ret += ')'
	ret += e

	debug.dir(ret, {depth: Infinity})
	return ret
	*/
}

