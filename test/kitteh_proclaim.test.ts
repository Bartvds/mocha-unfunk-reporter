///<reference path="_ref.ts" />


describe('king kitteh', () => {
	describe('proclaims they shall', () => {
		it('meow', () => {
			proclaim.equal('meow', 'meow');
		});
		describe('have them', () => {
			it('count', () => {
				proclaim.deepEqual({one: 1, two: 2, three:3}, {one: 3, two: 2, four:4});
			});
		});
		describe('has', () => {
			it('royal milk', () => {
				proclaim.ok(true);
			});
			it('cheeseburgers royale', () => {
				proclaim.ok(true);
			});
			describe('royal no to', () => {
				it('dogs', () => {
					proclaim.equal('dogs', 'not here');
				});

				it('computer skills', () => {
					throw(new Error('pretty stack trace is pretty'));
				});
			});
			describe('some royal ', () => {
				it('fun', () => {
					proclaim.deepEqual([
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
					proclaim.equal('hat', 'silly');
				})
			});
		});
	});
});