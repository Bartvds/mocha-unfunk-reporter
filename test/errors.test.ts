///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe('errors', () => {
	it('first fails', () => {
		throw (new Error('Yo!'));
		assert.ok(true);
	});
	it('second fails', (done:() => void) => {
		setTimeout(() => {
			throw (new Error('Yo!'));
			assert.ok(true);
			done();
		}, 10);
	});
});