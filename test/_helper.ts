///<reference path="_ref.ts" />

module helper {

	export function longAssert(actual:string, expected:string, msg?:string):void {
		throw new chai.AssertionError((msg ? msg + ': ' : '') + ' long string', {
				actual: actual,
				expected: expected
			},
			helper.longAssert
		);
	}
}
