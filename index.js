var core = {
	map : {},
	abi : {},
	literalTypes : ['string','bool','int','nat', 'bytes', 'mutez','timestamp','address','key','key_hash','signature','operation', 'unit','pkh'],
	complexTypes : ['set','map','big_map','contract','list','option']
};


core.sha256 = require('js-sha256');
core.helper = require("./lib/helper");
core.parse = require("./lib/parse")(core);
core.compile = require("./lib/compile")(core);
core.abi = require("./lib/abi")(core);


module.exports = {
	compile: function(ml, config){
		if (typeof config == 'undefined') config = {};
		var _config = {
			abi_format : (typeof config.abi_format != 'undefined' ? config.abi_format : 'compact'), //compact/full
			ml_format : (typeof config.ml_format != 'undefined' ? config.ml_format : 'compact'), //compact, full, array
			macros : (typeof config.macros != 'undefined' ? config.macros : true),
		}		
		return core.compile.script(ml, _config)
	},
	abi : core.abi,
	version: "0.0.1b",
	_core : core,
};		

