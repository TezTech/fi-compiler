let abi = {}
module.exports = function(core) {
	helper = require('./abi/helper')(core)
	return {
		load(a) {
			if (typeof a == 'string') {
				a = JSON.parse(a)
			}
			abi = a
		}
		, entry(entry, data) {
			const i = core.helper.findInObjArray(abi.entry, 'name', entry)
			if (i < 0) {
				throw 'Error with call'
			}
			var entry = abi.entry[core.helper.findInObjArray(abi.entry, 'name', entry)]
			if (typeof data != 'string') {
				data = helper.namedTypevalue(entry.input, data, abi).toString()
			}
			return entry.id + helper.packData(data)
		}
		, storage(data) {
			if (typeof data != 'string') {
				data = helper.namedTypevalue(abi.storage, data, abi).toString()
			}
			return data
		}
	}
}

