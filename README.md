# mocha-unfunk-reporter

> mocha console reporter without funkyness

## What?

Unfunk is a minimal spec-style console reporter that doesn't confuse lesser enviroments with funky display tricks, line overwrites, escapes or weird encodings.

Main use-case is running `mocha`'s node module as external tool in IDE's like WebStorm or other basic consoles, but should work in all cli/console mocha flavours if you manage to pass it to mocha as `--reporter`. It should easily be adapted to alternate unfunky displays.

The reporter does *not* extend `mocha`'s default Base reporter prototype, because that is main source of funkyness, so not all of mocha's reporter related options are supported.

It defaults to colorless display, although there is a functional ANSI styler. But since we can't use the Base reporter there's currently no clean way to enable this using `color/no-color`. If you *must* have some color in your reporting you can re-enable it in unfunk.ts and recompile.

## Todo

There's a *major* bug in most `grunt` `mocha` plugin regarding async errors, which prevents the combination to be as successfull as it should. This is reflected in the crazy devDependencies.

I'm open for suggestions how to pass options and enable color properly, especially if it works with mocha's `color/no-color` flags.

Since it is low on dependencies and only writing forward (no carriage returns or weird offset operators) it should also be possible to make a browser (console) version, even something that streams to a unfunky remote display.

I would like to add diff support but that will be tricky to do without depending on colors.

## Usage

Install in your project using `npm install mocha-unfunk-reporter`, maybe global for comamnd line mocha.

Then use `mocha-unfunk-reporter` as mocha's `reporter` parameter.

## Versions

0.1.1 - basic version, colors disabled

## Develop

Unkunk is written in TypeScript and built using `grunt`: so run `grunt` to rebuild and display a test, and `grunt build` for a clean rebuild.

## Example output (may or may not be up-2-date)

```
  kitteh
    can
      meow.. pass
      has
        milk.. pass
        cheeseburgers.. pass
        some
          yarn.. pass
          hats.. fail
        no
          dogs.. fail

  mocha grunt task
    should register a multi task.. pass
    should run asynchronously.. pass
    should clear the require cache before sending tests to mocha so that it can be run from a watch task.. pass
    should load mocha options from mochaTestConfig.. pass
    should use named config where available.. pass
    should expand and add the file list to files in Mocha.. pass
    should catch and log exceptions thrown by Mocha to the console before failing the task so that it can be run from a watch task.. pass
    should fail if any tests fail.. pass
    should succeed if no tests fail.. pass
    should add a single file added to the require option.. pass
    should expose global variables from the file added with the require option.. fail
    invert option
      should not call the invert chainable function by default.. pass
      should pass through the invert option to the invert chainable function.. pass
    ignoreLeaks option
      should not call the ignoreLeaks chainable function by default.. pass
      should pass through the ignoreLeaks option to the ignoreLeaks chainable function.. pass
    growl option
      should not call the growl chainable function by default.. pass
      should pass through the growl option to the growl chainable function.. pass
    globals option
      should not call the globals chainable function by default.. pass
      should pass through the globals option to the globals chainable function.. pass
    with grunt 0.4.x
      should expand and add the file list to files in Mocha.. pass

executed 28 tests with 3 failures and 1 pending (85ms)

1: kitteh can has some hats
      expected 'hat' to equal 'silly'

2: kitteh can has no dogs
      expected 'dogs' to equal 'not here'

3: mocha grunt task should expose global variables from the file added with the require option
      ReferenceError: testVar is not defined
        at Context.<anonymous> (D:\_Editing\github\mocha\test\mocha.test.js:188:14)
        at Test.Runnable.run (D:\_Editing\github\mocha\test\node_modules\mocha\lib\runnable.js:213:32)
        at Runner.runTest (D:\_Editing\github\mocha\test\node_modules\mocha\lib\runner.js:351:10)
        at D:\_Editing\github\mocha\test\node_modules\mocha\lib\runner.js:397:12
        at next (D:\_Editing\github\mocha\test\node_modules\mocha\lib\runner.js:277:14)
        at D:\_Editing\github\mocha\test\node_modules\mocha\lib\runner.js:286:7
        at next (D:\_Editing\github\mocha\test\node_modules\mocha\lib\runner.js:234:23)
        at Object._onImmediate (D:\_Editing\github\mocha\test\node_modules\mocha\lib\runner.js:254:5)
        at processImmediate [as _immediateCallback] (timers.js:309:15)

```