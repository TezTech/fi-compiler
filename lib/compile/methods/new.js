//
//
var comparable = ['nat', 'int', 'mutez', 'string', 'timestamp', 'bytes', 'key_hash', 'bool', 'address'];
module.exports = function(core){
 return function(op){
	 var ret = {code : [], type : false};
		var t = op.shift(), t1, t2;
		switch(t){
			case "set":
				t1 = op.shift();
				if (comparable.indexOf(t1[0]) < 0) throw "Invalid type for key, expects comparable type not " + t1[0];
				ret.code = ["EMPTY_SET " + core.compile.type(t1)];		
				ret.type = ['set', t1];
			break;
			case "list":
				t1 = op.shift();
				ret.code = ["NIL " + core.compile.type(t1)];		
				ret.type = ['list', t1];
			break;
			case "map":
				t1 = op.shift();
				if (comparable.indexOf(t1[0]) < 0) throw "Invalid type for key, expects comparable type not " + t1[0];
				t2 = op.shift();
				ret.code = ["EMPTY_MAP " + core.compile.type(t1) + " " + core.compile.type(t2)];					
				ret.type = ['map', t1, t2];
			break;
			default:
				if (core.helper.findInObjArray(core.map.struct, 'name', t) < 0) throw "Unknown struct " + t;
				op = op.reverse();
				var a1 = core.compile.code(op.shift()), an, ct = [];
				ret.code = a1.code;
				ct.unshift(a1.type);
				while(op.length){
					an = core.compile.code(op.shift());
					if (!an.type) throw "Invalid argument for new";
					ct.unshift(an.type);
					ret.code.push(['DIP', an.code]);
					ret.code.push('SWAP');
					ret.code.push('PAIR');
				}
				if (core.compile.type(ct) != core.compile.type(t)) throw "Type error with arguments for new struct " + t;
				ret.type = [t];
			break;
		}
		return ret
	}
};