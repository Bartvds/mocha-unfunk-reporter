///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe('slow reporting', () => {
	it('wait for it some..', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			console.log('more..');
			setTimeout(()=> {
				assert.ok(1);
				console.log('more..');
				setTimeout(()=> {
					assert.ok(1);
					console.log('done!');
					done();
				}, 100);
			}, 100);
		}, 100);
	});
	it('wait for it some..', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			console.log('more..');
			setTimeout(()=> {
				assert.ok(1);
				console.log('more..');
				setTimeout(()=> {
					assert.ok(1);
					console.log('done!');
					done();
				}, 100);
			}, 100);
		},100);
	});
});