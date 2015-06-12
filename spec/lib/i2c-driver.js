"use strict";

var Cylon = require("cylon");

var I2CDriver = lib("i2c-driver");

describe("I2CDriver", function() {
  var driver;

  beforeEach(function() {
    driver = new I2CDriver({
      name: "mpl115a2",
      address: 0x40
    });
  });

  it("is a Cylon driver", function() {
    expect(driver).to.be.an.instanceOf(I2CDriver);
    expect(driver).to.be.an.instanceOf(Cylon.Driver);
  });

  describe("constructor", function() {
    it("sets @address to provided value", function() {
      expect(driver.address).to.be.eql(0x40);
    });
  });

  it("provides a basic #start method", function() {
    var callback = spy();
    driver.start(callback);
    expect(callback).to.be.called;
  });

  it("provides a basic #halt method", function() {
    var callback = spy();
    driver.halt(callback);
    expect(callback).to.be.called;
  });
});
