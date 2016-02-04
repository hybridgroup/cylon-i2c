"use strict";

var Pca9544a = lib("pca9544a");
var address = 0x70;

describe("Cylon.Drivers.I2C.Pca9544a", function() {
  var driver;

  beforeEach(function() {
    driver = new Pca9544a({
      name: "Pca9544a",
      connection: {},
      address: address,
      pin: 13
    });
  });

  describe("#constructor", function() {
    it("sets @address to 0x" + address.toString(16), function() {
      expect(driver.address).to.be.eql(address);
    });
  });

  describe("#commands", function() {
    it("is an object containing PCA9544A commands", function() {
      for (var c in driver.commands) {
        expect(driver.commands[c]).to.be.a("function");
      }
    });
  });

  describe("#start", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.enable = spy();
      driver.emit = spy();
      driver.start(callback);
    });

    afterEach(function() {
      driver.enable = undefined;
      driver.emit = undefined;
    });

    it("emits the 'start' event", function() {
      expect(driver.emit).to.be.calledWith("start");
    });

    it("calles enable", function() {
      expect(driver.enable).to.be.calledWith(callback);
    });

  });

  describe("#enable", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.enable(callback);
      });

      it("calls i2cWrite to enable", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x04]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.enable(callback);
      });

      it("calls i2cWrite to enable", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x04]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#setChannel with Invalid channel", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.setChannel(5, callback);
      });

      it("calls i2cWrite to disable", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x00]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.setChannel(5, callback);
      });

      it("calls i2cWrite to disable", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x00]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#setChannel with 0", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.setChannel(0, callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x04]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.setChannel(0, callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x04]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#setChannel with 1", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.setChannel(1, callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x05]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.setChannel(1, callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x05]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#setChannel with 2", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.setChannel(2, callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x06]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.setChannel(2, callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x06]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#setChannel with 3", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.setChannel(3, callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x07]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.setChannel(3, callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x07]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#setChannel0", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.setChannel0(callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x04]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.setChannel0(callback);
      });

      it("calls i2cWrite to select channel 0", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x04]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#setChannel1", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.setChannel1(callback);
      });

      it("calls i2cWrite to select channel 1", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x05]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.setChannel1(callback);
      });

      it("calls i2cWrite to select channel 1", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x05]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#setChannel2", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.setChannel2(callback);
      });

      it("calls i2cWrite to select channel 2", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x06]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.setChannel2(callback);
      });

      it("calls i2cWrite to select channel 2", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x06]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#setChannel3", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.setChannel3(callback);
      });

      it("calls i2cWrite to select channel 3", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x07]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.setChannel3(callback);
      });

      it("calls i2cWrite to select channel 3", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x07]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#disable", function() {
    var callback;

    beforeEach(function() {
      callback = spy();
      driver.connection.i2cWrite = stub();
    });

    context("i2cWrite returns error", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, "error");
        driver.disable(callback);
      });

      it("calls i2cWrite to disable", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x00]);
      });

      it("executes callback with error", function() {
        expect(callback).to.be.calledWith("error");
      });
    });

    context("i2cWrite returns ok", function() {
      beforeEach(function() {
        driver.connection.i2cWrite.callsArgWith(3, null);
        driver.disable(callback);
      });

      it("calls i2cWrite to disable", function() {
        expect(driver.connection.i2cWrite).to.be.calledWith(
          address, 0x04, [0x00]);
      });

      it("executes callback", function() {
        expect(callback).to.be.calledWith();
      });
    });
  });

  describe("#getInterrupts", function() {
    it("must #getInterrupts");
  });

  describe("#getChannel", function() {
    it("must #getChannel");
  });

});
