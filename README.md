# mocha-unfunk-reporter

> mocha console reporter without funkyness

## What?

Unfunk-reporter is a minimal `spec`-style console reporter that doesn't confuse lesser console enviroments with funky display tricks, line overwrites, escapes or weird encodings. Main use-case is running `mocha`'s node module as external tool in IDE's like WebStorm or other basic consoles and low-tech buffered output, but should work in all mocha node.js module flavours if you manage to pass it to mocha as `reporter`. It should easily be adapted to alternate unfunky displays.

The reporter does *not* extend `mocha`'s default Base reporter prototype, because that is main source of funkyness, so not all of mocha's reporter related options are supported.

It defaults to colorless display, although there is a functional ANSI styler. But since we can't use the Base reporter there's currently no clean way to enable this using `color/no-color`. If you *must* have some color in your reporting you can re-enable it in `unfunk.ts` and recompile.

## Todo

* There's a *major* bug in most `grunt` `mocha` plugin regarding async errors, which prevents the combination to be as successfull as it should.

* I'm open for suggestions how to pass options and enable color properly, especially if it works with mocha's `color/no-color` flags.

* Since it is low on dependencies and only writing forward (no carriage returns or weird offset operators) it should also be possible to make a browser (console) version, even something that streams to a unfunky remote display.

* I would like to add diff support but that will be tricky to do without depending on colors.

## Usage

Install in your project using `npm install mocha-unfunk-reporter`, maybe global for command line mocha. Then use `mocha-unfunk-reporter` as mocha's `reporter` parameter.

## Options

Pass extra options using process.env (until I find a better way)


````
//enable colors, using ANSI codes (we all need *some* functional funk :)
process.env['mocha-unfunk-color'] = true;
````

## Versions

0.1.4 - expose color option using process.env
0.1.3 - cleaned test and dev dependencies
0.1.2 - basic version, colors disabled

## Develop

Unfunk-reporter is written in TypeScript and built using `grunt`: so run `grunt` to rebuild and display a test, and `grunt build` for a clean rebuild.

## Credit

* Color codes taken from [colors.js](https://github.com/marak/colors.js/) by Marak Squires & Alexis Sellier (cloudhead)
* Has some bits and bobs from default reporters
