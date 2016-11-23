//
// connection.js
//

var os = require('os');
var util = require('util');
var bleno = require('bleno');
var Gpio = require('onoff').Gpio;

var BlenoDescriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var DAuthCharacteristic = function() { 
	
	DAuthCharacteristic.super_.call(
		this, 
		{
			uuid: 'ffffffff-ffff-ffff-fff0-fffffffffff3',
			properties: [
				'read', 
				'writeWithoutResponse',
				'notify'
			],
			descriptors: [
				new BlenoDescriptor({
					uuid: 'ffffffff-ffff-ffff-fff0-fffffffffff3',
					value: 'Returns the device authentication key.'
				})
			]
		}
	);
	
	this._value = new Buffer(0);
	
};

DAuthCharacteristic.prototype.onReadRequest = function(offset, callback) {
	
	console.log('Connection Characteristic - Read Request.');
	
	if (!offset) {
		this._value = new Buffer('acbd18db4cc2f85cedef654fccc4a4d8');
	}

    callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
    
};

DAuthCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	
	console.log('Connection Characteristic - Write Request.');
    
	if (offset) {
		
		callback(this.RESULT_ATTR_NOT_LONG);
		
	} else if (data.length > 50) {
		
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
		
	} else {
		
		var data = data.toString('utf8');
		var json = JSON.parse(data);
		
		var action = json.action;
		
		if (action == 'blinkLED') {
			
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

util.inherits(DAuthCharacteristic, BlenoCharacteristic);
module.exports = DAuthCharacteristic;
