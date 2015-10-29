var fs = Npm.require('fs');
var Future = Npm.require('fibers/future');

// used for sync io
var Fiber = Npm.require('fibers');
// used to launch tsc execuable
var exec = Npm.require('child_process').exec;

var tsc = Npm.require('typescript-compiler');


var compiledFile = 'file.js';


function TypescriptCompiler() {}
TypescriptCompiler.prototype.processFilesForTarget = function (files) {
  files.forEach(function (file) {
  	var myString = file.getContentsAsString();
  	//console.log("ts1: " + myString + "\n\n\n");
  	var currentDir = process.cwd();
  	console.log("dir: " + file.getDirname());
  	console.log("curDir: " + process.cwd());
  	process.chdir(file.getDirname());
    var output = tsc.compileString(myString, null, null, function(err) {
    	//console.log(err);
    });
    //console.log("ts2: " + output);
    file.addJavaScript({ data: output, path: file.getPathInPackage() + '.js' });
    process.chdir(currentDir);
  });
};

Plugin.registerCompiler({
	extensions: ["ts", "tsx"],
	filenames: []
}, function () {
  var compiler  = new TypescriptCompiler();
  return compiler;
});
