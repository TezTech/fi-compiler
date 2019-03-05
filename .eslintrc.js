'use strict'

module.exports = {
	env: {
		browser: false
		, 'jest/globals': true
		, node: true
	}
	, extends: [
		'ayotte'
	]
	, plugins: ['jest']
}
