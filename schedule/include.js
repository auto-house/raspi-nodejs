//
// include.js
//

var os = require('os');
var fs = require('fs');
var util = require('util');
var bleno = require('bleno');
var jsonfile = require('jsonfile');
var schedule = require('node-schedule');

var handler = require('../handler');

var BlenoDescriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var schedulesFilePath = './schedule.json';
var scheduleCharacteristicUUID = 'ffffffff-ffff-ffff-fff4-fffffffffff1'

var ScheduleCharacteristic = function() { 
	
	ScheduleCharacteristic.super_.call(
		this, 
		{
			uuid: scheduleCharacteristicUUID,
			properties: ['write'],
			descriptors: [
				new BlenoDescriptor({
					uuid: scheduleCharacteristicUUID,
					value: 'Saves an scheduled action to the hard disk.'
				})
			]
		}
	);
	
	this._value = new Buffer(0);
	
};

ScheduleCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	
	if (offset) {
		
		callback(this.RESULT_ATTR_NOT_LONG);
		
	} else if (data.length > 250) {
		
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
		
	} else {
		
		var data = data.toString('utf8');
		var receivedScheduledAction = JSON.parse(data);
		
		if (fs.existsSync(schedulesFilePath)) {
			
			var scheduledActionExists = false;
			var scheduledActions = jsonfile.readFileSync(schedulesFilePath);
		
			for (var i = 0; i < scheduledActions.length; i++) {
				
				var scheduledAction = scheduledActions[i];
				
				if (scheduledAction.id == receivedScheduledAction.id) {
					scheduledActionExists = true;
				}
				
			}
			
			if (scheduledActionExists == false) {
				
				scheduleAction(receivedScheduledAction);
				
				scheduledActions.push(receivedScheduledAction);
				
				jsonfile.writeFile(schedulesFilePath, scheduledActions, function (err) {
					console.error(err);	
				});
					
			}
			
		}else{
			
			var jsonArr = '[]';
			var jsonObj = JSON.parse(jsonArr);
			
			scheduleAction(receivedScheduledAction);
			
			jsonObj.push(receivedScheduledAction);
			
			jsonfile.writeFile(schedulesFilePath, jsonObj, function (err) {
				console.error(err);	
			});
			
		}
		
		callback(this.RESULT_SUCCESS);
		
	}
	
};

function scheduleAction(scheduledAction) {
	
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

function handlerFactory(action) {
	
	return function (e) {
		
		if (action == 0 || action == 1) {
			handler.moveCurtain(action);
		}else if (action == 2) {
			handler.blinkLED();
		}
		
	}
		
}

util.inherits(ScheduleCharacteristic, BlenoCharacteristic);
module.exports = ScheduleCharacteristic;
