///<reference path="../../../_ref.ts" />

describe('errors', () => {
	it('sync fails', () => {
		throw (new Error('MyError'));
	});
	it('async error', (done:() => void) => {
		setTimeout(() => {
			throw (new Error('MyError'));
			done();
		}, 10);
	});
});