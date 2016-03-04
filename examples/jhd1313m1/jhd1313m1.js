"use strict";

var Cylon = require("cylon");

var robot = Cylon.robot({
  connections: {
    arduino: { adaptor: "firmata", port: "/dev/ttyACM0" }
  },

  devices: {
    lcd: { driver: "jhd1313m1" }
  },

  work: function(my) {
    my.lcd.write("Hello");
    my.lcd.setColor(255, 0, 0);
  }
});

robot.start();
