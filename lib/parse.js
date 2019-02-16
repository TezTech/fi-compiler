module.exports = function(core){
	return {
		main : require('./parse/main')(core),
		condition : require('./parse/condition')(core),
		type : require('./parse/type')(core),
		typeList : require('./parse/typeList')(core)
	}
};
