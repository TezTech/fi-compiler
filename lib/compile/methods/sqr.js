/*
sqr(mutez) 	=> mutez
sqr(nat) 		=> nat
sqr(int) 		=> int
*/
module.exports = function(core){
 return function(op){
		var ret = {code : "", type : false};
		if (op.length != 1) throw "Not enough arguments for sqr, expects 1";
		var a1 = core.compile.code(op.shift());
		if (['nat', 'int', 'mutez'].indexOf(at.type[0]) < 0) throw "Invalid type for sqr, expects nat, int or mutez not " + at.type[0];
		ret.code += a1.code;
		ret.code += "DUP;MUL;"
		ret.type = a1.type;
		return ret
	}
};