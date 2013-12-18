// Type definitions for ministyle v0.1.0
// Project: https://github.com/Bartvds/ministyle/
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface MiniStyle {
    assertMiniStyle(obj:any):void;
    checkMiniStyle(obj:any):string[];
    isSMiniStyle(obj:any):boolean;
    getStyleNames():string[];
    setBase(obj:any):void;
    escapeHTML(str:string):string;

    base():MiniStyle.Style;
    plain():MiniStyle.Style;
    ansi():MiniStyle.Style;
    html(escape?:boolean):MiniStyle.Style;
    css(classPrefix?:string, escape?:boolean):MiniStyle.StyleCSS;
    dev():MiniStyle.Style;
    empty():MiniStyle.Style;

    toggle():MiniStyle.StyleToggle;
    stack(items:MiniStyle.Style[]):MiniStyle.StyleStack;
    peek(callback:MiniStyle.StylePeekCallback, main:MiniStyle.Style, alt:MiniStyle.Style):MiniStyle.StylePeek;

    colorjs():MiniStyle.Style;
    grunt():MiniStyle.Style;
}

declare module MiniStyle {
	interface Style {
		success(str:string):string;
		accent(str:string):string;
		signal(str:string):string;
		warning(str:string):string;
		error(str:string):string;
		muted(str:string):string;
		plain(str:string):string;
	}

	interface StyleEnable extends Style {
		enabled:boolean;
	}

	interface StyleToggle extends StyleEnable {
		main:MiniStyle.Style;
		alt:MiniStyle.Style;
		active:MiniStyle.Style;
		swap():void;
	}
	interface StyleStack extends StyleEnable {
		stack:MiniStyle.Style[];
	}
	interface StyleCSS extends StyleEnable {
		prefix:string;
	}
	interface StylePeek extends StyleEnable {
		main:MiniStyle.Style;
		alt:MiniStyle.Style;
		callback:MiniStyle.StylePeekCallback;
	}
	interface StylePeekCallback {
		(str:string , def:(str:string) => string , type:string, main:MiniStyle.Style, alt:MiniStyle.Style):string
	}
}

declare module "ministyle" {
export = MiniStyle;
}
