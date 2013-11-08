///<reference path="../../../_ref.ts" />

describe('q long stack', () => {
	var Q = require('q');
	Q.longStackSupport = true;

	function one() {
		return Q().then(() => {
			return two();
		});
	}

	function two() {
		return Q().then(() => {
			return three();
		});
	}

	function three() {
		return Q().then(() => {
			throw new Error('Q Error');
		});

	}

	it('async error', (done:(err) => void) => {
		Q().then(() => {
			return one()
		}).then(() => {
				done(new Error('test broken'));
			},
			done);
	});
});