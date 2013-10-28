///<reference path="../../../_ref.ts" />

describe('async tests', () => {
	it('first passes', (done:() => void) => {
		setTimeout(() => {
			assert.ok(true);
			done();
		}, 10);
	});
	it('second fails', (done:() => void) => {
		setTimeout(() => {
			assert.ok(!true);
			done();
		}, 10);
	});
	it('third errors', (done:() => void) => {
		setTimeout(() => {
			done();
		}, 10);
	});
	it.skip('fourth pending', (done:() => void) => {
		setTimeout(() => {
			assert.ok(true);
			done();
		}, 10);
	});
	it('fifth passes', (done:() => void) => {
		setTimeout(() => {
			assert.ok(true);
			done();
		}, 10);
	});
	it('medium slow', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			done();
		}, 50);
	});
	it('very slow', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			done();
		}, 250);
	});
});