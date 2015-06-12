"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    arduino: { adaptor: "firmata", port: "/dev/ttyACM0" }
  },

  devices: {
    mpl115a2: { driver: "mpl115a2" }
  },

  work: function(my) {
    every((1).seconds(), function() {
      my.mpl115a2.getPressure(function(err, data) {
        if (err) { console.error(err); }
        console.log(err, data);
      });
    });
  }
}).start();
