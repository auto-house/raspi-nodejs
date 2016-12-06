
var os = require('os');
var util = require('util');
var bleno = require('bleno');
var Gpio = require('onoff').Gpio;

var Rele = require('./controllersHW/rele')
var RelayContr = new Rele();

var BlenoDescriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var RelayCharacteristic = function() { 
	
	RelayCharacteristic.super_.call(
		this, 
		{
			uuid: 'ffffffff-ffff-ffff-fff5-fffffffffff1',
			properties: [
				'write'
			],
			descriptors: [
				new BlenoDescriptor({
					uuid: 'ffffffff-ffff-ffff-fff5-fffffffffff1',
					value: 'Enable relay module'
				})
			]
		}
	);
	
	this._value = new Buffer(0);
	
};

RelayCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	
	console.log('Connection Characteristic - Write Request.');
    
	if (offset) {
		
		callback(this.RESULT_ATTR_NOT_LONG);
		
	} else if (data.length > 50) {
		
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
		
	} else {
		
		var data = data.toString('utf8');
		var json = JSON.parse(data);
		
		var action = json.action;

		var pin = new gpio(4, 'out'); //mudar pino
		
		if (action == 'enable') {
			
			RelayContr.on(pin);
			
		} else {

			RelayContr.off(pin);

		}

		pin.unexport();

		callback(this.RESULT_SUCCESS);
		
	}
	
};

util.inherits(RelayCharacteristic, BlenoCharacteristic);
module.exports = RelayCharacteristic;
