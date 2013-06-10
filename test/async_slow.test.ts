///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe('slow test', () => {

	it('medium slow', (done:() => void) => {

		console.log('wait');
		setTimeout(()=> {
			assert.ok(1);
			console.log('go!');
			done();
		}, 100);
	});
	it('very slow', (done:() => void) => {

		console.log('wait');
		setTimeout(()=> {
			assert.ok(1);
			console.log('go!');
			setTimeout(()=> {
				assert.ok(1);
				console.log('go!');
				setTimeout(()=> {
					assert.ok(1);
					console.log('go!');
					done();
				}, 500);
			}, 500);
		}, 500);
	});
});