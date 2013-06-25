# mocha-unfunk-reporter

[![Dependency Status](https://gemnasium.com/Bartvds/mocha-unfunk-reporter.png)](https://gemnasium.com/Bartvds/mocha-unfunk-reporter) [![NPM version](https://badge.fury.io/js/mocha-unfunk-reporter.png)](http://badge.fury.io/js/mocha-unfunk-reporter)

> Mocha console reporter without funkyness

## What?

This is a minimal `Spec`-style console reporter for [mocha](http://visionmedia.github.io/mocha/) that doesn't confuse lesser console environments with funky display modes, line overwrites, cursor tricks, escape codes or weird encodings.

Main use-case is running mocha's node module, embedded in external tools in IDE's like WebStorm or in other setups with only basic consoles or buffered output. 

The reporter does *not* extend mocha's default Base reporter prototype, because that is a main source of funkyness, so not all of mocha's reporter related features are supported.

## Notes

* There's an object-compare diff output powered by [objectDiff](https://github.com/NV/objectDiff.js), usefull with [chai](http://chaijs.com/) and deepEqual().
* There should be string diff support but it will be tricky to do without depending on colors.
* The reporter could easily be adapted to alternate unfunky display modes, I might even support browser consoles or remote logging.

## Usage
Install in your project using `npm install mocha-unfunk-reporter`. Then use `mocha-unfunk-reporter` as mocha's `reporter` parameter.

## Options

Pass extra options using process.env. It's a global option since we don't extend mocha's Base reporter so cannot access the useColor parameter.

````
// global enable colors using ANSI codes (nothing against some optional functional funk :)

require('mocha-unfunk-color').option('color', true);
````

## Versions

* 0.1.10 - objectDiff fix, added option methode
* 0.1.9 - tighter text
* 0.1.8 - made compatible with grunt-mocha (PhantomJS)
* 0.1.7 - package.json repos url fix
* 0.1.6 - tight .npmignore
* 0.1.5 - basic object diff
* 0.1.4 - expose color option using process.env
* 0.1.3 - cleaned test and dev dependencies
* 0.1.2 - basic version, colors disabled

## Compatibility

Testing on:

* mocha (node module)
* grunt-mocha (grunt + phantomJS)
* grunt-mocha-test (grunt + node)
* grunt-mocha-spawn (grunt + node)
* grunt-simple-mocha (grunt + node)

Known to work:

* grunt-cafe-mocha (grunt + node)

Send an issue for tips on other 

## Editing

Unfunk-reporter is written in TypeScript and built using `grunt`: so run `grunt` to rebuild and display visual tests, and `grunt build` for a clean rebuild.

## Credit

* Object diff from [objectDiff](https://github.com/NV/objectDiff.js) by Nikita Vasilyev
* Color codes from [colors.js](https://github.com/marak/colors.js/) by Marak Squires & Alexis Sellier (cloudhead)
* Has some bits and bobs from default reporters
