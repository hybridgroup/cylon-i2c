"use strict";

var cylon = require("cylon");

// We must use a mutex lock to ensure the mux state when reading values
var lock = new (require("rwlock"))();

// Mutex protected initialization
var getCoefficients = function(setChannel, bmp180) {
    return lock.writeLock("i2c1_0x73", function(release) {
      return setChannel(function() {
        return bmp180.readCoefficients(function(err) {
          if (err) {
            console.log(err);
          }
          return release();
        });
      });
    });
  };

// Mutex protected data read
var getMeasurement = function(index, setChannel, bmp180) {
    return lock.writeLock("i2c1_0x73", function(release) {
      return setChannel(function() {
        return bmp180.getPressure(1, function(err, val) {
          if (err) {
            console.log(err);
          } else {
            val.time = Math.floor(Date.now() / 1000);
            console.log(index + " " + JSON.stringify(val));
          }
          release();
          return;
        });
      });
    });
  };

var robot_config = {
    name: "test",
    connections: {
      raspi: {
        adaptor: "raspi"
      }
    },
    devices: {
      pca9544a: {
        driver: "pca9544a",
        connection: "raspi",
        address: "0x73"
      },
      bmp180_0: {
        driver: "bmp180",
        connection: "raspi",
        address: "0x77"
      },
      bmp180_1: {
        driver: "bmp180",
        connection: "raspi",
        address: "0x77"
      }
    },
    work: function(my) {
      /* The mux is in an unkown state at startup, so we mush re-read th
      *   coefficients with a mutex protected call to ensure valid data
      */
      getCoefficients(my.pca9544a.setChannel1, my.bmp180_1);
      getCoefficients(my.pca9544a.setChannel0, my.bmp180_0);
      return every(20..seconds(), function() {
        getMeasurement(1, my.pca9544a.setChannel1, my.bmp180_1);
        getMeasurement(0, my.pca9544a.setChannel0, my.bmp180_0);
        return;
      });
    }
  };

cylon.robot(robot_config);

cylon.start();
