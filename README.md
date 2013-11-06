# Cylon.js For i2c

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This module provides drivers for i2c devices (https://en.wikipedia.org/wiki/I%C2%B2C). You would not normally use this module directly, instead it is used by Cylon.js adaptors that have i2c support. 

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-i2c.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-i2c)

## Getting Started

Install the module with: `npm install cylon-i2c`

## Examples

### Javascript:
```javascript
var Cylon = require('cylon');

// Initialize the robot
Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: {name: 'blinkm', driver: 'blinkm'},

  work: function(my) {
    var lit = false;
    my.blinkm.on('start', function() {
      my.blinkm.off()
      every((1).seconds(), function() {
        if (lit === true) {
          lit = false;
          my.blinkm.rgb(0xaa, 0, 0);
        } else {
          lit = true;
          my.blinkm.rgb(0, 0, 0);
        }
      });
    });
  }
}).start();
```

### CoffeeScript:
```coffee-script
Cylon = require('cylon')

Cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

  device:
    name: 'blinkm', driver: 'blinkm'

  work: (my) ->
    lit = false

    my.blinkm.on 'start', ->
      my.blinkm.off()

      every 1.second(), ->
        if lit
          lit = false
          my.blinkm.rgb 0xaa, 0, 0
        else
          lit = true
          my.blinkm.rgb 0, 0, 0      

.start()
```

## Hardware Support
Cylon.js has a extensible system for connecting to hardware devices. The following i2c devices are currently supported:

  - BlinkM
  
More drivers are coming soon...

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
None yet...

## License
Copyright (c) 2013 The Hybrid Group. Licensed under the Apache 2.0 license.
