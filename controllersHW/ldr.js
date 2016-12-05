var Gpio = require('onoff').Gpio;
var sleep = require('sleep')

var count = 0;

var Ldr = function() {

};

Ldr.prototype.ldr = function(pin) {

	pin.writeSync(0);
	sleep.usleep(100000);

	pin.setDirection('in');

	while (pin.readSync() == 0){
		count++;
	}

	return count;

};

module.exports = Ldr;