"use strict";

var Cylon = require("cylon");

Cylon
  .robot()
  .connection("arduino", { adaptor: "firmata", port: "/dev/tty.usbmodem1421" })
  .device("accel", { driver: "lsm9ds0xm" })
  .on("ready", function(bot) {
    setInterval(function() {
      bot.accel.getAccel(function(err, data) {
        console.log(data);
      });
    }, 1000);
  });

Cylon.start();
