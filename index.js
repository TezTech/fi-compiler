var core = {
	map : {},
	literalTypes : ['string','bool','int','nat', 'bytes', 'mutez','timestamp','address','key','key_hash','signature','operation', 'unit','pkh'],
	complexTypes : ['set','map','big_map','contract','list','option']
};


core.sha256 = require('js-sha256');
core.helper = require("./lib/helper");
core.parse = require("./lib/parse")(core);
core.compile = require("./lib/compile")(core);
core.abi = require("./lib/abi")(core);


module.exports = {
	compile: core.compile.script,
	abi : core.abi,
	version: "0.0.1b",
	_core : core,
};		

