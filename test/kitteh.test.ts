///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe('kitteh', () => {
	describe('can', () => {
		it('meow', () => {
			assert.equal('meow', 'meow');
		});
		describe('not', () => {
			it('count', () => {
				assert.deepEqual({one: 1, two: 2, three:3}, {one: 3, two: 2, four:4});
			});
		});
		describe('has', () => {
			it('milk', () => {
				assert.ok(true);
			});
			it('cheeseburgers', () => {
				assert.ok(true);
			});
			describe('no', () => {
				it('dogs', () => {
					assert.equal('dogs', 'not here');
				});

				it('computer skills', () => {
					throw(new Error('pretty stack trace is pretty'));
				});
			});
			describe('some', () => {
				it('fun', () => {
					assert.deepEqual([
						[1],
						[1, 2],
						[1, 2, 3]
					], [
						[1],
						[1, 2],
						[1, 2, 3]
					]);
				});
				it('hats', () => {
					assert.equal('hat', 'silly');
				})
			});
		});
	});
});