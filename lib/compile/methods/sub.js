/*
sub(int, int, ...) 							=> int
sub(int, nat, ...) 							=> int
sub(nat, int, ...) 							=> int
sub(nat, nat, ...) 							=> mutez 
sub(mutez, mutez, ...) 					=> mutez
sub(timestamp, int, ...) 				=> timestamp
sub(timestamp, timestamp, ...) 	=> timestamp
*/

var iotypes = {
	"int" : {
		"int" : "int",
		"nat" : "int",
	},
	"nat" : {
		"int" : "int",
		"nat" : "int" ,
	},
	"mutez" : {
		"mutez" : "mutez"
	},
	"timestamp" : {
		"int" : "timestamp",
		"timestamp" : "int"
	}
};

module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		if (op.length < 2) throw "Not enough arguments for function sub, expects at least 2";
		var instr = core.compile.ml('sub'), a1 = core.compile.code(op.shift()), an;
		if (typeof iotypes[a1.type[0]] == 'undefined') throw "Invalid type for sub, expects int, nat, mutez or timestamp";
		ret.type = a1.type;
		ret.code += a1.code;
		while(op.length){
			an = core.compile.code(op.shift());
			if (typeof iotypes[ret.type[0]][an.type[0]] == 'undefined') throw "Invalid type for sub " + an.type[0];
			ret.type = [iotypes[ret.type[0]][an.type[0]]];
			ret.code += core.compile.ml("dip", an.code);
			ret.code += instr;
		}
		return ret;
	}
};