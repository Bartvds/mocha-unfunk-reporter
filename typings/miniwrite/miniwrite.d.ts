// Type definitions for miniwrite v0.1.0
// Project: https://github.com/Bartvds/miniwrite/
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface MiniWrite {
	assertMiniWrite(obj:any):void;
	isMiniWrite(obj:any):boolean;

	setBase(obj:any):void

	base():MiniWrite.Line;
	chars(target:MiniWrite.Line):MiniWrite.Chars;
	splitter(target:MiniWrite.Line):MiniWrite.Splitter;

	buffer(patch?:any):NodeBuffer;
	log(patch?:any):MiniWrite.Line;

	htmlString(target:MiniWrite.Line, tag?:string, attributes?:any, linebreak?:string):MiniWrite.Line;
	htmlAppend(parent:any, tag?:string, attributes?:any):MiniWrite.HTMLAppend;

	//TODO what to do with node stream?
	stream(nodeStream:any):MiniWrite.Line;

	toggle(main:MiniWrite.Line, alt?:MiniWrite.Line):MiniWrite.Toggle;
	multi(targets?:MiniWrite.Line[]):MiniWrite.Multi;
	peek(target:MiniWrite.Line, callback:MiniWrite.PeekCallback):MiniWrite.Peek;

	grunt(grunt:any, verbose?:boolean, patch?:any):MiniWrite.Line;
}

declare module MiniWrite {

	interface Line {
		writeln(line:string):void;
	}
	interface Enable extends Line {
		enabled:boolean;
	}

	interface Chars extends Enable {
		write(str:string):void;
		flush(linesOnly?:boolean):void;
		has():boolean;
		textBuffer:string;
		lineExp:RegExp;
		useTarget(write:Line):void;
		clear():void;
	}
	interface Splitter extends Line {
		target:Line;
	}
	interface Buffer extends Line {
		lines:string[];
		concat(seperator?:string, indent?:string, appendSep?:boolean):string;
		toString():string;
		clear():void;
	}
	interface Multi extends Enable {
		targets:Line[];
	}
	interface Toggle extends Enable {
		main:Line;
		alt:Line;
		active:Line;
		swap():void;
	}

	interface PeekCallback {
		(line:string, mw:Line):string;
	}
	interface Peek extends Enable {
		target:Line;
		callback:PeekCallback;
	}

	interface HTMLAppend extends Enable {
		// DOM Element?
		parent:any;
	}
}

declare module "miniwrite" {
export = MiniWrite;
}
