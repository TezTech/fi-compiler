/*
*/
module.exports = function(core){
 return function(op){
	 var ret = {code : [], type : false};
		var condition = core.compile.condition(op.shift()), cc = core.compile.code(op.shift()), n, toclose = 0;
		if (cc){
			var br = [condition.concat([["IF", cc.code]])];
			toclose++;
			while(op.length){
				n = op.shift();
				if (n == "if"){
					condition = core.compile.condition(op.shift());
					cc = core.compile.code(op.shift());
					br.push(condition.concat([['IF', cc.code]]));
					e++
				} else {
					br[br.length-1][br[br.length-1].length-1].push(core.compile.code(n).code);
					break;
				}
			}
			if (br[br.length-1][br[br.length-1].length-1].length == 2){
					br[br.length-1][br[br.length-1].length-1].push([]);
			}
			var bp = br.pop();
			while(br.length){
				br[br.length-1][br[br.length-1].length-1].push(bp);
				bp = br.pop();
			}
			ret.code = bp
			
		} else {
			ret.code = [condition, ["IF", [], []]];
		}
		console.log(ret);
		return ret
	}
};