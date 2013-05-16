
///<reference path="_ref.ts" />

console.log('yo!');

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
					expect(false, 'no hats').to.be(true);
				});
			});
		});
	});
});