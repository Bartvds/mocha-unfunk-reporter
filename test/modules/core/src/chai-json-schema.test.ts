///<reference path="../../../_ref.ts" />

describe('chai-json-schema', () => {
	chai.use(require('chai-json-schema'));

	var assert = chai.assert;
	var data = {
		schema: {
			"type": "object",
			"properties": {
				"intKey": {
					"type": "integer"
				},
				"stringKey": {
					"type": "string"
				}
			}
		},
		valid: {
			"intKey": 1,
			"stringKey": "one"
		},
		invalid: {
			"intKey": 3,
			"stringKey": false
		}
	};

	it('fruit failure', () => {
		assert.jsonSchema(data.invalid, data.schema);
	});
});