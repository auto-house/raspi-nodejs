//
// index.js
//
//
// The root file, setups the bleno communication stack.
//

var fs = require('fs');
var bleno = require('bleno');
var jsonfile = require('jsonfile');
var schedule = require('node-schedule');

var ConnectionService = require('./connection/connection');
var DemoService = require('./demo/demo');
var MoveService = require('./move/move');
var ScheduleService = require('./schedule/schedule');

var connectionService = new ConnectionService();
var demoService = new DemoService();
var moveService = new MoveService();
var scheduleService = new ScheduleService();

var savedSchedulesFilePath = './schedule.json';

if (fs.existsSync(savedSchedulesFilePath)) {
			
	var jsonObj = jsonfile.readFileSync(savedSchedulesFilePath);
			
	for (var i = 0; i < jsonObj.length; i++) {
		
		console.log('Scheduling items...');
		
		var scheduledItem = jsonObj[i];
		
		var rule = new schedule.RecurrenceRule();
		rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6, 7];
		rule.hour = 13;
		rule.minute = 15;
		
		var job = schedule.scheduleJob(rule, function () {
			
			console.log('Execute the action ' + scheduledItem.action + '.');
			
		});
		
	}
		
}


bleno.on('stateChange', function(state) {
	
	console.log('Bleno - State changed to \"' + state + '\".');
	
	if (state === 'poweredOn') {
		bleno.startAdvertising(bleno.name, [connectionService.uuid]);
	} else {
		bleno.stopAdvertising();
	}
	
});

bleno.on('advertisingStart', function(error) {
	
	console.log('Bleno - ' + (error ? 'Failed to advertise. ' + error : 'Now advertising.') );
	
	if (!error) {
		bleno.setServices([connectionService, demoService, moveService, scheduleService]);
	}
	
});
