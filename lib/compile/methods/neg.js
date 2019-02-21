/*
neg(nat) => int
neg(int) => int
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : [], type : ['int']};
		if (op.length != 1) throw "Not enough arguments for function neg, expects 1";
		var a1 = core.compile.code(op.shift());
		if (['nat', 'int'].indexOf(a1.type[0]) < 0) throw "Invalid type for neg, expects nat or int not " + a1.type[0];
		ret.code = a1.code;
		ret.code.push(core.compile.ml('neg'));
		return ret;
	}
};