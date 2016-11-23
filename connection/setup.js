//
// connection.js
//

var os = require('os');
var util = require('util');
var bleno = require('bleno');
var Gpio = require('onoff').Gpio;

var BlenoDescriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var SetupCharacteristic = function() { 
	
	SetupCharacteristic.super_.call(
		this, 
		{
			uuid: 'ffffffff-ffff-ffff-fff0-fffffffffff2',
			properties: [
				'write',
				'writeWithoutResponse',
				'notify'
			],
			descriptors: [
				new BlenoDescriptor({
					uuid: 'ffffffff-ffff-ffff-fff0-fffffffffff2',
					value: 'Used to setup a new service UUID and encryption key.'
				})
			]
		}
	);
	
	this._value = new Buffer(0);
	
};

SetupCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	
	console.log('Connection Characteristic - Write Request.');
    
	if (offset) {
		
		callback(this.RESULT_ATTR_NOT_LONG);
		
	} else if (data.length > 500) {
		
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
		
	} else {
		
		var data = data.toString('utf8');
		var json = JSON.parse(data);
		
		var action = json.action;
		
		if (action == 'setup') {
			
			var authKey = json.authKey;
			var encryptionKey = json.encryptionKey;
			
			console.log('Auth Key:' + authKey + ' Encryption Key:' + encryptionKey + '.');
			
		}
		
		//callback(this.RESULT_UNLIKELY_ERROR);
		callback(this.RESULT_SUCCESS);
		
	}
	
};

util.inherits(SetupCharacteristic, BlenoCharacteristic);
module.exports = SetupCharacteristic;
