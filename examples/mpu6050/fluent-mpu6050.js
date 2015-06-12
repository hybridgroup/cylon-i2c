"use strict";

var Cylon = require("cylon");

Cylon
  .robot()
  .connection("arduino", { adaptor: "firmata", port: "/dev/tty.usbmodem1421" })
  .device("mpu6050", { driver: "mpu6050" })
  .on("ready", function(bot) {
    setInterval(function() {
      bot.mpu6050.getMotionAndTemp(function(err, data) {
        if (err) { console.error(err); }
        console.log(err, data);
      });
    }, 1000);
  });

Cylon.start();
