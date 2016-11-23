//
// connection.js
//
// Implements the connection service, used to establish
// communication parameters to interface the controller and remote app.
//

var util = require('util');
var bleno = require('bleno');

var BlinkCharacteristic = require('./blink');
var SetupCharacteristic = require('./setup');
var DAuthCharacteristic = require('./dauth');

var serviceUUID = 'ffffffff-ffff-ffff-fff0-ffffffffffff';

function ConnectionService() {
	
	bleno.PrimaryService.call(
		this,
		{
			uuid: serviceUUID,
			characteristics: [
				new BlinkCharacteristic(),
				new SetupCharacteristic(),
				new DAuthCharacteristic()
				]
		}
	);
	
};

util.inherits(ConnectionService, bleno.PrimaryService);
module.exports = ConnectionService;
