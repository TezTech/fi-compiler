/**
 * @overview   Primitives mapping
 */

'use strict'

module.exports = {
	'00': 'int'
	, '01': 'string'
	, '02': 'seq'
	, '03': {
		name: 'prim'
		, len: 0
		, annots: false
	}
	, '04': {
		name: 'prim'
		, len: 0
		, annots: true
	}
	, '05': {
		name: 'prim'
		, len: 1
		, annots: false
	}
	, '06': {
		name: 'prim'
		, len: 1
		, annots: true
	}
	, '07': {
		name: 'prim'
		, len: 2
		, annots: false
	}
	, '08': {
		name: 'prim'
		, len: 2
		, annots: true
	}
	, '09': {
		name: 'prim'
		, len: 3
		, annots: true
	}
	, '0A': 'bytes'
}
