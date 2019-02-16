/*
pack(_) => bytes
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : ['bytes']};
		if (op.length != 1) throw "Not enough arguments for function pack, expects 1";
		var a1 = core.compile.code(op.shift());
		if (!a1.type) throw "Stack error for function pack";
		ret.code += a1.code;
		ret.code += core.compile.ml('pack');
		return ret;
	}
};