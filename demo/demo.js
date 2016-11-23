//
// demo.js
//
// Implements the demo service, used for demonstration purposes.
//

var util = require('util');
var bleno = require('bleno');

var LEDCharacteristic = require('./led');

var serviceUUID = 'ffffffff-ffff-ffff-fff1-ffffffffffff';

function DemoService() {
	
	bleno.PrimaryService.call(
		this,
		{
			uuid: serviceUUID,
			characteristics: [
				new LEDCharacteristic()
				]
		}
	);
	
};

util.inherits(DemoService, bleno.PrimaryService);
module.exports = DemoService;
