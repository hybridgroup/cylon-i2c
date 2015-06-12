"use strict";

var Cylon = require("cylon");

Cylon
  .robot()
  .connection("arduino", { adaptor: "firmata", port: "/dev/tty.usbmodem1421" })
  .device("gyro", { driver: "lsm9ds0g" })

  .on("ready", function(bot) {
    setInterval(function() {
      bot.gyro.getGyro(function(err, data) {
        if (err) { console.error(err); }
        console.log(data);
      });
    }, 1000);
  });

Cylon.start();
