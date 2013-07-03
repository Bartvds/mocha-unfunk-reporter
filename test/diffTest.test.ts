///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe.only('diffTest', () => {

	var lineA = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut suscipit convallis ullamcorper. Ut placerat magna commodo nisl semper pretium. Pellentesque molestie aliquam metus, vitae tempus quam adipiscing ut.'
	var lineB = 'Lorem ipsum dolor sit amet. Cras a sodales mauris, eu aliquet lectus. Mauris metus dui, varius nec arcu eget, malesuada interdum neque. Praesent semper sollicitudin turpis, sed viverra metus mattis et.'

	var helloA= 'Hello lovely world';
	var helloB = 'Hello world today';

	it('show short diff', () => {
		assert.equal(helloA, helloB);
	});
	it('show long diff', () => {
		assert.equal(lineA, lineB);
	});
	it('show nested diff', () => {
		var objA = {aa:{aa:1, bb:lineA, cc:3}, bb:helloA, cc:3};
		var objB = {aa:{aa:1, bb:lineB, cc:3}, bb:helloB, cc:3};
		assert.equal(objA, objB);
	});
});