"use strict";

var Cylon = require('cylon');

var Hover = module.exports = function Hover(opts) {
  Hover.__super__.constructor.apply(this, arguments);
  this.commands = ['getEvent', 'getEventString'];
  this.address = 0x42;
};

Cylon.Utils.subclass(Hover, Cylon.Driver);

Hover.prototype.start = function() {
	this.connection.i2cConfig(50);
  Hover.__super__.start.apply(this, arguments);
};

Hover.prototype.getEvent = function(callback) {
  var self = this;
  this.connection.i2cRead(this.address, null, 18, function(data) {
    callback(self.parseEvent(data));
  });
};

Hover.prototype.getEventString = function(eventByte) {
	switch (eventByte) {
    case parseInt('00100010', 2):
      return "Right Swipe";
    case parseInt('00100100', 2):
      return "Left Swipe";
    case parseInt('00101000', 2):
      return "Up Swipe";
    case parseInt('00110000', 2):
      return "Down Swipe";
    case parseInt('01000001', 2):
      return "Tap South";
    case parseInt('01000010', 2):
      return "Tap West";
    case parseInt('01010000', 2):
      return "Tap Center";
    case parseInt('01001000', 2):
      return "Tap East";
    case parseInt('01000100', 2):
      return "Tap North";
    default:
      return null;
  }
};

Hover.prototype.parseEvent = function(val) {
	for (var i = 0; i < val.length; i++) {
		var data = val.charAt(i);
		var e;

		if (i == 10 && data > 1) {
			e = (parseInt('00000001', 2) << (data-1)) | parseInt('00100000', 2);
			return e;
		}
		if (i == 14 && data > parseInt('11111', 2)) {
			e = ((data & parseInt('11100000', 2)) >> 5) | parseInt('01000000', 2) ;
			return e;
		}
		if (i == 15 && data > 0) {
			e = (((data & parseInt('0011', 2)) << 3) | parseInt('01000000', 2));
			return e;
		}
	}
};
