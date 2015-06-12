"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    arduino: { adaptor: "firmata", port: "/dev/tty.usbmodem1421" }
  },

  devices: {
    accel: { driver: "lsm9ds0xm" }
  },

  work: function(my) {
    every((1).second(), function() {
      my.accel.getAccel(function(err, data) {
        if (err) { console.error(err); }
        console.log(data);
      });
    });
  }
}).start();
