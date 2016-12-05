var Gpio = require('onoff').Gpio;

var Rele = function() {

};

Rele.prototype.on = function(pin) {

	pin.writeSync(1);

};

Rele.prototype.off = function(pin) {

	pin.writeSync(0);

};

module.exports = Rele;