
var os = require('os');
var util = require('util');
var bleno = require('bleno');
var Gpio = require('onoff').Gpio;
var Sleep = require('sleep');
 
var Ldr = require('./controllersHW/ldr');
var LdrContr = new Ldr();

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
		
			
		var bool = true;
		var ldrLevel = 0;
		var pin = new Gpio(27, 'out');
			

		while (bool){

			ldrLevel = LdrContr.ldr(pin);

			if (ldrLevel >= action){

				var servM = new gpio(23, 'out');
		
				console.log('Started moving, open');
		
				servM.writeSync(1);		
				setTimeout(function(){
					console.log('Hey you...');
					servM.writeSync(0);
					servM.unexport();
					}, 10000);

				bool = false;
			} 

			Sleep.sleep(60);
		}

		pin.unexport();
		
		callback(this.RESULT_SUCCESS);
		
	}
	
};

util.inherits(LDRExternalCharacteristic, BlenoCharacteristic);
module.exports = LDRExternalCharacteristic;
