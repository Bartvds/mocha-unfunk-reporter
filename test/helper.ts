///<reference path="_ref.ts" />


module helper {

	var fs = require('fs');
	var path = require('path');
	var util = require('util');

	export function readJSON(...src:string[]):any {
		return JSON.parse(fs.readFileSync(path.join.apply(path, src)));
	}


	export function dump(object:any, label?:string = '', depth?:number = 6, showHidden?:bool = false):any {
		if (console.log) {
			console.log(label + ':');
		}
		console.log(util.inspect(object, showHidden, depth, true));
	}

	export function dumpJSON(object:any, label?:string = ''):any {
		if (console.log) {
			console.log(label + ':');
		}
		console.log(JSON.stringify(object, null, 4));
	}

}