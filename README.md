# mocha-unfunk-reporter

> mocha console reporter without funkyness

## What?

unfunk is a minimal spec-style console reporter that doesn't confuse lesser enviroments with funky display tricks.

main use-case is running mocha as external tool in IDE's like WebStorm but should work in all cli/console mocha flavours, and can easily be adapted to alternate unfunky displays.

## Todo

Add proper color mode switch.

## Usage

install using `npm install mocha-unfunk-reporter`

then use  'mocha-unfunk-reporter' as mocha's reporter parameter.

## Versions

0.0.1 - basic version

## Develop

uses grunt and TypeScript: run `grunt` to rebuild and display a test, and `grunt build` for a clean rebuild only.