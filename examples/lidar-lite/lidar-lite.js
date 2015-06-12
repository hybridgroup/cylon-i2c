"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    arduino: { adaptor: "firmata", port: "/dev/ttyACM0" }
  },

  devices: {
    lidar: { driver: "lidar-lite" }
  },

  work: function(my) {
    every(100, function() {
      my.lidar.distance(function(err, data) {
        if (err) { console.error(err); }
        console.log("distance: " + data);
      });
    });
  }
}).start();
