/*
concat(string, string, ...) 	=> string
concat(bytes, bytes, ...) 		=> bytes
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		if (op.length < 2) throw "Not enough arguments for function concat - expects at least two";
		var instr = core.compile.ml('concat'), a1 = core.compile.code(op.shift()), an;
		if (['string', 'bytes'].indexOf(a1.type[0]) < 0) throw "Invalid type for concat, expecting string or bytes not " + a1.type[0];
		ret.code += a1.code;
		ret.type = a1.type;
		while(op.length){
			an = core.compile.code(op.shift());
			if (an.type[0] != ret.type[0]) throw "Invalid type for concat, expecting " + ret.type[0] + " not " + an.type[0];
			ret.code += core.compile.ml("dip", an.code);
			ret.code += instr;
		}
		return ret;
	}
};