//
//
module.exports = function(core){
 return function(op){
	 var ret = {code : [], type : false};
		var condition = core.compile.condition(op.shift());
		ret.code = condition;
		
		var er;
		if (op.length)
			er = core.compile.code(op.shift()).code;
		else
			er = ["PUSH string \"Failed assert\""];
		er.push("FAILWITH");
		
		ret.code.push(["IF", [], er]);
		return ret
	}
};