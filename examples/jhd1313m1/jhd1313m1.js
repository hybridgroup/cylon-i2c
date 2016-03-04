"use strict";

var Cylon = require("cylon");

var robot = Cylon.robot({
  connections: {
    chip: { adaptor: "chip" }
  },

  devices: {
    lcd: { driver: "jhd1313m1" }
  },

  work: function(my) {
    my.lcd.write("Hello");
  }
});

robot.start();
