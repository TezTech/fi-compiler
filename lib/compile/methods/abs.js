/*
abs(int) => nat
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : [], type : ['nat']};
		if (op.length != 1) throw "Not enough arguments for function abs, expects 1";
		var a1 = core.compile.code(op.shift());
		if (a1.type[0] != 'int') throw "Invalid type for abs, expects int not " + a1.type[0];
		ret.code = a1.code;
		ret.code.push("ABS");
		return ret;
	}
};