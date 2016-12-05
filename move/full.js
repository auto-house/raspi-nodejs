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
	
	console.log('Move Service - Full Characteristic - Write Request.');
    
	if (offset) {
		
		console.log('Move Service - Full Characteristic - Result attribute not long enoght.');
		callback(this.RESULT_ATTR_NOT_LONG);
		
	} else if (data.length > 50) {
		
		console.log('Move Service - Full Characteristic - Data length over specified limit.');
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
		
	} else {
		
		var data = data.toString('utf8');
		var json = JSON.parse(data);
		
		var action = json.action;
		
		var led = new gpio((action == 'open' ? 17 : 18), 'out');
		
		console.log('Started moving... ' + action + ',' + (action == 'open' ? 17 : 18) + '.');
		
		led.writeSync(1);		
		setTimeout(function(){
			console.log('Hey you...');
			led.writeSync(0);
			led.unexport();
		}, 10000);
			
		console.log('Finished moving...');
		
		callback(this.RESULT_SUCCESS);
		
	}
	
};

util.inherits(FullCharacteristic, BlenoCharacteristic);
module.exports = FullCharacteristic;
