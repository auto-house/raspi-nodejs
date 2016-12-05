//
// schedule.js
//
// Implements the schedule service, it handles the scheduling of actions,
//

var util = require('util');
var bleno = require('bleno');

var IncludeCharacteristic = require('./include');

var serviceUUID = 'ffffffff-ffff-ffff-fff4-ffffffffffff';

function ScheduleService() {
	
	bleno.PrimaryService.call(
		this,
		{
			uuid: serviceUUID,
			characteristics: [
				new IncludeCharacteristic()
				]
		}
	);
	
};

util.inherits(ScheduleService, bleno.PrimaryService);
module.exports = ScheduleService;
