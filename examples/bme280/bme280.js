/**
 * On the BME280:
 *   3V, GND
 *   Clock is SCK
 *   Data is SDI
 */
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    raspi: { adaptor: 'raspi' }
  },

  devices: {
    bme280: { driver: 'bme280' }
  },

  work: function(my) {

    my.bme280.readTemperature(function(err, val) {
      if (err) {
        console.log(err);
        return;
      }

      console.log("readTemperature call:");
      console.log("\tTemp: " + val.temp.toFixed(2) + " C");
    });

    after((1).second(), function() {
      my.bme280.readPressure(function(err, val) {
        if (err) {
          console.log(err);
          return;
        }

        console.log("readPressure call:");
        console.log("\tTemperature: " + val.temp.toFixed(2) + " C");
        console.log("\tPressure: " + (val.press / 100).toFixed(2) + " hPa");
      });
    });

    after((2).seconds(), function() {
      my.bme280.readAltitude(null, function(err, val) {
        if (err) {
          console.log(err);
          return;
        }

        console.log("readAltitude call:");
        console.log("\tTemperature: " + val.temp.toFixed(2) + " C");
        console.log("\tPressure: " + (val.press / 100).toFixed(2) + " hPa");
        console.log("\tAltitude: " + (val.alt).toFixed(2) + " m");
      });
    });

    after((1).second(), function() {
      my.bme280.readHumidity(function(err, val) {
        if (err) {
          console.log(err);
          return;
        }

        console.log("readHumidity call:");
        console.log("\tRel. Humidity: " + val.hum.toFixed(2) + " %");
      });
    });

  }
}).start();

