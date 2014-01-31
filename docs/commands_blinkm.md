# Commands

## goToRGB()

Public: Sets the color of the BlinkM RGB LED to the specified combination of RGB color provided. 
(red, green and blue values should be between 0 and 255)

Returns (r, g, b, cb).

## fadeToRGB()

Public: Fades the color of the BlinkM RGB LED to the specified combination of RGB color provided. 
(red, green and blue values should be between 0 and 255)

Returns (r, g, b, cb).

## fadeToHSB()

Public: Fades the color of the BlinkM RGB LED to the specified combination of HSB provided.

Returns (h, s, b, cb).

## fadeToRandomRGB()

Public: Fades the color of the BlinkM RGB LED to a random combination of RGB color. 
(red, green and blue values should be between 0 and 255)

Returns (r, g, b, cb).

## fadeToRandomHSB()

Public: Fades the color of the BlinkM RGB LED to a random combination of HSB .

Returns (h, s, b, cb).

## playLightScript()

Public: Plays a light script for the BlinkM RGB LED.

Returns (id, repeats, startAtLine, cb).

## stopScript()

Public: Stops an specific script for the BlinkM RGB LED.

Returns cb.

## setFadeSpeed()

Public: Sets a time adjust for the BlinkM RGB LED.

Returns (time, cb).

## getRGBColor()

Public: Returns an array containing the RGB values for the current color
(all integer between 0 and 255).

Returns integer_array (cb).

## setAddress()

Public: Returns an sring describing the I2C addresss being used.

Returns (address, cb).

## getFirmware()

Public: Returns an sring describing the I2C firmware version being used.

Returns integer_value.