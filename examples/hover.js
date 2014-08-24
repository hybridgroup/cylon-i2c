var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  device: { name: 'hover', driver: 'hover' },

  work: function(my) {
    my.hover.on('gesture', function(data) {
      console.log(data);
    });
  }
}).start();
