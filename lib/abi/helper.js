var TextEncoder = require("text-encoding").TextEncoder;
var BN = require("bignumber.js");
var encodeRawBytes = function (input){
		const rec = function(input){
			const result = [];

			if (input instanceof Array) {
				result.push('02')
				const bytes = input.map(function(x){ return rec(x)}).join('');
				const len = bytes.length / 2;
				result.push(len.toString(16).padStart(8, '0'));
				result.push(bytes);

			} else if (input instanceof Object) {
				if (input.prim) {
					const args_len = input.args ? input.args.length : 0
					result.push(prim_mapping_reverse[args_len][!!input.annots])
					result.push(op_mapping_reverse[input.prim])
					if (input.args) {
						input.args.forEach(function(arg){
							return result.push(rec(arg));
						});
					}

					if (input.annots) {
						const annots_bytes = input.annots.map(function(x){
							return utility.buf2hex(new TextEncoder().encode(x))
						}).join('20');
						result.push((annots_bytes.length / 2).toString(16).padStart(8, '0'));
						result.push(annots_bytes);
					}

				} else if (input.bytes) {

					const len = input.bytes.length / 2;
					result.push('0A');
					result.push(len.toString(16).padStart(8, '0'));
					result.push(input.bytes);

				} else if (input.int) {
					const num = new BN(input.int, 10);
					const positive_mark = num.toString(2)[0] === '-' ? '1' : '0';
					const binary = num.toString(2).replace('-', '');
					const pad = binary.length <= 6 ? 6 : ((binary.length - 6) % 7 ? binary.length + 7 - (binary.length - 6) % 7 : binary.length);
					
					const splitted = binary.padStart(pad, '0').match(/\d{6,7}/g);
					const reversed = splitted.reverse();

					reversed[0] = positive_mark + reversed[0];
					const num_hex = reversed.map(function(x, i){ 
						return parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
						.toString(16)
						.padStart(2, '0')
					}).join('')

					result.push('00')
					result.push(num_hex)

				} else if (input.string) {

					const string_bytes = new TextEncoder().encode(input.string)
					const string_hex = [].slice.call(string_bytes).map(function(x){
						return x.toString(16).padStart(2, '0')
					}).join('');
					const len = string_bytes.length;
					result.push('01');
					result.push(len.toString(16).padStart(8, '0'));
					result.push(string_hex);
				}
			}
			return result.join('')
		}

		return "05"+rec(input).toLowerCase()
}
var sexp2mic = function me(mi) {
	mi = mi.replace(/(?:@[a-z_]+)|(?:#.*$)/mg, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (mi.charAt(0) === "(") mi = mi.slice(1, -1);
	let pl = 0;
	let sopen = false;
	let escaped = false;
	let ret = {
		prim: '',
		args: []
	};
	let val = "";
	for (let i = 0; i < mi.length; i++) {
		if (escaped) {
			val += mi[i];
			escaped = false;
			continue;
		}
		else if ((i === (mi.length - 1) && sopen === false) || (mi[i] === " " && pl === 0 && sopen === false)) {
			if (i === (mi.length - 1)) val += mi[i];
			if (val) {
				if (val === parseInt(val).toString()) {
					if (!ret.prim) return {"int": val};
					else ret.args.push({"int": val});
				} else if (val[0] == '0') {
					if (!ret.prim) return {"bytes": val};
					else ret.args.push({"bytes": val});
				} else if (ret.prim) {
					ret.args.push(me(val));
				} else {
					ret.prim = val;
				}
				val = '';
			}
			continue;
		}
		else if (mi[i] === '"' && sopen) {
			sopen = false;
			if (!ret.prim) return {'string': val};
			else ret.args.push({'string': val});
			val = '';
			continue;
		}
		else if (mi[i] === '"' && !sopen && pl === 0) {
			sopen = true;
			continue;
		}
		else if (mi[i] === '\\') escaped = true;
		else if (mi[i] === "(") pl++;
		else if (mi[i] === ")") pl--;
		val += mi[i];
	}
	return ret;
}
var op_mapping = {
  '00':'parameter',
  '01':'storage',
  '02':'code',
  '03':'False',
  '04':'Elt',
  '05':'Left',
  '06':'None',
  '07':'Pair',
  '08':'Right',
  '09':'Some',
  '0A':'True',
  '0B':'Unit',
  '0C':'PACK',
  '0D':'UNPACK',
  '0E':'BLAKE2B',
  '0F':'SHA256',
  '10':'SHA512',
  '11':'ABS',
  '12':'ADD',
  '13':'AMOUNT',
  '14':'AND',
  '15':'BALANCE',
  '16':'CAR',
  '17':'CDR',
  '18':'CHECK_SIGNATURE',
  '19':'COMPARE',
  '1A':'CONCAT',
  '1B':'CONS',
  '1C':'CREATE_ACCOUNT',
  '1D':'CREATE_CONTRACT',
  '1E':'IMPLICIT_ACCOUNT',
  '1F':'DIP',
  '20':'DROP',
  '21':'DUP',
  '22':'EDIV',
  '23':'EMPTY_MAP',
  '24':'EMPTY_SET',
  '25':'EQ',
  '26':'EXEC',
  '27':'FAILWITH',
  '28':'GE',
  '29':'GET',
  '2A':'GT',
  '2B':'HASH_KEY',
  '2C':'IF',
  '2D':'IF_CONS',
  '2E':'IF_LEFT',
  '2F':'IF_NONE',
  '30':'INT',
  '31':'LAMBDA',
  '32':'LE',
  '33':'LEFT',
  '34':'LOOP',
  '35':'LSL',
  '36':'LSR',
  '37':'LT',
  '38':'MAP',
  '39':'MEM',
  '3A':'MUL',
  '3B':'NEG',
  '3C':'NEQ',
  '3D':'NIL',
  '3E':'NONE',
  '3F':'NOT',
  '40':'NOW',
  '41':'OR',
  '42':'PAIR',
  '43':'PUSH',
  '44':'RIGHT',
  '45':'SIZE',
  '46':'SOME',
  '47':'SOURCE',
  '48':'SENDER',
  '49':'SELF',
  '4A':'STEPS_TO_QUOTA',
  '4B':'SUB',
  '4C':'SWAP',
  '4D':'TRANSFER_TOKENS',
  '4E':'SET_DELEGATE',
  '4F':'UNIT',
  '50':'UPDATE',
  '51':'XOR',
  '52':'ITER',
  '53':'LOOP_LEFT',
  '54':'ADDRESS',
  '55':'CONTRACT',
  '56':'ISNAT',
  '57':'CAST',
  '58':'RENAME',
  '59':'bool',
  '5A':'contract',
  '5B':'int',
  '5C':'key',
  '5D':'key_hash',
  '5E':'lambda',
  '5F':'list',
  '60':'map',
  '61':'big_map',
  '62':'nat',
  '63':'option',
  '64':'or',
  '65':'pair',
  '66':'set',
  '67':'signature',
  '68':'string',
  '69':'bytes',
  '6A':'mutez',
  '6B':'timestamp',
  '6C':'unit',
  '6D':'operation',
  '6E':'address',
  '6F':'SLICE',
}
var op_mapping_reverse = (function(){
  var result = {}
  for (const key in op_mapping) {
    result[op_mapping[key]] = key
  }
  return result
})()
var prim_mapping = {
  '00': 'int',    
  '01': 'string',             
  '02': 'seq',             
  '03': {name: 'prim', len: 0, annots: false},          
  '04': {name: 'prim', len: 0, annots: true},
  '05': {name: 'prim', len: 1, annots: false},           
  '06': {name: 'prim', len: 1, annots: true},   
  '07': {name: 'prim', len: 2, annots: false},          
  '08': {name: 'prim', len: 2, annots: true},  
  '09': {name: 'prim', len: 3, annots: true},
  '0A': 'bytes'                  
}
var prim_mapping_reverse = {
  [0]: {
    false: '03',
    true: '04'
  },
  [1]: {
    false: '05',
    true: '06'
  },
  [2]: {
    false: '07',
    true: '08'
  },
  [3]: {
    true: '09'
  }
}

module.exports = function(abi, core){
	var typevalue = function(p, ts){
		var p = p.slice(0);
		var ts = ts.slice(0);
		if (typeof p == 'string') p = [[p]];
		if (typeof p[0] == 'string') p = [p];
		if (p.length == 0) return 'Unit';
		else if (p.length == 1){
			if (core.literalTypes.indexOf(p[0][0]) >= 0) return core.compile.literal(p[0][0], ts[0]);
			else if (p[0][0] == 'unit') return "Unit";
			else if (core.complexTypes.indexOf(p[0][0]) >= 0) core.compile.literal(p[0][0], ts[0]);
			else {
				return namedTypevalue(abi.struct[core.helper.findInObjArray(abi.struct, 'name', p[0][0])].type, ts);
			}
		} 
		else {
			var ret = "(Pair ";
			ret += typevalue([p.shift()], [ts.shift()]);
			ret += " ";
			var e = '';
			while(p.length > 1) {
				ret += "(Pair ";
				ret += typevalue([p.shift()], [ts.shift()]);
				ret += " ";
				e += ')';
			}
			ret += typevalue([p.shift()], [ts.shift()]);
			ret += ")";
			ret += e;
			return ret;
		}
	}
	var namedTypevalue = function(p, ts){
		var p = p.slice(0);
		var ts = ts.slice(0);
		if (p.length == 0) return 'Unit';
		var types = [];
		while(p.length){
			var tt = p.shift();
			types.push(tt.type);
		}
		return typevalue(types, ts);
	}
	return {
			packData : function(d){
			return encodeRawBytes(sexp2mic(d));
		},
		namedTypevalue : namedTypevalue
	}
}