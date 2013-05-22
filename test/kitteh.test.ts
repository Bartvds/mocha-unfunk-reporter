///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe('kitteh', () => {
	describe('can', () => {
		it('meow', () => {
			assert.equal('meow', 'meow');
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
					assert.deepEqual([[1],[1,2],[1,2,3]], [[1],[1,2],[1,2,3]]);
				});
				it('hats', () => {
					assert.equal('hat', 'silly');
				});
				it('yarn', () => {
					var now = new Date();
					var original = {
						aa: 'red',
						bb: 1,
						cc: [1, 2, 3],
						now: now,
						next: now,
						dd: {
							a: 'yo',
							b: 1,
							c: [10, 20, 30],
							d: {
								xx:100,
								yy:200,
								zz:300,
								ww: [1,2,3],
								vv: {x:1,y:2, z:3}
							},
							e: {}
						},
						ee: {x:1,y:2}
					};
					var different = {
						aa: 'blue',
						cc: [3, 2, 1],
						bb: 1,
						now: now,
						next: new Date(new Date().getTime() + 123456),
						dd: {
							a: 'yo',
							b: 1,
							c: [10, 20, 40],
							d: {
								xx:50,
								yy:200,
								qq:300,
								ww: [3,2],
								vv: {x:1,y:2, z:3}
							},
							e: {}
						},
						ee: {x:1,y:2, z:3}
					};
					assert.deepEqual(original, different);
				});
			});
		});
	});
});