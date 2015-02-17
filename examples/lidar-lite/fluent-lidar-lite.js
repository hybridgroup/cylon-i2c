"use strict";

var Cylon = require("cylon");

Cylon
  .robot()
  .connection("arduino", { adaptor: "firmata", port: "/dev/ttyACM0" })
  .device("lidar", { driver: "lidar-lite" })
  .on("ready", function(bot) {
    setInterval(function() {
      bot.lidar.distance(function(err, data) {
        console.log(err, data);
      });
    }, 100);
  });

Cylon.start();
