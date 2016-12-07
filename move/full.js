//
// connection.js
//

var os = require('os');
var util = require('util');
var bleno = require('bleno');
var gpio = require('onoff').Gpio;

var BlenoDescriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var fullCharacteristicUUID = 'ffffffff-ffff-ffff-fff3-fffffffffff1';

var FullCharacteristic = function() { 
	
	FullCharacteristic.super_.call(
		this, 
		{
			uuid: fullCharacteristicUUID,
			properties: ['write'],
			descriptors: [
				new BlenoDescriptor({
					uuid: fullCharacteristicUUID,
					value: 'Operates the curtain without considering any external conditions.'
				})
			]
		}
	);
	
	this._value = new Buffer(0);
	
};

FullCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	
	if (offset) {
		
		callback(this.RESULT_ATTR_NOT_LONG);
		
	} else if (data.length > 50) {
		
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
		
	} else {
		
		var data = data.toString('utf8');
		var json = JSON.parse(data);
		
		var action = json.action;
		
		var led = new gpio((action == 'open' ? 17 : 18), 'out');
		
		led.writeSync(1);		
		
		setTimeout(function(){
			led.writeSync(0);
			led.unexport();
		}, 10*1000);
		
		callback(this.RESULT_SUCCESS);
		
	}
	
};

util.inherits(FullCharacteristic, BlenoCharacteristic);
module.exports = FullCharacteristic;
