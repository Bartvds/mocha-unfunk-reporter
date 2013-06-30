# mocha-unfunk-reporter
[![Build Status](https://secure.travis-ci.org/Bartvds/mocha-unfunk-reporter.png?branch=master)](http://travis-ci.org/Bartvds/mocha-unfunk-reporter) [![Dependency Status](https://gemnasium.com/Bartvds/mocha-unfunk-reporter.png)](https://gemnasium.com/Bartvds/mocha-unfunk-reporter) [![NPM version](https://badge.fury.io/js/mocha-unfunk-reporter.png)](http://badge.fury.io/js/mocha-unfunk-reporter)

> Mocha console reporter without funkyness

## What?

This is a `Spec`-style console reporter for [mocha](http://visionmedia.github.io/mocha/) that doesn't confuse lesser console environments with funky display modes, cursor tricks or weird control characters.

Main use-case is running mocha's in basic console views embedded in some IDE's or setups with text buffered output. In the default mode the report doesn't use ANSI control codes like the standard reporters do (there is an option for color though).

The reporter does *not* extend mocha's default Base prototype because that is a main source of funkyness. This means not all of mocha's reporter features are supported.

### Notes

* There's an object-compare diff output powered by [objectDiff](https://github.com/NV/objectDiff.js), useful with [chai](http://chaijs.com/) and deepEqual(). Currently it's very strict (maybe even stricter then your assertion!)
* There should/must be string diff support but it is tricky to display without depending on colors.
* It should be easily adapted to alternate unfunky display modes.

## Usage
Install from npm:

````
npm install mocha-unfunk-reporter --save-dev
```` 

Then use `'mocha-unfunk-reporter'` as `reporter` parameter in your favorite mocha runner. For example in `grunt-mocha-test`:

````
grunt.initConfig({
	// ...
	mochaTest: {
		options: {
			reporter: 'mocha-unfunk-reporter'
		},
		any: {
			src: ['test/_tmp.test.js']
		}
	}
});
````

### Options

There are multiple ways to pass globals:

````
//on env with prefixed name
process.env['mocha-unfunk-<option_name>'] = <option_value>;

//on module using .option() method
require('mocha-unfunk-reporter').option('<option_name>', <option_value>);
````

Report styling: **`style`** 

* `'plain'` (default) - plain text
* `'ansi'` - plain with ansi color codes
* `'html'` - html span's with colors
* `'css'` - html span's with css classes

Output mode: **`writer`** 

* `'stdio'` (default) - stream to `process.stdout`
* `'log'` - buffer and stream per line to `console.log()`
* `'bulk'` - single buffered `console.log()`
* `'null'` - ignore output

## Examples

Option: `style = 'plain'`

![plain](https://raw.github.com/Bartvds/mocha-unfunk-reporter/master/media/example_output_default.png)

-----

Option: `style = 'ansi'`

![ansi](https://raw.github.com/Bartvds/mocha-unfunk-reporter/master/media/example_output_color.png)


## Compatibility

Testing on:

* mocha (bin cli)
* grunt-mocha-test (grunt + node)
* grunt-mocha-spawn (grunt + node)
* grunt-simple-mocha (grunt + node)
* grunt-mocha (grunt + phantomJS) (use my [fork](https://github.com/Bartvds/grunt-mocha) until this [pull request](https://github.com/kmiyashiro/grunt-mocha/pull/74) lands)

Known to work:

* grunt-cafe-mocha (grunt + node)

Create an issue if you got a tip on other suitable runners. 

## Versions

* 0.1.12 - refactored options; added style and writer
* 0.1.11 - added mocha bin command test, improved reporting
* 0.1.10 - objectDiff fix, added option() methods
* 0.1.8 - compatible with grunt-mocha (PhantomJS)

## Editing

Unfunk-reporter is written in TypeScript and built using `grunt`.

Use `grunt test` to rebuild and run tests, `grunt dev` to rebuild and display some failing tests, and check the `Gruntfile.js` for many more.

## Credit

* Object diff from [objectDiff](https://github.com/NV/objectDiff.js) by Nikita Vasilyev
* Color codes from [colors.js](https://github.com/marak/colors.js/) by Marak Squires & Alexis Sellier (cloudhead)

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.