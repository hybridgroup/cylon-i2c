"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    board: { adaptor: "chip" }
  },

  devices: {
    bmp180: { driver: "bmp180" }
  },

  work: function(my) {
    every((1).seconds(), function() {
      my.bmp180.getAltitude(0, null, function(err, data) {
        if (err) { console.error("Error:", err); }
        console.log(data);
      });
      my.bmp180.getTemperature(function(err, data) {
        if (err) { console.error("Error:", err); }
        console.log(data);
      });
      my.bmp180.getPressure(0, function(err, data) {
        if (err) { console.error("Error:", err); }
        console.log(data);
      });
    });
  }
}).start();
