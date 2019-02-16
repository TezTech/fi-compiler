//auto-instruction
module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		if (op.length < 2) throw "Not enough arguments for function";
		var vName = op.shift(), v = core.compile.setter(vName), val = core.compile.code(op.shift());
		if (core.compile.type(v.type) != core.compile.type(val.type)) throw "Type mismatch for " + vName + " - expecting " + v.type[0] + " not " + val.type[0];
		ret.code += val.code;
		ret.code += v.code;
		return ret
	}
};