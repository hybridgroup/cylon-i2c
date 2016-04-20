"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    edison: {adaptor: "intel-iot"}
  },

  devices: {
    mag: { driver: "mag3110"}
  },

  work: function(my) {
    every((1).seconds(), function() {
      my.mag.getMag(function(err, data) {
        if (err) {
          console.error(err);
        } else {
          console.log(data);
        }
      });
    });
  }
}).start();
