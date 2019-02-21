//
//
module.exports = function(core){
 return function(op){
		var ret = {code : [], type : ['option']};
		var type = op.shift();
		ret.code = ["NONE "+core.compile.type(type)];
		ret.type.push(type);
		return ret;
	}
};