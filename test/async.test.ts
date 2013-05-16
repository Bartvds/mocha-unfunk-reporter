///<reference path="_ref.ts" />

describe('async tests', () => {
	it('first passes', (done:() => void) => {
		process.nextTick(() => {
			expect(true).to.equal(true);
			done();
		});
	});
	it('second fails', (done:() => void) => {
		process.nextTick(() => {
			expect(true).to.equal(false);
			done();
		});
	});
	it('third passes', (done:() => void) => {
		process.nextTick(() => {
			expect(true).to.equal(true);
			done();
		});
	});
});