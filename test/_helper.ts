///<reference path="_ref.ts" />


module helper {

	export function dumpJSON(object:any, label?:string = ''):any {
		if (console.log) {
			console.log(label + ':');
		}
		console.log(JSON.stringify(object, null, 4));
	}

}