//
// connection.js
//

var os = require('os');
var util = require('util');
var bleno = require('bleno');
var Gpio = require('onoff').Gpio;

var BlenoDescriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var LEDCharacteristic = function() { 
	
	LEDCharacteristic.super_.call(
		this, 
		{
			uuid: 'ffffffff-ffff-ffff-fff1-fffffffffff1',
			properties: [
				'write'
			],
			descriptors: [
				new BlenoDescriptor({
					uuid: 'ffffffff-ffff-ffff-fff1-fffffffffff1',
					value: 'Makes the demo LED blink for 20s.'
				})
			]
		}
	);
	
	this._value = new Buffer(0);
	
};

LEDCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	
	console.log('Connection Characteristic - Write Request.');
    
	if (offset) {
		
		callback(this.RESULT_ATTR_NOT_LONG);
		
	} else if (data.length > 50) {
		
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
		
	} else {
		
		var data = data.toString('utf8');
		var json = JSON.parse(data);
		
		var action = json.action;
		
		if (action == 'blink-led') {
			
			var led = new Gpio(4, 'out');
			
			var blink = setInterval(function(){
				led.writeSync(led.readSync() == 0 ? 1 : 0);	
			}, 500);
			setTimeout(function(){
				clearInterval(blink);
				led.writeSync(0);
				led.unexport();
			}, 50000);
			
			console.log('Now blinking...');
			
		}
		
		callback(this.RESULT_SUCCESS);
		
	}
	
};

util.inherits(LEDCharacteristic, BlenoCharacteristic);
module.exports = LEDCharacteristic;
