module.exports = function(core){
	return compileCondition = function(co){
		if (co.length < 2 || co.length > 3) throw "Error with condition";
		var com = co[0], lhs = co[1];
		if (['and', 'or', 'neq','le','ge','lt','gt','eq'].indexOf(lhs[0]) >= 0) lhs = compileCondition(lhs);
		else lhs = core.compile.code(lhs).code;
		if (co.length == 2) rhs = ["bool", "True"]
		else rhs = co[2];
		if (['and', 'or', 'neq','le','ge','lt','gt','eq'].indexOf(rhs[0]) >= 0) rhs = compileCondition(rhs);
		else rhs = core.compile.code(rhs).code;
		var code = lhs + "DIP{" + rhs + "};";
		if (['and', 'or'].indexOf(com) >= 0) {
			code += com.toUpperCase() + ";";
		}else if (['neq','le','ge','lt','gt','eq'].indexOf(com) >= 0){
			code += "COMPARE;" + com.toUpperCase() + ";";
		}
		return code;
	}
}