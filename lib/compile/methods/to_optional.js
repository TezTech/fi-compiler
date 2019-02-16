/*
to_optional(_) => option _
*/
module.exports = function(core){
 return function(op){
		var ret = {code : "", type : ['option']};
		if (op.length != 1) throw "Invalid arguments for function, expects 1";
		var a1 = core.compile.code(op.shift());
		ret.code += a1.code;
		ret.code += core.compile.ml('some');
		ret.type.push(a1.type);
		return ret;
	}
};