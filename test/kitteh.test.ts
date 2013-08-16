///<reference path="_ref.ts" />

function mouse() {
	couch();
}
function couch() {
	table();
}
function table() {
	chair();
}
function chair() {
	assert(false, 'pretty stack trace is pretty');
	//throw(new Error('pretty stack trace is pretty'));
}

describe('kitteh', () => {
	describe('can', () => {
		it('meow', () => {
			assert.equal('meow', 'meow');
		});
		describe('not', () => {
			it('spell', () => {
				assert.equal('abcdefghijdelm actual', 'abcdfghjklm expected');
			});
		});
		describe('has', () => {
			it('milk', () => {
				assert.ok(true);
			});
			it('cheeseburgers', () => {
				assert.ok(true);
			});
			it.skip('sushi', () => {
				assert.ok(true);
			});
			describe('no', () => {
				it('computer skills', () => {
					mouse();
				});
			});
			describe('some', () => {
				it('fun', () => {
					assert.deepEqual({
							aa: 'meeeeiiow actual',
							bb: 'purrrrrrr actual',
							cc: [111, 222, 555],
							dd: {one: 33, two: 22, three: 44}
						}, {
							aa: 'meow meow expected',
							ff: 'hsss expected',
							cc: [1, 2, 3],
							dd: {one: 1, two: 2, three: 3}
						}
					);
					it('hats', () => {
						assert.equal('hat', 'silly');
					})
					it.skip('lasers', () => {
						assert.ok(true);
					});
				});
			});
		});
	});
});