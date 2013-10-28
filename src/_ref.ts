///<reference path="../typings/DefinitelyTyped/node/node.d.ts" />

//nasty hack to quick-fix botched relative path of diff test module
try {
	if (!objectDiff) {
		var objectDiff = require('../lib/objectDiff');
	}
}
catch(e) {

}

