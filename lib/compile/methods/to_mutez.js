/*
to_mutez(int) 	=> mutez
to_mutez(nat)		=> mutez
*/
module.exports = function(core){
 return function(op){
		var ret = {code : "", type : ['mutez']};
		if (op.length != 1) throw "Invalid arguments for function to_mutez, expects 1";
		var a1 = core.compile.code(op.shift());
		if (['nat', 'int'].indexOf(a1.type[0]) < 0) throw "Argument for to_mutez must be mutez, nat or int not " + a1.type[0];
		ret.code += a1.code;
		if (a1.type[0] == 'int') {
			ret.code += "DUP;GT;IF{}{PUSH string \"Mutez conversion not possible\";FAILWITH};ABS;";
		}
		ret.code += core.compile.ml('dip', "PUSH mutez 1;"); 
		ret.code += core.compile.ml('mul'); 
		return ret;
	}
};