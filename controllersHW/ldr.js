var Gpio = require('onoff').Gpio;
var sleep = require('sleep')

var Ldr = function() {

};

Ldr.prototype.ldr = function(pin) {

	var count = 0;
	var ret = 0;

	sleep.sleep(2);

	pin.writeSync(0);
	sleep.usleep(100000);

	pin.setDirection('in');

	while (pin.readSync() == 0){
		count++;
	}
 
	if (count < 120)
		ret = 3;
	else if (count >= 120 && count < 1000)
		ret = 2;
	else if (count >= 1000)
		ret = 1;

	return ret;

};

module.exports = Ldr;