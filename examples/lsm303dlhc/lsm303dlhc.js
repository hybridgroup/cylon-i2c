"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    edison: { adaptor: "intel-iot" }
  },

  devices: {
    accel: { driver: "lsm303dlhc" },
    mag: { driver: "lsm303dlhc" }
  },

  work: function(my) {
    every((1).second(), function() {
      my.accel.getAccel(function(err, data) {
        if (err) { console.error(err); }
        console.log(data);
      });
      my.mag.getMag(function(err, data) {
        if (err) { console.error(err); }
        console.log(data);
      });
    });
  }
}).start();
