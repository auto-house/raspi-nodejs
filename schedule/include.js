//
// include.js
//

var os = require('os');
var fs = require('fs');
var util = require('util');
var bleno = require('bleno');
var jsonfile = require('jsonfile');

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
	
	console.log('Schedule Service - Include Characteristic - Write Request.');
    
	if (offset) {
		
		console.log('Schedule Service - Include Characteristic - Result attribute not long enoght.');
		callback(this.RESULT_ATTR_NOT_LONG);
		
	} else if (data.length > 250) {
		
		console.log('Schedule Service - Include Characteristic - Data length over specified limit.');
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
		
	} else {
		
		var data = data.toString('utf8');
		var receivedScheduledAction = JSON.parse(data);
		
		console.log('Schedule Service - Include Characteristic - Received schedule: ' + data + '.');
		
		if (fs.existsSync(schedulesFilePath)) {
			
			var scheduledActionExists = false;
			var scheduledActions = jsonfile.readFileSync(schedulesFilePath);
		
			for (var i = 0; i < scheduledActions.length; i++) {
				var scheduledAction = scheduledActions[i];
				if (scheduledAction.id == receivedScheduledAction.id) {
					scheduledActionExists = true;
					console.log('The scheduled action exists.');	
				}
			}
			
			if (scheduledActionExists == false) {
				console.log('The scheduled action exists.');
				scheduledActions.push(receivedScheduledAction);
				jsonfile.writeFile(schedulesFilePath, scheduledActions, function (err) {
					console.error(err);	
				});	
			}
			
		}else{
			
			console.log('The schedules file does not exist.');
			
			var jsonArr = '[]';
			var jsonObj = JSON.parse(jsonArr);
			
			jsonObj.push(receivedScheduledAction);
			
			jsonfile.writeFile(schedulesFilePath, jsonObj, function (err) {
				console.error(err);	
			});
			
		}
		
		callback(this.RESULT_SUCCESS);
		
	}
	
};

util.inherits(ScheduleCharacteristic, BlenoCharacteristic);
module.exports = ScheduleCharacteristic;
