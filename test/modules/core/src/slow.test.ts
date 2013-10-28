///<reference path="../../../_ref.ts" />

describe('slow test', () => {

	it('normal', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			done();
		}, 1);
	});
	it('medium', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			done();
		}, 50);
	});
	it('slow', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			done();
		}, 250);
	});
});
