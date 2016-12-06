var Gpio = require('onoff').Gpio;
var sleep = require('sleep')

var Ldr = function() {

};

Ldr.prototype.ldr = function(pin) {

	var count = 0;
	var ret = 0;

	pin.writeSync(0);
	sleep.usleep(100000);

	pin.setDirection('in');

	while (pin.readSync() == 0){
		count++;
	}

	if (count < 50)
		ret = 1;
	else if (count >= 50 && count <= 100)
		ret = 2;
	else if (count >= 100 && count <= 150)
		ret = 3;
	else if (count >= 150 && count <= 200)
		ret = 4;
	else if (count >= 200 && count <= 250)
		ret = 5;
	else if (count >= 250)
		ret = 6;

	return ret;

};

module.exports = Ldr;