/*
to_some(option _) => _
*/
module.exports = function(core){
 return function(op){
		var ret = {code : "", type : ''};
		if (op.length != 1) throw "Invalid arguments for function, expects 1";
		var a1 = core.compile.code(op.shift());
		if (a1.type[0] != 'option') throw "Invalid type for to_some, expects optional value not "+a1.type[0];
		ret.code += a1.code;
		ret.code += "IF_NONE{PUSH string \"Optional value is empty\";FAILWITH}{};";
		ret.type = a1.type[1];
		return ret;
	}
};