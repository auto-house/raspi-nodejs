//
// demo.js
//
// Implements the demo service, used for demonstration purposes.
//

var util = require('util');
var bleno = require('bleno');

var FullCharacteristic = require('./full');

var serviceUUID = 'ffffffff-ffff-ffff-fff3-ffffffffffff';

function MoveService() {
	
	bleno.PrimaryService.call(
		this,
		{
			uuid: serviceUUID,
			characteristics: [
				new FullCharacteristic()
				]
		}
	);
	
};

util.inherits(MoveService, bleno.PrimaryService);
module.exports = MoveService;
