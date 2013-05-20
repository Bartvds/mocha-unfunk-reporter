# mocha-unfunk-reporter

> mocha console reporter without funkyness

## What?

Unfunk-reporter is a minimal `spec`-style console reporter for [mocha](http://visionmedia.github.io/mocha/) that doesn't confuse lesser console environments with funky display tricks, line overwrites, cursor tricks, escape codes or weird encodings. 

Main use-case is running mocha's node module embedded in external tools though IDE's like WebStorm or other basic consoles and low-tech buffered output. It works in all mocha node.js module flavours if you pass it to mocha as `reporter`. It could easily be adapted to alternate unfunky displays.

The reporter does *not* extend mocha's default Base reporter prototype, because that is a main source of funkyness, so not all of mocha's reporter related options are supported.

It defaults to colorless display but there is a option to enable ANSI colors. It's a global option since we don't extend mocha's Base reporter so can't get the useColor parameter (and it's not even exposed to Mocha's module options anyway).

## Notes

* There's a *major* bug in most `grunt` + `mocha` plugins regarding async errors, which prevents the combination to be as successful as it should. Temporary use wrapper like my `child_process.fork()` based [grunt-mocha-spawn](https://github.com/Bartvds/grunt-mocha-spawn) until somebody fixes it properly.

* I would like to add diff support but that will be tricky to do without depending on colors.

## Usage

Install in your project using `npm install mocha-unfunk-reporter`, maybe global for command line mocha. Then use `mocha-unfunk-reporter` as mocha's `reporter` parameter.

## Options

Pass extra options using process.env (until I find a better way)

````
//enable colors using ANSI codes (nothing against some optional functional funk :)
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
