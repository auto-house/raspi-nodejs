//
// handler.js
//
// Handles motor control, led control and other stuff.
//

var os = require('os');
var util = require('util');
var gpio = require('onoff').Gpio;

module.exports = {
	
	moveCurtain: function (movement) {
		
		if (movement == 0) {
			
			console.log('open curtain...');
				
		}else if (movement == 1) {
			
			console.log('close curtain...');
				
		}
		
	},
		
	blinkLED: function () {
			
		console.log('blink function called...');	
			
	}
  
};
