var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'mpl115a2', driver: 'mpl115a2' },

  work: function(my) {
    every((1).seconds(), function() {
      my.mpl115a2.getPressure(function(err, data) {
        console.log(err, data);
      });
    });
  }
}).start();
