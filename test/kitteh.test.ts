///<reference path="_ref.ts" />

var expect = require('expect.js');

describe('kitteh', () => {
	describe('can', () => {
		it('meow', () => {
			expect(true, 'once').to.be(true);
		});
		describe('has', () => {
			it('milk', () => {
				expect(true).to.be(true);
			});
			it('cheeseburgers', () => {
				expect(true).to.be(true);
				expect(true).to.be(true);
				expect(true).to.be(true);
			});
			describe('and', () => {
				it('yarn', () => {
					expect(2).to.be(2);
				});
				it('pinacolada', () => {
					expect('drinks').not.to.be('nasty');
				});
				it('hats', () => {
					expect('hat').to.be('silly');
				});
			});
			describe('also', () => {
				it('dogs', (done:() => void) => {
					this.timeout(1000);
					setTimeout(() => {
						expect(true).to.be(true);
						expect('dogs').to.be('not here');
						done();
					}, 250);
				});
			});
		});
	});
});