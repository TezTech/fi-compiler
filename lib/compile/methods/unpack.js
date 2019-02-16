//
//
module.exports = function(core){
 return function(op){
		var ret = {code : "", type : false};
		if (op.length != 2) throw "Invalid arguments for function unpack, expects 2";
		var bytes = core.compile.code(op.shift()), type = op.shift();
		ret.code += bytes.code;
		ret.code += "UNPACK "+core.compile.type(type)+";";
		ret.code += core.compile.error("Unable to unpack");
		ret.type = type;
		return ret;
	}
};