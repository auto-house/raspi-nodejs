var util = require('util');
var bleno = require('bleno');

var LDRExternalCharacteristic = require('./ldrEx');

var serviceUUID = 'ffffffff-ffff-ffff-fff4-ffffffffffff';

function AutoLDRService() {
	
	bleno.PrimaryService.call(
		this,
		{
			uuid: serviceUUID,
			characteristics: [
				new LDRExternalCharacteristic()
				]
		}
	);
	
};

util.inherits(AutoLDRService, bleno.PrimaryService);
module.exports = AutoLDRService;