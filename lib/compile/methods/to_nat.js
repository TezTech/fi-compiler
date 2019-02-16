/*
to_nat(mutez) => nat
to_nat(int) 	=> nat
*/
module.exports = function(core){
 return function(op){
		var ret = {code : "", type : ['nat']};
		if (op.length != 1) throw "Invalid arguments for function to_nat, expects 1";
		var a1 = core.compile.code(op.shift());
		if (['mutez', 'int'].indexOf(a1.type[0]) < 0) throw "Invalid type for to_nat, expects mutez, nat or int not "+a1.type[0];
		ret.code += a1.code;
		if (a1.type[0] == 'mutez') {
			ret.code += core.compile.ml('dip', "PUSH mutez 1;"); 
			ret.code += "EDIV;" + compile.error("Error with casting") + "CAR;";
		} else {
			ret.code += "DUP;GT;IF{}{PUSH string \"Nat conversion not possible\";FAILWITH};ABS;";
		}
		return ret;
	}
};