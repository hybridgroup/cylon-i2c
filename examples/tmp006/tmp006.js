"use strict";

var Cylon = require("cylon");

Cylon.robot({
    connections: {
        edison: { adaptor: "intel-iot" }
    },

    devices: {
        tmp: { driver: "tmp006" }
    },

    work: function(my) {
      every((1).seconds(), function() {
        my.tmp.readObjTempC(function(err, data) {
          if (err) {
            console.error(err);
          } else {
            console.log(data);
          }
        });
      });
    }
}).start();
