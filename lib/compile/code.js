module.exports = function(core){
	var 
		varModifiers = ['add', 'sub', 'mul', 'div', 'mod', 'concat'],
		varFunctions = ["in", "length","get","push","drop","pop", 'to_address', 'to_contract', 'to_nat', 'to_int', 'to_optional', 'to_pkh', 'to_some', 'to_mutez'],
		methodHandlers = {},
		constants = {
			BALANCE : {
				code : ['BALANCE'],
				type : "mutez"
			}, 
			SOURCE : {
				code : ["SOURCE"],
				type : "address"
			}, 
			SENDER : {
				code : ["SENDER"],
				type : "address"
			}, 
			SELF : {
				code : ["SELF"],
				type : "contract *"
			},  
			OWNER : {
				code : ["SELF", "ADDRESS"],
				type : "address"
			}, 
			AMOUNT : {
				code : ["AMOUNT"],
				type : "mutez"
			}, 
			GAS : {
				code : ["STEPS_TO_QUOTA"],
				type : "nat"
			}, 
			NOW : {
				code : ["NOW"],
				type : "timestamp"
			}
		},
		methods = ['abs','add','assert','concat','concat_ws','delegate','div','drop','get','hash','if','in','isset','length','mod','mul','neg','new','none','pack','pop','push','set','slice','sqr','sub','throw','to_address','to_contract','to_int','to_mutez','to_nat','to_optional','to_pkh','to_some','transfer','unpack','verify'];
	
	for (var i = 0; i < methods.length; i++){
		methodHandlers[methods[i]] = require("./methods/"+methods[i])(core);
	}
	var _compileCode = function(op){
		var op = op.slice(0), code = "", com = op.shift();
		if (com == "ext"){
			com = op.shift();
			if (varFunctions.indexOf(com) >= 0){
				var n = op.shift();
				op.unshift([n]);
			} else if (varModifiers.indexOf(com) >= 0){
				var n = op.shift();
				op = [n, [com, [n]].concat(op.slice(0))];
				com = "set";
			} else {
				throw "Unknown variable modifier/function " + com;
			}
		}

		if (core.literalTypes.indexOf(com) >= 0){
			if (com == 'pkh') com = 'key_hash';
			return {
				code : ["PUSH " + com + " " + core.compile.literal(com, op.shift())],
				type : [com]
			};
		} 
		else if (typeof constants[com] != 'undefined'){
			return {
				code : constants[com].code.slice(0),
				constant : com,
				type : [constants[com].type]
			}
		} 
		else if (typeof core.map.const != 'undefined' && core.helper.findInObjArray(core.map.const, "name", com) >= 0){
			var i = core.helper.findInObjArray(core.map.const, "name", com);
			return {
				code : ["PUSH " + core.map.const[i].type + " " + core.compile.literal(core.map.const[i].type, core.map.const[i].value)],
				type : [core.map.const[i].type]
			}
		} 
		else if (typeof methodHandlers[com] != 'undefined') {
			var t = methodHandlers[com](op);
			return t;
		}
		else {
			try {
				return core.compile.getter(com);
			} catch (e) {
				throw "Unexpected command " + com;
			}
		}
	}

	return function(code){
		if (typeof code == 'string') code = core.parse.main(code);
		if (typeof code[0] == 'string') return _compileCode(code);
		var compiled = [];
		for (var i = 0; i < code.length; i++){
			op = code[i].slice(0);
			if (!op.length) continue;
			try{
				var line = _compileCode(op);
			} catch (e){
				throw e;
			}
			//if (typeof line.code != 'string') throw "Invalid line function";
			if (line.type) throw "Code returns a value that is not stored";
			compiled = compiled.concat(line.code);
		}
		return {
			code : compiled,
			type : false
		}
	}
};
