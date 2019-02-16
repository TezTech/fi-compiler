/*
delegate()
delegate(key_hash)
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		if (op.length > 1) throw "Invalid argument count for delegate - expecting 0 or 1";
		if (op.length) {
			var delegate = core.compile.code(op.shift());
			if (delegate.type[0] != "key_hash") throw "Invalid type for delegate, expecting key_hash not " + delegate.type[0];
			ret.code += delegate.code;
			ret.code += "SOME;";
		} else {
			ret.code += "NONE key_hash;";
		}
		ret.code += "SET_DELEGATE;";
		ret.code += core.compile.operation();
		return ret
	}
};