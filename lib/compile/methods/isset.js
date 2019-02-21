/*
isset(option) => bool
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : [], type : ['bool']};
		if (op.length != 1) throw "Invalid arguments for function hash, expects 1";
		var v = core.compile.code(op.shift());
		if (v.type[0] != 'option') throw "Invalid type for isset, expects an optional value not " + v.type[0];
		ret.code = v.code;
		ret.code.push(["IF_NONE", ["PUSH bool False"], ["DROP","PUSH bool True"]]);
		return ret
	}
};