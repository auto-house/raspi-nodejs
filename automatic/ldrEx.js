
var os = require('os');
var util = require('util');
var bleno = require('bleno');
var Gpio = require('onoff').Gpio;

var BlenoDescriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var LDRExternalCharacteristic = function() { 
	
	LDRExternalCharacteristic.super_.call(
		this, 
		{
			uuid: 'ffffffff-ffff-ffff-fff4-fffffffffff1',
			properties: [
				'write'
			],
			descriptors: [
				new BlenoDescriptor({
					uuid: 'ffffffff-ffff-ffff-fff1-fffffffffff1',
					value: 'Open the curtain automatically according LDR'
				})
			]
		}
	);
	
	this._value = new Buffer(0);
	
};

LDRExternalCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	
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
			
			var pin = new Gpio(27, 'out');
			
			//criar um while com if ou case, que fica ferificando o valo do ldr e ve se ja esta 
			//no nivel certo, caso esteja no nivel certo ele abre a cortina e sai do loop.
			
		}
		
		callback(this.RESULT_SUCCESS);
		
	}
	
};

util.inherits(LDRExternalCharacteristic, BlenoCharacteristic);
module.exports = LDRExternalCharacteristic;
