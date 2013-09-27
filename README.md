# mocha-unfunk-reporter
[![Build Status](https://secure.travis-ci.org/Bartvds/mocha-unfunk-reporter.png?branch=master)](http://travis-ci.org/Bartvds/mocha-unfunk-reporter) [![Dependency Status](https://gemnasium.com/Bartvds/mocha-unfunk-reporter.png)](https://gemnasium.com/Bartvds/mocha-unfunk-reporter) [![NPM version](https://badge.fury.io/js/mocha-unfunk-reporter.png)](http://badge.fury.io/js/mocha-unfunk-reporter)

> Mocha reporter without console funkyness

## What?

This is a `Spec`-style console reporter for [mocha](http://visionmedia.github.io/mocha/) that doesn't confuse lesser console environments with funky display modes, cursor tricks or weird control characters.

Main use-case is running mocha's in basic console views embedded in IDE's or setups with text buffered output. The default config uses only some ANSI console colour codes and writes with console.log() but has option to be tuned up or down for your specific unfunky use-case.

### Notes

* The reporter does *not* extend mocha's default Base prototype because that is a main source of funkyness. This means not all of mocha's reporter features are supported.
* There are many features to ease testing usability, like aggressive attempts at getting a sensible error message or a stack filter that attempts to compact the stack trace by dropping mocha function calls.

### Diffs

* There is a diff report with custom display that works even on plain-text display.
* String-diff algorithm is [jsDiff](https://github.com/kpdecker/jsdiff). 
* Object-diff algorithm is [objectDiff](https://github.com/NV/objectDiff.js) with nested string-diff. May currently be even stricter then your assertions!

### Options

There are multiple ways to pass globals:

````js
//on module using .option() method
require('mocha-unfunk-reporter').option('<option_name>', <option_value>);

//also in bulk
require('mocha-unfunk-reporter').option({<name>: <value>, <name>: <value>});

//or on env with prefixed name
process.env['mocha-unfunk-<option_name>'] = <option_value>;

//env also work Bash-style: upper-cased and underscores instead of dashes
process.env['MOCHA_UNFUNK_<OPTION_NAME>'] = <option_value>;
````
For example these are ll equivalent:
````
process.env['MOCHA_UNFUNK_REPORTPENDING'] = true;
process.env['mocha-unfunk-reportPending'] = true;

require('mocha-unfunk-reporter').option('reportPending', true);
require('mocha-unfunk-reporter').option({reportPending: true});
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

Report details about pending specs, alongside failures: `reportPending`

* `false` (default) or `true`

Use custom stream: `stream` 

* any standard `WritableStream`

Filter internals from stack: `stackFilter` 

* `true` (default) or `false`


## Usage
Install from npm:

````
$ npm install mocha-unfunk-reporter
```` 

Then use `'mocha-unfunk-reporter'` as `reporter` parameter in your favourite mocha runner. 

For example in `grunt-mocha-test`:

````js
grunt.initConfig({
	// ...
	mochaTest: {
		options: {
			reporter: 'mocha-unfunk-reporter'
		},
		any: {
			src: ['test/**/*.test.js']
		}
	}
});
````

## Examples

Something like this:

![ansi](https://raw.github.com/Bartvds/mocha-unfunk-reporter/master/media/mocha-unfunk-04.png)

If you got development install you can use `$ grunt demo` to get a quick demo overview.

## Compatibility

### Assertion libraries

Tested with:

* [Chai Assertion Libary](http://chaijs.com) (best of the best, but no IE < 9)
* [Proclaim](https://github.com/Bartvds/proclaim) (Chai-like `'assert'`, supports IE < 9)
* CommonJS-style `'assert'` (Node.js, browserify etc)

Should work with any assertion library, like:

* Expect.js (minimal reporting, use Chai's expect-style)
* Should.js (untested, use Chai's should-style)

Create an issue if you got a tip or see bugs.

### Mocha flavors:

Testing on:

* mocha (bin cli)
* [grunt-mocha](https://github.com/kmiyashiro/grunt-mocha) (grunt + phantomJS)
* [grunt-mocha-test](https://github.com/pghalliday/grunt-mocha-test) (grunt + node)

Known to work:

* grunt-simple-mocha (grunt + node)
* grunt-mocha-spawn (grunt + node)
* grunt-cafe-mocha (grunt + node)

Create an issue if you got a tip or request for more.

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

## Versions

* 0.2.3 - support bash style uppercased+underscore-style ENV options, don't diff excessively lengthy objects (strings/arrays/arguments/buffers) 
* 0.2.2 - fixed regular Error (stack) reporting, added `chai-as-promised` & `mocha-as-promised` to stack filter, updated screenshot
* 0.2.1 - tweaked display, added pending test report (by @geekdave)
* 0.2.0 - added string diff, more assertions and runner compatibility, changed default to `style='ansi'`
* 0.1.13 - fix for grunt-mocha duration stats compatibility
* 0.1.12 - refactored options; added style and writer
* 0.1.11 - added mocha bin command test, improved reporting
* 0.1.10 - objectDiff fix, added option() methods
* 0.1.8 - compatible with grunt-mocha (PhantomJS)

## Credit

* String diff from [jsDiff](https://github.com/kpdecker/jsdiff) by Kevin Decker
* Object diff from [objectDiff](https://github.com/NV/objectDiff.js) by Nikita Vasilyev
* Color codes from [colors.js](https://github.com/marak/colors.js/) by Marak Squires & Alexis Sellier (cloudhead)

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.