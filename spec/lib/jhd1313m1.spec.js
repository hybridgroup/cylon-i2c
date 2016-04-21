"use strict";

var Cylon = require("cylon");

var Jhd1313m1 = lib("jhd1313m1");

describe("Cylon.Drivers.I2C.Jhd1313m1", function() {
  var driver;

  beforeEach(function() {
    driver = new Jhd1313m1({
      name: "display",
      connection: {
        i2cWrite: spy()
      }
    });
  });

  describe("#constructor", function() {
    it("sets @address to 0x3E", function() {
      expect(driver.address).to.be.eql(0x3E);
    });

    it("sets @_backlightVal to NOBACKLIGHT", function() {
      expect(driver._backlightVal).to.be.eql(0x00);
    });

    it("sets @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04 | 0x00 | 0x00);
    });
  });

  describe("#commands", function() {
    it("is an object containing LCD commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#clear", function() {
    beforeEach(function() {
      stub(driver, "_sendCommand");
      driver.clear();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to clear the display", function() {
      expect(driver._sendCommand).to.be.calledWith(0x01);
    });

  });

  describe("#home", function() {
    beforeEach(function() {
      stub(Cylon.Utils, "sleep");
      stub(driver, "_sendCommand");
      driver.home();
    });

    afterEach(function() {
      Cylon.Utils.sleep.restore();
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to move the cursor to home", function() {
      expect(driver._sendCommand).to.be.calledWith(0x02);
    });

    it("Cylon.Utils.sleeps for 2ms", function() {
      expect(Cylon.Utils.sleep).to.be.calledWith(2);
    });
  });

  describe("#setCursor", function() {
    beforeEach(function() {
      stub(driver, "_sendCommand");
      driver.setCursor(10, 10);
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to move the display cursor", function() {
      expect(driver._sendCommand).to.be.calledWith(138);
    });
  });

  describe("#displayOff", function() {
    beforeEach(function() {
      stub(driver, "_sendCommand");
      driver.displayOff();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the display off", function() {
      expect(driver._sendCommand).to.be.calledWith(
        0x08 | driver._displaycontrol
      );
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0);
    });
  });

  describe("#displayOn", function() {
    beforeEach(function() {
      stub(driver, "_sendCommand");
      driver.displayOn();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the display on", function() {
      expect(driver._sendCommand).to.be.calledWith(
        0x08 | driver._displaycontrol
      );
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04);
    });
  });

  describe("#cursorOff", function() {
    beforeEach(function() {
      stub(driver, "_sendCommand");
      driver.cursorOff();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the cursor on", function() {
      expect(driver._sendCommand).to.be.calledWith(
        0x08 | driver._displaycontrol
      );
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04);
    });
  });

  describe("#cursorOn", function() {
    beforeEach(function() {
      stub(driver, "_sendCommand");
      driver.cursorOn();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the cursor on", function() {
      expect(driver._sendCommand).to.be.calledWith(
        0x08 | driver._displaycontrol
      );
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x06);
    });
  });

  describe("#cursorOff", function() {
    beforeEach(function() {
      stub(driver, "_sendCommand");
      driver.cursorOff();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the cursor on", function() {
      expect(driver._sendCommand).to.be.calledWith(
        0x08 | driver._displaycontrol
      );
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04);
    });
  });

  describe("#blinkOff", function() {
    beforeEach(function() {
      stub(driver, "_sendCommand");
      driver.blinkOff();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the blink on", function() {
      expect(driver._sendCommand).to.be.calledWith(
        0x08 | driver._displaycontrol
      );
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x04);
    });
  });

  describe("#blinkOn", function() {
    beforeEach(function() {
      stub(driver, "_sendCommand");
      driver.blinkOn();
    });

    afterEach(function() {
      driver._sendCommand.restore();
    });

    it("calls #_sendCommand to turn the blink on", function() {
      expect(driver._sendCommand).to.be.calledWith(
        0x08 | driver._displaycontrol
      );
    });

    it("changes @_displaycontrol", function() {
      expect(driver._displaycontrol).to.be.eql(0x05);
    });
  });

  describe("#write", function() {
    var chars = "hello world".split("");

    beforeEach(function() {
      stub(driver, "_writeData");
      driver.write("hello world");
    });

    afterEach(function() {
      driver._writeData.restore();
    });

    it("writes the string chars to the LCD with #_writeData", function() {
      for (var i = 0; i < chars; i++) {
        expect(driver._writeData).to.be.calledWith(chars[i]);
      }
    });
  });

  describe("#_sendCommand", function() {
    beforeEach(function() {
      driver._sendCommand(0xff);
    });

    it("applies the provided value to #i2cWrite", function() {
      expect(driver.connection.i2cWrite).to.be.calledWith(0x3E, 0x80, 0xff);
    });
  });

  describe("#_writeData", function() {
    beforeEach(function() {
      driver._writeData(0xff);
    });

    it("applies the provided value to #i2cWrite", function() {
      expect(driver.connection.i2cWrite).to.be.calledWith(0x3E, 0x40, 0xff);
    });
  });

});
