'use strict';

var i2c = source("cylon-i2c");

describe("Cylon.Drivers.I2C", function() {
  it("standard async test", function(done) {
    var bool;
    bool = false;
    bool.should.be["false"];

    setTimeout(function() {
      bool.should.be["false"];
      bool = true;
      bool.should.be["true"];
    });

    150;

    setTimeout(function() {
      bool.should.be["true"];
      done();
    });

    300;
  });

  it("standard sync test", function() {
    var data, obj;
    data = [];

    obj = {
      id: 5,
      name: 'test'
    };

    data.should.be.empty;
    data.push(obj);
    data.should.have.length(1);
    data[0].should.be.eql(obj);
    data[0].should.be.equal(obj);
  });

  it("should be able to register", function() {
    i2c.register.should.be.a('function');
  });

  it("should be able to create led driver", function() {
    i2c.driver.should.be.a('function');
  });

});
