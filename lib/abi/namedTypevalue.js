/**
 * @overview    Transform parameter types and values to typevalue type
 */

'use strict'

const {isEmpty, isUndefined} = require('lodash')
const core = require('../core')
const {literal} = require('../compile')(core)

const isComplex = type => type.length > 1

/**
 * Transform parameter types and values to object with property indicating type
 * and value, value
 * @param  {Array} paramTypes	parameter types
 * @param  {Object} paramValues parameter values
 * @return {Object}             typevalue
 */
module.exports = (paramTypes, paramValues) => {
	if (isEmpty(paramTypes)) {
		return 'Unit'
	}

	const addSanitizedValue = param => {
		if (isUndefined(paramValues[param.name])) {
			throw new Error(`Parameter value for ${param.name} is missing.`)
		}

		if (isComplex(param.type)) {
			const [type] = param.type
			const value = paramValues[param.name]
			return {
				...param
				, value: literal(type, value)
			}
		}

		const [type] = param.type
		const value = paramValues[param.name]
		return {
			...param
			, value: literal(type, value)
		}
	}

	const paramTypesValues = paramTypes.map(addSanitizedValue)

	const result = paramTypesValues.reduce((accum, param, index) => {
		let head = ``
		let tail = ``

		if (isEmpty(param.type)) {
			head = `Unit `
		}
		else if (index + 1 === paramTypesValues.length) {
			head = `${param.value}`
			tail = ``
		}
		else {
			head = `(Pair ${param.value} `
			tail = `)`
		}

		return {
			head: `${accum.head}${head}`
			, tail: `${tail}${accum.tail}`
		}
	}, {
		head: ''
		, tail: ''
	})

	return `${result.head}${result.tail}`
}
