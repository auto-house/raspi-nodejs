var util = require('util');
var bleno = require('bleno');

var RelayCharacteristic = require('./relaychar');

var serviceUUID = 'ffffffff-ffff-ffff-fff5-ffffffffffff';

function RelayService() {
	
	bleno.PrimaryService.call(
		this,
		{
			uuid: serviceUUID,
			characteristics: [
				new RelayCharacteristic()
				]
		}
	);
	
};

util.inherits(RelayService, bleno.PrimaryService);
module.exports = RelayService;