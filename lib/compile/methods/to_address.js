/*
to_address(key)   		 => address
to_address(key_hash)   => address
to_address(contract _) => address
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : [], type : ['address']};
		if (op.length != 1) throw "Invalid arguments for function to_address, expects 1";
		var a1 = core.compile.code(op.shift());
		if (['contract', 'key_hash', 'key'].indexOf(a1.type[0]) < 0) throw "Invalid argument type for to_address, expects contract, key_hash or key not " + a1.type[0];
		ret.code = a1.code;
		if (a1.type[0] == "key_hash" || a1.type[0] == "key") {
			if (a1.type[0] == "key") {
				ret.code.push(core.compile.ml('hash_key'));
			};
			ret.code.push(core.compile.ml('implicit_account'));
		}
		ret.code.push(core.compile.ml('address'));
		return ret
	}
};