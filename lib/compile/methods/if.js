/*
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		var condition = core.compile.condition(op.shift()), cc = core.compile.code(op.shift()), n, e = "";
		ret.code += condition;
		if (cc){
			ret.code += "IF{"+cc.code+"}{";
			e += "}";
			while(op.length){
				n = op.shift();
				if (n == "if"){
					condition = core.compile.condition(op.shift());
					cc = core.compile.code(op.shift());
					ret.code += condition;
					ret.code += "IF{"+cc.code+"}{";
					e += "}";
				} else {
					ret.code += core.compile.code(n).code;	
				}
			}
			ret.code += e;
			ret.code += ";";
		} else {
			ret.code += "IF{}{};";
		}
		return ret
	}
};