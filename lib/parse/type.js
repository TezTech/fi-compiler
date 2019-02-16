//This function will take in any fi type as a stirng, and produce a parsed array
module.exports = function(core){
	return parseType = function(t){
		var to = [], val = '', cc = '', slevel = 0;
		for (var i = 0; i < t.length; i++) {
			cc = t[i];
			if (val == '' && cc == ' ') continue;
			else if (slevel > 0){
				if (cc == ']') slevel --;
				if (cc == '[') slevel ++;
				if (slevel == 1 && cc == ','){
					to.push(val);
					val = '';
					continue;
				}
				if (slevel == 1 && cc == "=" && t[i+1] == ">"){
					to.push(val);
					val = '';
					i++;
					continue;
				}
				else if (slevel == 0){
					if (val == '' && to.length == 1){
						to.unshift("list");
						continue;
					} else {
						to.push(val);
						val = '';
						continue;
					}
				}
				val += cc;
			} else {
				if (cc == '?'){
					to.push('option');
					val = '';
					continue;
				}
				else if (cc == '['){
					slevel++;
					to.push(val);
					val = '';
					continue;
				}
				else if (cc == " ") {
					to.push(val);
					val = '';
					continue;
				}
				val += cc;
			}
		}
		if (val != ''){
			to.push(val);
		}
		var mt = to.shift(),
		ret = '';
		switch(mt){
			case "tz1":
			case "pkh":
				ret = ["key_hash"];
			break;
			case "string":
			case "int":
			case "nat":
			case "bool":
			case "timestamp":
			case "mutez":
			case "address":
			case "operation":
			case "key":
			case "key_hash":
			case "signature":
			case "bytes":
				ret = [mt];
			break;
			case "map":
				ret = ["map", parseType(to[0]), parseType(to[1])];
			break;
			case "bmap":
				ret = ["big_map", parseType(to[0]), parseType(to[1])];
			break;
			case "contract":
				ret = ["contract", parseType(to[0])];
			break;
			case "list":
				ret = ["list", parseType(to[0])];
			break;
			case "option":
				ret = ["option", parseType(to[0])];
			break;
			case "set":
				ret = ["set", parseType(to[0])];
			break;
			default:
				ret = [mt];
			break;
		}
		return ret;
	};
};
