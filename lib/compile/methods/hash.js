/*
hash(bytes, algo) => bytes
hash(bytes) => bytes
*Note: algo must be either 'blake2b', 'sha256' or 'sha512'. blake2b by default
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : "", type : ['bytes']};
		if (op.length < 1 || op.length > 2) throw "Invalid arguments for function hash, expects 1 or 2";
		var algo, data = core.compile.code(op.shift());
		if (data.type[0] != 'bytes') throw "Invalid type for hash, expect bytes not " + data.type[0];
		if (!op.length) algo = 'blake2b';
		else algo = op.shift()[0];
		if (['blake2b', 'sha256', 'sha512'].indexOf(algo) < 0) throw "Unknown hash algo " + algo + " - expects blake2b, sha256 or sha512";
		ret.code += data.code;
		ret.code += core.compile.ml(algo);
		return ret
	}
};