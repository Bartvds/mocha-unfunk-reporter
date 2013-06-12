# mocha-unfunk-reporter

> mocha console reporter without funkyness

## What?

Unfunk-reporter is a minimal `spec`-style console reporter for [mocha](http://visionmedia.github.io/mocha/) that doesn't confuse lesser console environments with funky display modes, line overwrites, cursor tricks, escape codes or weird encodings.

Main use-case is running mocha's node module embedded in external tools though IDE's like WebStorm, basic consoles and buffered output. It could easily be adapted to alternate unfunky displays. Tested in `grunt-mocha-test` (and similar) but works in all mocha node.js module flavors if you pass it to mocha as `reporter`.

The reporter does *not* extend mocha's default Base reporter prototype, because that is a main source of funkyness, so not all of mocha's reporter related options are supported.

It defaults to colorless display but there is a option to enable ANSI colors. It's a global option since we don't extend mocha's Base reporter so can't get the useColor parameter (and it's not even exposed to Mocha's module options anyway).

## Notes

* There's a object compare diff output (tested with chai equal/deepEqual/jsonOf etc)
* I would like to add string diff support but it will be tricky to do without depending on colors.

## Usage

Install in your project using `npm install mocha-unfunk-reporter`, maybe global for command line mocha. Then use `mocha-unfunk-reporter` as mocha's `reporter` parameter.

## Options

Pass extra options using process.env (until I find a better way)

````
//enable colors using ANSI codes (nothing against some optional functional funk :)
process.env['mocha-unfunk-color'] = true;
````

## Versions

* 0.1.7 - package.json repos url fix
* 0.1.6 - tight .npmignore
* 0.1.5 - basic object diff
* 0.1.4 - expose color option using process.env
* 0.1.3 - cleaned test and dev dependencies
* 0.1.2 - basic version, colors disabled

## Develop

Unfunk-reporter is written in TypeScript and built using `grunt`: so run `grunt` to rebuild and display a test, and `grunt build` for a clean rebuild.

## Credit

* Object diff from [objectDiff](https://github.com/NV/objectDiff.js) by Nikita Vasilyev
* Color codes from [colors.js](https://github.com/marak/colors.js/) by Marak Squires & Alexis Sellier (cloudhead)
* Has some bits and bobs from default reporters
