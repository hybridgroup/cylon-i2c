"use strict";

var Cylon = require('cylon');

var Hover = module.exports = function Hover(opts) {
  Hover.__super__.constructor.apply(this, arguments);
	this.commands = {
    getEvent: this.getEvent,
    getEventString: this.getEventString
  }
  var extraParams = opts.extraParams || {};

  this.address = 0x42;
	this.tsPin = extraParams.tsPin || 5;
	this.resetPin = extraParams.resetPin || 6;
};

Cylon.Utils.subclass(Hover, Cylon.Driver);

Hover.prototype.start = function() {
	var self = this;
  Hover.__super__.start.apply(this, arguments);
	self.connection.pinMode(self.tsPin, 'input');
	self.connection.digitalWrite(self.resetPin, 0);

  after((5).seconds(), function() {
  	self.connection.digitalWrite(self.resetPin, 1);
  	self.connection.pinMode(self.resetPin, 'input');

  	after((5).seconds(), function() {
			console.log("ready");
		  self.connection.digitalRead(self.tsPin, function(data) {
		  	console.log("read");
		  	console.log(data);
		  	if (data == 0) {
		  		self.connection.digitalWrite(self.tsPin, 0);
		  		self.getEvent();
		  	}
		  });
  	});
  });
};

Hover.prototype.getEvent = function() {
  var self = this;
  this.connection.i2cRead(this.address, null, 18, function(data) {
  	console.log(data);
  	if (data) {self.device.emit('gesture', self.parseEvent(data));}
  	self.connection.digitalWrite(self.tsPin, 1);
  	self.connection.pinMode(self.tsPin, 'input');
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
	var e = null;
	for (var i = 0; i < val.length; i++) {
		var data = val[i];

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
	return e;
};
