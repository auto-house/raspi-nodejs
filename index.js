//
// index.js
//
//
// The root file, setups the bluetooth communication stack.
//

var fs = require('fs');
var bleno = require('bleno');
var jsonfile = require('jsonfile');
var schedule = require('node-schedule');

var handler = require('./handler');

var ConnectionService = require('./connection/connection');
var DemoService = require('./demo/demo');
var MoveService = require('./move/move');
var ScheduleService = require('./schedule/schedule');

var connectionService = new ConnectionService();
var demoService = new DemoService();
var moveService = new MoveService();
var scheduleService = new ScheduleService();

var scheduledActionsFilePath = './schedule.json';

if (fs.existsSync(scheduledActionsFilePath)) {
			
	var scheduledActions = jsonfile.readFileSync(scheduledActionsFilePath);
	
	for (var i = 0; i < scheduledActions.length; i++) {
		
		var scheduledAction = scheduledActions[i];
		
		var action = parseInt(scheduledAction.action, 0);
		var weekdaysToRepeat = scheduledAction.repeat.split(',').map(Number); 
		var timeComponents = scheduledAction.scheduledTime.split(':');
		var timeHour = parseInt(timeComponents[0], 0);
		var timeMinutes = parseInt(timeComponents[1], 0);
		
		var rule = new schedule.RecurrenceRule();
		rule.dayOfWeek = weekdaysToRepeat;
		rule.hour = timeHour;
		rule.minute = timeMinutes;
		
		var job = schedule.scheduleJob(rule, handlerFactory(action));
		
	}
	
}

bleno.on('stateChange', function(state) {
	
	console.log('Bleno - State changed to \"' + state + '\".');
	
	if (state === 'poweredOn') {
		bleno.startAdvertising(bleno.name, [connectionService.uuid]);
	}else{
		bleno.stopAdvertising();
	}
	
});

bleno.on('advertisingStart', function(error) {
	
	console.log('Bleno - ' + (error ? 'Failed to advertise. ' + error : 'Now advertising.') );
	
	if (!error) {
		bleno.setServices([connectionService, demoService, moveService, scheduleService]);
	}
	
});

function handlerFactory(action) {
	
	return function (e) {
		
		if (action == 0 || action == 1) {
			handler.moveCurtain(action);
		}else if (action == 2) {
			handler.blinkLED();
		}
		
	}
		
}
