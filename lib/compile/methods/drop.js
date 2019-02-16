/*
drop(xx, _ key)
xx.drop(_ key)
*Note xx is of type map, big_map or set
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : false};
		var vvName = op.shift(), key = core.compile.code(op.shift()), vv = core.compile.code(vvName);
		if (['map', 'big_map', 'set'].indexOf(vv.type[0]) < 0) throw "Invalid type for drop, expecting map, big_map or set, not " + vv.type[0];
		if (core.compile.type(key.type[0]) != core.compile.type(vv.type[1])) throw "Invalid key type, expecting " + vv.type[1] + " not " + key.type[0];
		ret.code += key.code;
		if (vv.type[0] == 'set'){
			ret.code += core.compile.ml('dip', "PUSH bool False;");
		} else {			
			ret.code += core.compile.ml('dip', "NONE "+core.compile.type(vv.type[2])+";");
		}
		ret.code += core.compile.ml('diip', vv.code);
		ret.code += "UPDATE;";
		ret.code += core.compile.setter(vvName[0]).code;
		return ret
	}
};