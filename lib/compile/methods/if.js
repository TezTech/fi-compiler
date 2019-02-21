/*
*/
module.exports = function(core) {
	return function(op) {
	 const ret = {
			code: []
			, type: false
		}
		let condition = core.compile.condition(op.shift()); let cc = core.compile.code(op.shift()); let n; let toclose = 0
		if (cc) {
			const br = [condition.concat([['IF', cc.code]])]
			toclose++
			while (op.length) {
				n = op.shift()
				if (n == 'if') {
					condition = core.compile.condition(op.shift())
					cc = core.compile.code(op.shift())
					br.push(condition.concat([['IF', cc.code]]))
					e++
				}
				else {
					br[br.length - 1][br[br.length - 1].length - 1].push(core.compile.code(n).code)
					break
				}
			}
			if (br[br.length - 1][br[br.length - 1].length - 1].length == 2) {
				br[br.length - 1][br[br.length - 1].length - 1].push([])
			}
			let bp = br.pop()
			while (br.length) {
				br[br.length - 1][br[br.length - 1].length - 1].push(bp)
				bp = br.pop()
			}
			ret.code = bp
		}
		else {
			ret.code = [condition, ['IF', [], []]]
		}
		return ret
	}
}
