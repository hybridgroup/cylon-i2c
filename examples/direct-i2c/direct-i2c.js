"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    arduino: { adaptor: "firmata", port: "/dev/ttyACM0" }
  },

  devices: {
    thingie: { driver: "direct-i2c", address: 0x08 }
  },

  work: function(my) {
    every(100, function() {
      my.thingie.write(null, [1, 2, 3, 4, 5], function(err) {
        if (err) { console.error(err); }
      });
    });
  }
}).start();
