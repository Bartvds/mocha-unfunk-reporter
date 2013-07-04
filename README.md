# mocha-unfunk-reporter
[![Build Status](https://secure.travis-ci.org/Bartvds/mocha-unfunk-reporter.png?branch=master)](http://travis-ci.org/Bartvds/mocha-unfunk-reporter) [![Dependency Status](https://gemnasium.com/Bartvds/mocha-unfunk-reporter.png)](https://gemnasium.com/Bartvds/mocha-unfunk-reporter) [![NPM version](https://badge.fury.io/js/mocha-unfunk-reporter.png)](http://badge.fury.io/js/mocha-unfunk-reporter)

> Mocha console reporter without funkyness

## What?

This is a `Spec`-style console reporter for [mocha](http://visionmedia.github.io/mocha/) that doesn't confuse lesser console environments with funky display modes, cursor tricks or weird control characters and won't use `stderr`.

Main use-case is running mocha's in basic console views embedded in some IDE's or setups with text buffered output. The default config uses only some ANSI console color codes and writes with console.log() but has option to be tuned for your unfunky use case.

### Notes
* The reporter does *not* extend mocha's default Base prototype because that is a main source of funkyness. This means not all of mocha's reporter features are supported.

* There are many features to ease testing usability, like aggressive attempts at getting a sensible error message or a stack filter that attempts to compact the stack trace by dropping mocha functions calls.

### Diff

* String-diff powered by [JsDiff](https://github.com/kpdecker/jsdiff), rendering even supports colorless display! 
* Object-diff tree powered by [objectDiff](https://github.com/NV/objectDiff.js). Currently maybe even stricter then your assertions!

## Usage
Install from npm:

````
$ npm install mocha-unfunk-reporter
```` 

Then use `'mocha-unfunk-reporter'` as `reporter` parameter in your favorite mocha runner. For example in `grunt-mocha-test`:

````js
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

````js
//on env with prefixed name
process.env['mocha-unfunk-<option_name>'] = <option_value>;

//on module using .option() method
require('mocha-unfunk-reporter').option('<option_name>', <option_value>);

//also in bulk
require('mocha-unfunk-reporter').option({<name>: <value>, <name>: <value>});
````

Report styling: `style`

* `'ansi'` - plain with ansi color codes (default)
* `'plain'` - plain text
* `'html'` - html span's with css colors
* `'css'` - html span's with css classes

Output mode: `writer` 

* `'log'` - buffer and stream per line to `console.log()` (default)
* `'stdio'` - stream to `process.stdout`
* `'bulk'` - single buffered `console.log()`
* `'null'` - ignore output

## Examples

Something like this (may be outdated):

Option: `style = 'plain'`

![plain](https://raw.github.com/Bartvds/mocha-unfunk-reporter/master/media/example_output_default.png)

-----

Option: `style = 'ansi'`

![ansi](https://raw.github.com/Bartvds/mocha-unfunk-reporter/master/media/example_output_color.png)


## Compatibility

### Assertion libraries

Tested with:

* [Chai Assertion Libary](http://chaijs.com) (best of the best, but no IE < 9)
* [Proclaim](https://github.com/Bartvds/proclaim) (Chai-like `'assert'`, supports IE < 9)
* CommonJS-style `'assert'` (Node.js, browserify etc)

Should work with any assertion library, like:

* Expect.js (no decent reporting, use Chai's expect-style)
* Should.js (untested, use Chai's should-style)

Create an issue if you got a tip or see bugs.

### Mocha flavors:

Testing on:

* mocha (bin cli)
* [grunt-mocha-test](https://github.com/pghalliday/grunt-mocha-test) (grunt + node)
* grunt-simple-mocha (grunt + node)
* grunt-mocha-spawn (grunt + node)
* grunt-mocha (grunt + phantomJS) (use my [fork](https://github.com/Bartvds/grunt-mocha) until this [pull request](https://github.com/kmiyashiro/grunt-mocha/pull/74) lands)

Known to work:

* grunt-cafe-mocha (grunt + node)

Create an issue if you got a tip or request for more.

## Versions

* 0.2.0 - added string diff, more assertions and runner compatibility, changed defaults: `style='ansi'`
* 0.1.13 - fix for grunt-mocha duration stats compatibility
* 0.1.12 - refactored options; added style and writer
* 0.1.11 - added mocha bin command test, improved reporting
* 0.1.10 - objectDiff fix, added option() methods
* 0.1.8 - compatible with grunt-mocha (PhantomJS)

## Build

Unfunk-reporter is written in [TypeScript](http://typescript.com) and built using [grunt](http://gruntjs.com).

Install development dependencies in your git checkout:
````
$ npm install
````

You need the global [grunt](http://gruntjs.com) command:
````
$ npm install grunt-cli -g
````

Build and run tests:
````
// self test
$ grunt

// show some failing tests
$ grunt dev
````

See the `Gruntfile` for additional commands, including many mocha runners.

## Credit

* Object diff from [objectDiff](https://github.com/NV/objectDiff.js) by Nikita Vasilyev
* Color codes from [colors.js](https://github.com/marak/colors.js/) by Marak Squires & Alexis Sellier (cloudhead)

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.