Cylon = require('cylon')

Cylon.robot
  connection:
    name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'

  device:
    name: 'blinkm', driver: 'blinkm'

  work: (my) ->
    lit = false

    my.blinkm.on 'start', ->
      my.blinkm.version (version) ->
        Logger.info "Started BlinkM version #{version}"

      my.blinkm.off()

      every 1.second(), ->
        if lit
          lit = false
          my.blinkm.rgb 0xaa, 0, 0
        else
          lit = true
          my.blinkm.rgb 0, 0, 0      

.start()
