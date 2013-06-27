///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe('slow test', () => {

	it('medium slow', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			done();
		}, 100);
	});
	it('very slow', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			done();
		}, 500);
	});
});