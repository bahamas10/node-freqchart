freqchart(1) -- Frequency Chart
===============================

Command line tool for generating frequency charts

Installation
------------

    [sudo] npm install -g freqchart

Basic Examples
--------------

`freqchart` will read from stdin by default a file in the format of `count key\ncount key\n...`.

    $ cat data.txt
    5 dave
    7 mike
    9 skye
    13 shaggy
    $ cat data.txt | freqchart
    4 unique keys
    34 total count

      shaggy                  |--------------------------------------                                                              | 13 (38.2%)
      skye                    |--------------------------                                                                          | 9 (26.5%)
      mike                    |---------------------                                                                               | 7 (20.6%)
      dave                    |---------------                                                                                     | 5 (14.7%)

    0 crossed out
    0 removed
    4 active

Subsequently, this will work if fed the data of a Git Repository with `git shortlog -ns`.

`freqchart` will also take filenames to read from as additional arguments.

You can supply a file with `-r` that contains keys (names in this case) to remove from the final
output.

    $ cat remove.txt
    mike
    $ freqchart -r remove.txt data.txt
    4 unique keys
    34 total count

      shaggy                  |--------------------------------------                                                              | 13 (38.2%)
      skye                    |--------------------------                                                                          | 9 (26.5%)
      dave                    |---------------                                                                                     | 5 (14.7%)

    0 crossed out
    1 removed
    3 active

You can supply a file with `-x` that contains keys (names in this case as well) to cross out of the output
(and color red).

    $ cat crossout.txt
    shaggy
    $ freqchart -x crossout.txt data.txt
    4 unique keys
    34 total count

    X shaggy                  |--------------------------------------                                                              | 13 (38.2%)
      skye                    |--------------------------                                                                          | 9 (26.5%)
      mike                    |---------------------                                                                               | 7 (20.6%)
      dave                    |---------------                                                                                     | 5 (14.7%)

    1 crossed out
    0 removed
    3 active

Advanced Examples
-----------------

Simulate flipping a coin (with bash and pipelines)

    $ for ((i=0;i<100;i++)); do ((RANDOM % 2 == 1)) && echo 'heads' || echo 'tails'; done | sort | uniq -c
      59 heads
      41 tails
    $ for ((i=0;i<100;i++)); do ((RANDOM % 2 == 1)) && echo 'heads' || echo 'tails'; done | sort | uniq -c | freqchart
    2 unique keys
    100 total count

      tails                   |-------------------------------------------------------                                             | 55 (55.0%)
      heads                   |---------------------------------------------                                                       | 45 (45.0%)

    0 crossed out
    0 removed
    2 active

Check out a git repository

    $ git clone git://github.com/joyent/node.git
    $ cd node
    node $ git shortlog -ns | head -20 | freqchart
    20 unique keys
    7355 total count

      Ryan Dahl               |-----------------------------------------                                                           | 3021 (41.1%)
      Isaac Z. Schlueter      |--------------------                                                                                | 1472 (20.0%)
      Ben Noordhuis           |---------------                                                                                     | 1087 (14.8%)
      Bert Belder             |-------                                                                                             | 511 (6.9%)
      Fedor Indutny           |---                                                                                                 | 254 (3.5%)
      Nathan Rajlich          |--                                                                                                  | 175 (2.4%)
      Koichi Kobayashi        |--                                                                                                  | 156 (2.1%)
      Felix Geisendörfer      |--                                                                                                  | 119 (1.6%)
      Igor Zinkovsky          |-                                                                                                   | 96 (1.3%)
      Andreas Madsen          |-                                                                                                   | 56 (0.8%)
      Trevor Norris           |-                                                                                                   | 55 (0.7%)
      Shigeki Ohtsu           |-                                                                                                   | 52 (0.7%)
      Timothy J Fontaine      |-                                                                                                   | 49 (0.7%)
      Maciej Małecki          |-                                                                                                   | 49 (0.7%)
      Micheil Smith           |-                                                                                                   | 45 (0.6%)
      Brian White             |-                                                                                                   | 39 (0.5%)
      Herbert Vojčík          |                                                                                                    | 36 (0.5%)
      Tom Hughes-Croucher     |                                                                                                    | 35 (0.5%)
      Paul Querna             |                                                                                                    | 24 (0.3%)
      Henry Rawas             |                                                                                                    | 24 (0.3%)

    0 crossed out
    0 removed
    20 active

Usage
-----

    Usage: freqchart [-b] [-c <char>] [-h] [-r <file>] [-u] [-v] [-w <width>] [-x <file>] file1 file2 ...

    Command line tool for generating frequency charts

    examples

      git shortlog -ns | freqchart

    options
      -b, --boring             disable color output
      -c, --char <char>        the character to use for drawing charts, defaults to -
      -h, --help               print this message and exit
      -r, --remove <file>      an optional file that contains a newline separated set of keys to ignore
      -u, --updates            check for available updates
      -v, --version            print the version number and exit
      -w, --width <width>      the width of the graphs drawn, defaults to 100
      -x, --cross-out <file>   an optional file that contains a newline separated set of keys to X out

License
-------

MIT License
