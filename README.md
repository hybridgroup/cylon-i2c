# Cylon.js For i2c

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things (IoT) using Node.js.

This module provides drivers for i2c devices (https://en.wikipedia.org/wiki/I%C2%B2C). You must use this module alongside Cylon.js adaptors that have i2c support, such as [cylon-firmata](https://github.com/hybridgroup/cylon-firmata).

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-i2c.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-i2c) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-i2c/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-i2c) [![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-i2c/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-i2c)

## Getting Started

Install the module with: `npm install cylon cylon-i2c`

Note you must also install whichever adaptor you want to use, such as: `npm install cylon-firmata`

## Example

```javascript
var Cylon = require('cylon');

// Initialize the robot
Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    blinkm: { driver: 'blinkm'}
  },

  work: function(my) {
    var lit = false;
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
  }
}).start();
```

## Hardware Support
Cylon.js has a extensible system for connecting to hardware devices. The following 15 different i2c devices are currently supported:

  - BlinkM RGB LED
  - BMP180 Barometric Pressure + Temperature sensor
  - Direct I2C
  - HMC5883L 3-Axis Digital Compass
  - HMC6352 Digital Compass
  - JHD1313M1 LCD with RGB Backlight  
  - LCD
  - LIDAR-Lite
  - LSM9DS0G 9 Degrees of Freedom IMU
  - LSM9DS0XM 9 Degrees of Freedom IMU
  - MAG3110 3-Axis Digital Magnetometer
  - MPL115A2 Digital Barometer & Thermometer
  - MPU6050 Triple Axis Accelerometer and Gyro
  - PCA9544a 4-Channel I2C Mux
  - PCA9685 16-Channel 12-bit PWM/Servo Driver

More drivers are coming soon...

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing

For our contribution guidelines, please go to [https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
](https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
).

## Release History

For the release history, please go to [https://github.com/hybridgroup/cylon-i2c/blob/master/RELEASES.md
](https://github.com/hybridgroup/cylon-i2c/blob/master/RELEASES.md
).

## License
Copyright (c) 2013-2016 The Hybrid Group. Licensed under the Apache 2.0 license.
