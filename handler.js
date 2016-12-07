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
		
		var bridge = new gpio((movement == 0 ? 17 : 18), 'out');
		
		bridge.writeSync(1);		
		
		setTimeout(function(){
			bridge.writeSync(0);
			bridge.unexport();
		}, 10*1000);
		
	},
		
	blinkLED: function () {
			
		var led = new gpio(27, 'out');
			
		var blink = setInterval(function(){
			led.writeSync(led.readSync() == 0 ? 1 : 0);	
		}, 200);
			
		setTimeout(function(){
			clearInterval(blink);
			led.writeSync(0);
			led.unexport();
		}, 10*1000);
		
	}
  
};
