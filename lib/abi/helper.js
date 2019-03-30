/**
 * @overview    ABI Helpers
 */

'use strict'

const encodeRawBytes = require('./encodeRawBytes')
const namedTypevalue = require('./namedTypevalue')
const sexp2mic = require('./sexp2mic')

/**
 * ABI Helpers
 * @type {Object}
 */
module.exports = {
	pack(d) {
		return encodeRawBytes(sexp2mic(d))
	}
	, namedTypevalue
}
