///<reference path="_ref.ts" />

describe('async tests', () => {
	it('first passes', (done:() => void) => {
		setTimeout(() => {
			expect(true).to.equal(true);
			done();
		}, 10);
	});
	it.skip('second fails', (done:() => void) => {
		setTimeout(() => {
			expect(true).to.equal(false);
			done();
		}, 10);
	});
	it('third passes', (done:() => void) => {
		setTimeout(() => {
			expect(true).to.equal(true);
			done();
		}, 10);
	});
});