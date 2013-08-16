///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe('pending specs', () => {
	it.skip('this is the first pending spec', (done:() => void) => {
		setTimeout(() => {
			assert.ok(true);
			done();
		}, 10);
	});
	it.skip('and a second pending spec', (done:() => void) => {
		setTimeout(() => {
			assert.ok(true);
			done();
		}, 10);
	});
	describe('sub group', () => {
		it.skip('finally a third pending spec', (done:() => void) => {
			setTimeout(() => {
				assert.ok(true);
				done();
			}, 10);
		});
	});
});

