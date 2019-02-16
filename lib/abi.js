module.exports = function(core){
	var abi = {};
	helper = require("./abi/helper")(abi, core);
	return {
		load : function(a){
			if (typeof a == "string") a = JSON.parse(a);
			abi = a;
		},
		call : function(entry, data){
			var i = core.helper.findInObjArray(abi.entry, 'name', entry);
			if (i < 0) throw "Error with call";
			var entry = abi.entry[core.helper.findInObjArray(abi.entry, 'name', entry)];
			if (data.length == 1 && typeof data[0] == 'object') data = data[0];
			if (typeof data != "string"){
				data = helper.namedTypevalue(entry.input, data).toString();
			}
			return entry.id + helper.packData(data);
		}
	}
};

