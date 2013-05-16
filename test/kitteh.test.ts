///<reference path="_ref.ts" />

var expect = require('expect.js');

describe('kitteh', () => {
	describe('can', () => {
		it('meow', () => {
			expect(true, 'once').to.be(true);
		});
		describe('has', () => {
			it('cheeseburger', () => {
				expect(true, 'nom').to.be(true);
				expect(true, 'yummy').to.be(true);
				expect(true, 'nomnomnom').to.be(true);
			});
			describe('and', () => {
				it('pinacolada', () => {
					expect(false, 'no drinks').to.be(true);
				});
			});
			describe('also', () => {
				it('hats', () => {
					expect(false, 'no hats').to.be(true);
				});
			});
		});
	});
});