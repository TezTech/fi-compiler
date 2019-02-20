/*
div(int, int, ...) 			=> int
div(int, nat, ...)		  => int
div(nat, int, ...) 			=> int
div(nat, nat, ...) 			=> nat
div(mutez, nat, ...) 		=> mutez
div(mutez, mutez, ...) 	=> nat
*/

var iotypes = {
	int : {
		"int" : "int",
		"nat" : "int",
	},
	"nat" : {
		"int" : "int",
		"nat" : "nat",
	},
	"mutez" : {
		"nat" : "mutez",
		"mutez" : "nat"
	}
};

module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		if (op.length < 2) throw "Not enough arguments, expecting at least two";
		var a1 = core.compile.code(op.shift()), an;
		if (typeof iotypes[a1.type[0]] == 'undefined') throw "Invalid type for div, expecting int, nat or mutez, not " + a1.type[0];
		ret.type = a1.type;
		ret.code += a1.code;
		while(op.length){
			an = core.compile.code(op.shift());
			if (typeof iotypes[ret.type[0]][an.type[0]] == 'undefined') throw "Invalid type for div between " +ret.type[0]+" and "+an.type[0];
			ret.type = [iotypes[ret.type[0]][an.type[0]]];
			ret.code += core.compile.ml('dip', an.code);
			ret.code += "EDIV;IF_NONE{PUSH string \"Divisible by 0\";FAILWITH}{};CAR;";
		}
		return ret
	}
};