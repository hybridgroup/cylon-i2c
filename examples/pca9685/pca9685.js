"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    arduino: { adaptor: "firmata", port: "/dev/ttyACM0" }
  },

  devices: {
    pca9685_x1: {
        driver: "pca9685",
        details: { address: 0x40 } 
    },

    pca9685_x2: {
        driver: "pca9685",
        details: { address: 0x41 } 
    }
  },

  work: function(my) {
    my.pca9685_x1.setPWM(0,0,320);
    my.pca9685_x2.setPWM(0,0,320);
  }
}).start();
