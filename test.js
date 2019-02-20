var ficompiler = require("./index.js"), 
fs = require('fs'),
path = require('path');

var tests = ['bigmap','bool','bytes','input','key_hash','key','list','map','mutez','numbers','optional','set','signature','storage','string','timestamp', 'blank'];

for (var i = 0; i < tests.length; i++){
	var t = tests[i];
	(function(t){
		it("Testing " + t, async function(){
			await expect(compileFile("test/"+t+"_test.fi")).resolves.toEqual(true);
		});
	})(t);
}

function compileFile(file){
	return new Promise(function(resolve, reject){
		var filePath = path.join(process.cwd(), file);
		fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
			if (!err) {
				try{
					var compiled = ficompiler.compile(data);
					resolve(true);
				} catch(e){
					reject(e);
				}
			} else {
				reject(err);
			}
		});
	});
}