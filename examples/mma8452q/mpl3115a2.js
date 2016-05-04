"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    board: { adaptor: "intel-iot" }
  },

  devices: {
    mpl3115a2: { driver: "mpl3115a2" }
  },

  work: function(my) {
    every((1).seconds(), function() {
      my.mpl3115a2.getAltitude(0, null, function(err, data) {
        if (err) { console.error("Error:", err); }
        console.log(data);
      });
      my.mpl3115a2.getTemperature(function(err, data) {
        if (err) { console.error("Error:", err); }
        console.log(data);
      });
      my.mpl3115a2.getPressure(0, function(err, data) {
        if (err) { console.error("Error:", err); }
        console.log(data);
      });
    });
  }
}).start();
