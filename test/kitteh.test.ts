///<reference path="_ref.ts" />

describe('kitteh', () => {
	describe('can', () => {
		it('meow', () => {
			expect(true, 'once').to.equal(true);
		});
		describe('has', () => {
			it('milk', () => {
				expect(true).to.equal(true);
			});
			it('cheeseburgers', () => {
				expect(true).to.equal(true);
				expect(true).to.equal(true);
				expect(true).to.equal(true);
			});
			describe('some', () => {
				it('yarn', () => {
					expect(2).to.equal(2);
				});
				it('hats', () => {
					expect('hat').to.equal('silly');
				});
			});
			describe('no', () => {
				it('dogs', () => {
					expect(true).to.equal(true);
					expect('dogs').to.equal('not here');
				});
			});
		});
	});
});