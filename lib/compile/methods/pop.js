/*
pop(xx)
xx.pop()
*Note xx is of type list
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : [], type : false};
		if (op.length != 1) throw "Not enough arguments for function pack, expects 1";
		var listName = op.shift(), list = core.compile.code(listName);
		if (['list'].indexOf(list.type[0]) < 0) throw "Invalid type for pop, expects list not " + list.type[0];
		ret.type = list.type[1];
		
		ret.code = list.code;
		ret.code.push(["IF_CONS", [], ["PUSH string \"Fail pop\"", "FAILWITH"]]);
		ret.code.push(['DIP', core.compile.setter(listName[0]).code]);
		return ret
	}
};