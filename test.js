var ficompiler = require("./index.js"), 
fs = require('fs'),
path = require('path');

var tests = ['all', 'bigmap','bool','bytes','input','key_hash','key','list','map','mutez','numbers','optional','set','signature','storage','string','timestamp', 'blank'];

for (var i = 0; i < tests.length; i++){
	var t = tests[i];
	(function(t){
		it("Compiler test of " + t, async function(){
			await expect(compileFile("test/"+t+"_test.fi")).resolves.toEqual(true);
		});
		it("Comparison test of " + t, async function(){
			await expect(compareFile("test/"+t+"_test.fi")).resolves.toEqual(true);
		});
	})(t);
}

var compiledFiles = {};
function compileFile(file){
	return new Promise(function(resolve, reject){
		var filePath = path.join(process.cwd(), file);
		fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
			if (!err) {
				try{
					var compiled = ficompiler.compile(data);
					compiledFiles[file] = compiled;
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

function compareFile(file){
	return new Promise(function(resolve, reject){
		var filePath = path.join(process.cwd(), file + ".ml");
		fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
			if (!err) {
				try{
					resolve((compiledFiles[file].ml + ";") == (data).replace(/;}/g, '}'));
				} catch(e){
					reject(e);
				}
			} else {
				reject(err);
			}
		});
	});
}