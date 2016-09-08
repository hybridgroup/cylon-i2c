"use strict";

var Bme280 = lib("bme280");

/*
Debug output:

2016-06-02T02:32:59.580Z : [Robot 1] - Starting connections.
2016-06-02T02:32:59.627Z : [Robot 1] - Starting connection 'raspi'.
2016-06-02T02:32:59.636Z : [Robot 1] - Starting devices.
2016-06-02T02:32:59.637Z : [Robot 1] - Starting device 'bme280'.
2016-06-02T02:32:59.652Z : [Robot 1] - Working.
readRawTemp: 1 - meas=4
T1 : 0x6FCC, (28620)
T2 : 0x6673, (26227)
T3 : 0x0032, (50)
------------------------------
P1 : 0x8E0D, (36365)
P2 : 0xD5AF, (-10833)
P3 : 0x0BD0, (3024)
P4 : 0x1157, (4439)
P5 : 0x00CA, (202)
P6 : 0x00F9, (-7)
P7 : 0x26AC, (9900)
P8 : 0xD80A, (-10230)
P9 : 0x10BD, (4285)
------------------------------
H1 : 0x004B, (75)
H2 : 0x0168, (360)
H3 : 0x0000, (0)
H4 : 0x0143, (323)
H5 : 0x0000, (0)
H6 : 0x001E, (30)
readRawTemp: 2 - meas=145
readRawTemp Buffer <Buffer 80 86 e0>
Raw temp:526446, msb: 0x0080 lsb:0x0086 xlsb:0x00E0
readTemperature call:
        Temp: 21.43 C
readRawTemp: 1 - meas=4
readRawTemp: 2 - meas=145
readRawHumidity Buffer <Buffer 7b fe>
Raw hum:31742, msb: 0x007B lsb:0x00FE
readHumidity call:
        Rel. Humidity: 61.16 %
readRawTemp Buffer <Buffer 80 79 40>
Raw temp:526228, msb: 0x0080 lsb:0x0079 xlsb:0x0040
readRawPressure Buffer <Buffer 5d af a0>
Raw press:383738, msb: 0x005D lsb:0x00AF xlsb:0x00A0
readPressure call:
        Temperature: 21.36 C
        Pressure: 1014.21 hPa
readRawTemp: 1 - meas=4
readRawTemp: 2 - meas=145
readRawTemp Buffer <Buffer 80 7c a0>
Raw temp:526282, msb: 0x0080 lsb:0x007C xlsb:0x00A0
readRawPressure Buffer <Buffer 5d ae a0>
Raw press:383722, msb: 0x005D lsb:0x00AE xlsb:0x00A0
readAltitude call:
        Temperature: 21.38 C
        Pressure: 1014.27 hPa
        Altitude: -8.45 m

*/

describe("Cylon.Drivers.I2C.Bme280", function() {
  var driver;

  beforeEach(function() {
    driver = new Bme280({
      name: "bme280",
      connection: {},
      pin: 13
    });
  });

  beforeEach(function() {
    // setup coefficients
    var coefficients = ["dig_T1", "dig_T2", "dig_T3", "dig_P1", "dig_P2",
                        "dig_P3", "dig_P4", "dig_P5", "dig_P6", "dig_P7",
                        "dig_P8", "dig_P9", "dig_H1", "dig_H2", "dig_H3",
                        "dig_H4", "dig_H5", "dig_H6"];
    var values = [0x6FCC, 0x6673, 0x0032, 0x8E0D, 0xD5AF,
                  0x0BD0, 0x1157, 0x00CA, 0x00F9, 0x26AC,
                  0xD80A, 0x10BD, 0x004B, 0x0168, 0x0000,
                  0x0143, 0x0000, 0x001E];

    for (var i = 0; i < coefficients.length; i++) {
      driver[coefficients[i]] = values[i];
    }
  });

  describe("constructor", function() {
    it("sets @address to 0x77", function() {
      expect(driver.address).to.be.eql(0x77);
    });
  });

  describe("#commands", function() {
    it("is an object containing BME280 commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

});
