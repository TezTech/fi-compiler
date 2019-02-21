/*
length(map xx)    => nat
length(list xx)		=> nat
length(set xx)		=> nat
length(string xx)	=> nat
length(bytes xx)	=> nat
xx.length()				=> nat
*Note xx is of type list, map or set, string or bytes
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : [], type : ['nat']};
		if (op.length != 1) throw "Invalid arguments for function length, expects 1";
		var val = core.compile.code(op.shift());
		if (['map','list','set','string','bytes'].indexOf(val.type[0]) < 0) throw "Invalid type for length, expects map, list, set, string or bytes not " + val.type[0];
		ret.code = val.code;
		ret.code.push("SIZE");
		return ret
	}
};