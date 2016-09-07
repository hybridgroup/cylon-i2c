"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    edison: { adaptor: "intel-iot" }
  },

  devices: {
    gyro: { driver: "l3gd20h" }
  },

  work: function(my) {
    every((1).second(), function() {
      my.gyro.getGyro(function(err, data) {
        if (err) { console.error(err); }
        console.log(data);
      });
    });
  }
}).start();
