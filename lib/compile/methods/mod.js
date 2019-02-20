/*
mod(int, int, ...) 			=> nat
mod(int, nat, ...)		  => nat
mod(nat, int, ...) 			=> nat
mod(nat, nat, ...) 			=> nat
mod(mutez, nat, ...) 		=> mutez
mod(mutez, mutez, ...) 	=> mutez
*/

var iotypes = {
	"int" : {
		"int" : "nat",
		"nat" : "nat",
	},
	"nat" : {
		"int" : "nat",
		"nat" : "nat",
	},
	"mutez" : {
		"nat" : "mutez",
		"mutez" : "mutez"
	}
};

module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		if (op.length < 2) throw "Not enough arguments, expects at least 2";
		var a1 = core.compile.code(op.shift()), an;
		if (typeof iotypes[a1.type[0]] == 'undefined') throw "Invalid type for mod, expects int, nat or mutez not " + a1.type[0];
		ret.type = a1.type;
		ret.code += a1.code;
		while(op.length){
			an = core.compile.code(op.shift());
			if (typeof iotypes[ret.type[0]][an.type[0]] == 'undefined') throw "Invalid type for mod " + an.type[0]
			ret.type = [iotypes[ret.type[0]][an.type[0]]];
			ret.code += core.compile.ml('dip', an.code);
			ret.code += "EDIV;IF_NONE{PUSH string \"Divisible by 0\";FAILWITH}{};CDR;";
		}
		return ret
	}
};