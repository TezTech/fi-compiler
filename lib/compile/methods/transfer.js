/*
transfer(contract _, mutez, *_)
transfer(address, mutez, *_)
transfer(key, mutez, *_)
transfer(key_hash, mutez, *_)
*/
module.exports = function(core){
 return function(op){
		var ret = {code : "", type : false};
		if (op.length < 2 || op.length > 3) throw "Invalid arguments for function transfer, expects 2 or 3";
		var to = core.compile.code(op.shift()),
		amt = core.compile.code(op.shift()), tt = ['unit'];
		
		if (['contract', 'address', 'key', 'key_hash'].indexOf(to.type[0]) < 0) throw "Invalid type for transfer to, expecting contract, address, key or key_hash not " + to.type[0];
		if (amt.type[0] != 'mutez') throw "Invalid type for amount, expecting mutez not " + amt.type[0];
		
		
		if (op.length){
			var param = core.compile.code(op.shift())
			ret.code += param.code;
			tt = param.type;
		} else {
			ret.code += "UNIT;";
		}
		
		ret.code += core.compile.ml('dip', amt.code);

		if (to.type[0] == 'key_hash' || to.type[0] == "key") {
			if (to.type[0] == "key") {
				to.code += core.compile.ml('hash_key');
			};
			to.code += core.compile.ml('implicit_account');
		} else if (to.type[0] == 'address') {
			to.code += "CONTRACT " + core.compile.type(tt) + ";" + core.compile.error("Invalid contract");
		}
		
		ret.code += core.compile.ml('diip', to.code);
		ret.code += "TRANSFER_TOKENS;";
		ret.code += core.compile.operation();
		return ret;
	}
};