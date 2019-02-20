function readMl(t){
	var cc = '', val = '', inst = [], instmap = [], bl = 0, instring = false, escaped = false;
	for(var i = 0; i < t.length; i++){
		cc = t[i];
		if (instring){
			if (!escaped && cc == '"') {
				instring = false;
			}
			else if (escaped) escaped = false;
			else if (cc == "\\") escaped = true;
		}
		else if (bl > 0) {
			if (cc == '}') bl --;
			if (cc == '{') bl ++;
			if (bl == 0){
				inst.push(readMl(val));
				val = '';
				continue;
			}
		}
		else if (cc == '{'){
			bl=1;
			if (val.trim() !='') {
				inst.push(val);
			}
			val = '';
			continue;
		}
		else if (cc == ";") {
			if (val.trim() !='')
				inst.push(val.trim());
			if (inst.length)
				instmap.push(inst);
			inst = [];
			val = '';
			continue;
		}
		val += cc;
	}
	if (val.trim() !='')
		inst.push(val.trim());
	if (inst.length)
		instmap.push(inst);
	return instmap;
}
function formatMl(mla, ti){
	var ret = [], cl;
	for(var i = 0; i < mla.length; i++){
		if (mla[i].length == 1){
			cl = mla[i][0] + " ;";
		} else if (mla[i].length > 1) {
			cl = mla[i].shift() + " { ";
			var cll = cl.length;
			cl += formatMl(mla[i].shift(), ti+cll) + " } ";
			while (mla[i].length){
				cl += "\n" + (" ").repeat(ti+cll - 3) + " { " + formatMl(mla[i].shift(), ti+cll) + " } ";
			}
			cl += " ; ";
		}
		ret.push(cl);
	}
	return ret.join("\n" + (" ").repeat(ti));
}
function formatRemoveMacros(ml){
	ml = ml.replace(/IFCMP(EQ|NEQ|LT|GT|LE|GE){/g, "COMPARE;$1;IF{");
	return ml;
}

module.exports = function(core){
	return function(s, config){
		var definitions = ["const","struct","storage","entry","function"], allowDefault = false;
		var tokens = (typeof s == 'string' ? core.parse.main(s) : s), token, def, tokenMap;
		if (typeof tokens[0] == 'string') tokens = [tokens];
		core.map = {}, core.currentCall = '';
		//Process definitions
		for(var i = 0; i < tokens.length; i++){
			token = tokens[i].slice(0);
			def = token.shift();
			if (definitions.indexOf(def) < 0) throw "Unexpected definition at root level: " + def;
			if (typeof core.map[def] == 'undefined') core.map[def] = [];
			switch(def){
				case 'const':
					var constant = {};
					constant.type = token.shift(), constant.name = token.shift(), constant.value = token.shift();
					core.map[def].push(constant);
				break;
				case 'struct':
					var name = token.shift();
					core.map[def].push({
						name : name,
						type : core.parse.typeList(token)
					});
				break;
				case 'storage':
					var type = token.shift(), name = token.shift();
					core.map[def].push({
						name : name,
						type : core.parse.type(type)
					});
				break;
				case 'entry':
					var n = token.shift();
					if (n == 'default') {
						allowDefault = true;
						continue;
					}
					var c = token.pop(), t = [], tid = [], ni;
					while(token.length){
						ni = token.shift();
						t.push(ni);
						tid.push(ni[0]);
					}
					var v = [], cc = [];
					if (typeof c[0] == 'string') c = [c];
					for(var ii = 0; ii<c.length; ii++){
						if (c[ii][0] == "let"){
							c[ii].shift();
							var tt = c[ii].shift(), nn = c[ii][0];
							v.push({
								name : nn,
								type : core.parse.type(tt)
							});
							if (c[ii].length > 1){						
								c[ii].unshift("set");
							} else {
								continue;
							}
						}
						cc.push(c[ii]);
					}
					core.map[def].push({
						name : n,
						id : "0x"+core.sha256(n + "(" + tid.join(',') + ")").substr(0, 8),
						input : core.parse.typeList(t),
						temp : v,
						code : cc
					});
				
				break;
				case 'function':
					throw "Function is not currently supported";
				break;
			}
		}
		if (typeof core.map.entry == 'undefined') throw "No defined entry calls";
		
		if (core.map.entry.length <= 0) throw "No defined entry calls";
		var mlparam = [], mlstorage, mlcode = [];
		if (typeof core.map.storage != 'undefined')
			mlstorage = core.compile.namedType(core.map.storage);
		else 
			mlstorage = 'unit';
		
		for(var ci = 0; ci < core.map.entry.length; ci++){
			core.currentCall = ci;
			var code = "";
			if (core.map.entry[core.currentCall].input.length == 0){
				code += core.compile.ml("drop");
			} else {
				code += "DUP;SIZE;PUSH nat 4;SWAP;SUB;DUP;GT;IF{}{PUSH nat 102;FAILWITH};ABS;PUSH nat 4;SLICE;"+core.compile.error(101);
				code += "UNPACK "+core.compile.namedType(core.map.entry[core.currentCall].input)+";";
				code += core.compile.error(103);
				code += "PAIR;";
			}
			
			if (core.map.entry[core.currentCall].temp.length != 0) {		
				var nvs = [];
				for (var i = 0; i < core.map.entry[core.currentCall].temp.length; i++){
					nvs.unshift(core.compile.namedType([core.map.entry[core.currentCall].temp[i]]));
				}
				code += "NONE " + nvs[0] + ";";
				if (nvs.length > 1){
					for (i = 1; i < nvs.length; i++){
						code += "NONE " + nvs[i] + ";PAIR;";
					}
				}
				code += "PAIR;";
			}
			var cc = core.compile.code(core.map.entry[core.currentCall].code);
			code += cc.code;
			
			//End of code, revert back to list operation:storage
			var ee = "";
			if (core.map.entry[core.currentCall].input.length) ee += "D";
			if (core.map.entry[core.currentCall].temp.length) ee += "D";
			if (ee) code += "C"+ee+"R;";
			mlcode.push(code);
		}
		
		//construct final michelson
		var ml = "";
		var mlarray = [], mlcode = [];
		mlarray.push("parameter bytes");
		mlarray.push("storage " + mlstorage);
		
		mlcode.push("DUP");
		mlcode.push("CDR");
		mlcode.push("NIL operation");
		mlcode.push("PAIR");
		mlcode.push("SWAP");
		mlcode.push("CAR");

		if (allowDefault){
			mlcode.push("DUP");
			mlcode.push("PUSH bytes 0x");
			mlcode.push("COMPARE");
			mlcode.push("EQ");
			mlcode.push(["IF");
			ml += "DUP;PUSH bytes 0x;COMPARE;EQ;IF{DROP}{";
		}
		ml += "DUP;PUSH nat 4;PUSH nat 0;SLICE;"+core.compile.error(100);
		var en = "";
		for(var i = 0; i < mlcode.length; i++){
			ml += "DUP;PUSH bytes " + core.map.entry[i].id + ";COMPARE;EQ;IF{DROP;" + mlcode[i] + "}{";
			en += "}";
		}
		ml += "DROP;PUSH nat 400;FAILWITH;" + en;
		if (allowDefault){
			ml += "};";
		}
		ml += "};";
		abi = core.map;
		
		//Format config
		
		if (config.optimized_abi == 'compact') {
			if (typeof abi['function'] != 'undefined') delete abi['function'];
			if (typeof abi['const'] != 'undefined') delete abi['const'];
			for (var i = 0; i < abi.entry.length; i++){
				delete abi.entry[i].temp;
				delete abi.entry[i].code;
			}
		}
		if (!config.macros) {
			ml = formatRemoveMacros(ml);
		}
		if (config.ml_format == 'array') {
			ml = readMl(ml);
		} else if (config.ml_format == 'readable') {
			ml = formatMl(readMl(ml), 0);
		}
		
		return {
			ml : ml,
			abi : JSON.stringify(abi),
			config : config
		}
	}
}