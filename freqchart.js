#!/usr/bin/env node
/**
 * Generate a frequency chart
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: 5/24/2013
 * License: MIT
 */

var fs = require('fs');

var getopt = require('posix-getopt');
var sprintf = require('extsprintf').sprintf;
var strsplit = require('strsplit');

var package = require('./package.json');

var colors = require('colors');

/**
 * Usage
 *
 * return the usage message
 */
function usage() {
  return [
    'Usage: freqchart [-b] [-c <char>] [-h] [-r <file>] [-u] [-v] [-w <width>] [-x <file>] file1 file2 ...',
    '',
    'Command line tool for generating frequency charts',
    '',
    'examples',
    '',
    '  git shortlog -ns | freqchart',
    '',
    'options',
    '  -b, --boring             disable color output',
    '  -c, --char <char>        the character to use for drawing charts, defaults to ' + character,
    '  -h, --help               print this message and exit',
    '  -r, --remove <file>      an optional file that contains a newline separated set of keys to ignore',
    '  -u, --updates            check for available updates',
    '  -v, --version            print the version number and exit',
    '  -w, --width <width>      the width of the graphs drawn, defaults to ' + width,
    '  -x, --cross-out <file>   an optional file that contains a newline separated set of keys to X out',
    '',
  ].join('\n');
}

var options = [
  'b(boring)',
  'c:(char)',
  'h(help)',
  'r:(remove)',
  'u(updates)',
  'v(version)',
  'w:(width)',
  'x:(cross-out)',
].join('');
var parser = new getopt.BasicParser(options, process.argv);
var character = '-';
var crossoutfile;
var removefile;
var width = 100;
var option;
while ((option = parser.getopt()) !== undefined) {
  switch (option.option) {
    case 'b': colors.mode = 'none'; break;
    case 'c': character = option.optarg.slice(0, 1); break;
    case 'h': console.log(usage()); process.exit(0);
    case 'r': removefile = option.optarg; break;
    case 'u': // check for updates
      require('latest').checkupdate(package, function(ret, msg) {
        console.log(msg);
        process.exit(ret);
      });
      return;
    case 'v': console.log(package.version); process.exit(0);
    case 'w': width = +option.optarg || width; break;
    case 'x': crossoutfile = option.optarg; break;
    default: console.error(usage()); process.exit(1); break;
  }
}

var remove   = removefile   ? fs.readFileSync(removefile, 'utf-8').trim().split('\n')   : [];
var crossout = crossoutfile ? fs.readFileSync(crossoutfile, 'utf-8').trim().split('\n') : [];

// the rest of the args are filenames
var files = process.argv.slice(parser.optind());
if (!files.length) files.push('-');

// loop each file and build the array
var lines = [];
files.forEach(function(file) {
  if (file === '-') file = '/dev/stdin';
  try {
    lines = fs.readFileSync(file, 'utf-8').trim().split('\n').concat(lines);
  } catch (e) {
    console.error(e.message);
  }
});

var all = [];
var total = 0;
lines.forEach(function(line) {
  line = line.trim();
  var _s = strsplit(line, undefined, 2);
  var name = _s[1];
  var count = +_s[0];

  all.push([count, name]);
  total += count;
});

all.sort(function(a, b) {
  return a[0] < b[0] ? 1 : -1;
});

console.log('%d unique keys', all.length);
console.log('%d total count\n', total);

var found = [];
var reallygone = [];
var removed = [];
all.forEach(function(o) {
  var count = o[0];
  var name = o[1];
  var perc = count / total * 100;

  if (crossout.indexOf(name) !== -1) {
    var s = sprintf('X %-23s |%s| %d (%f%%)', name || '', progressbar(perc), count, perc.toFixed(1));
    console.log(colors.mode === 'none' ? s : s.red);
    reallygone.push(name);
  } else if (remove.indexOf(name) !== -1) {
    removed.push(name);
  } else {
    var s = sprintf('  %-23s |%s| %d (%f%%)', name || '', progressbar(perc), count, perc.toFixed(1));
    console.log(s);
    found.push(name);
  }
});

console.log('\n%d crossed out\n%d removed\n%d active', reallygone.length, removed.length, found.length);

// return a progress bar
function progressbar(perc) {
  perc = Math.round(perc * (width / 100));
  var arr = [];
  for (var i = 0; i < width; i++) {
    arr.push(i < perc ? character : ' ');
  }
  return arr.join('');
}


