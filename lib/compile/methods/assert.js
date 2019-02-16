//
//
module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		var condition = core.compile.condition(op.shift());
		ret.code += condition;
		ret.code += "IF{}{";
		if (op.length)
			ret.code += core.compile.code(op.shift()).code;
		else
			ret.code += "PUSH string \"Failed assert\";";
		ret.code += "FAILWITH};";
		return ret
	}
};