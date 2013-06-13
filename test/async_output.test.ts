///<reference path="_ref.ts" />

declare var assert:chai.Assert;

describe('slow reporting', () => {
	it('wait for it to', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			setTimeout(()=> {
				assert.ok(1);
				setTimeout(()=> {
					assert.ok(1);
					done();
				}, 100);
			}, 100);
		}, 100);
	});
	it('wait for it to', (done:() => void) => {
		setTimeout(()=> {
			assert.ok(1);
			setTimeout(()=> {
				assert.ok(1);
				setTimeout(()=> {
					assert.ok(1);
					done();
				}, 100);
			}, 100);
		},100);
	});
});