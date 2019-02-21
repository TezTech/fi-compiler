/*
concat_ws(string sperator, string....) => string
*/
module.exports = function(core){
 return function(op){
		var ret = {code : [], type : ['string']};
		var sep = core.compile.code(op.shift());
		var a1 = core.compile.code(op.shift()), an;
		if (sep.type[0] != 'string') throw "Invalid type for seperator, expecting string not " + sep.type[0];
		if (a1.type[0] != 'string') throw "Invalid type for concat_ws, expecting string now " + a1.type[0];
		ret.code = a1.code;
		while(op.length){
			ret.code.push(['DIP', sep.code]);
			ret.code.push("CONCAT")
			an = core.compile.code(op.shift());
			if (an.type[0] != 'string') throw "Invalid type for concat, expecting string not " + an.type[0];
			
			ret.code.push(['DIP', an.code]);
			ret.code.push("CONCAT")
		}
		return ret
	}
};