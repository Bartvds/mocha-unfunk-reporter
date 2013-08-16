///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe('errors', () => {
	it('first passes', (done:() => void) => {
		setTimeout(() => {
			throw (new Error('Yo!'));
			assert.ok(true);
			done();
		}, 10);
	});
});