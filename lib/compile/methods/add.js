/*
add(int, int, ...) 				=> int
add(int, nat, ...) 				=> int
add(nat, int, ...) 				=> int
add(nat, nat, ...) 				=> nat
add(mutez, mutez, ...) 		=> mutez
add(timestamp, int, ...) 	=> timestamp
add(int, timestamp, ...) 	=> timestamp
*/

var iotypes = {
	"int" : {
		"int" : "int",
		"nat" : "int",
		"timestamp" : "timestamp",
	},
	"nat" : {
		"int" : "int",
		"nat" : "nat",
	},
	"mutez" : {
		"mutez" : "mutez"
	},
	"timestamp" : {
		"int" : "timestamp"
	}
};

module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		if (op.length < 2) throw "Not enough arguments for function add, expects at least 2";
		var instr = core.compile.ml('add'), a1 = core.compile.code(op.shift()), an;
		if (typeof iotypes[a1.type[0]] == 'undefined') throw "Invalid type for add, expects int, nat, mutez or timestamp not " + a1.type[0];
		ret.type = a1.type;
		ret.code += a1.code;
		while(op.length){
			an = core.compile.code(op.shift());
			if (typeof iotypes[ret.type[0]][an.type[0]] == 'undefined') throw "Invalid type for add " + an.type[0];
			ret.type = [iotypes[ret.type[0]][an.type[0]]];
			ret.code += core.compile.ml("dip", an.code);
			ret.code += instr;
		}
		return ret;
	}
};