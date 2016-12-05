//
// include.js
//

var os = require('os');
var fs = require('fs');
var util = require('util');
var bleno = require('bleno');
var Gpio = require('onoff').Gpio;
var JSONFile = require('jsonfile');

var BlenoDescriptor = bleno.Descriptor;
var BlenoCharacteristic = bleno.Characteristic;

var scheduleFilePath = './schedule.json';

var ScheduleCharacteristic = function() { 
	
	ScheduleCharacteristic.super_.call(
		this, 
		{
			uuid: 'ffffffff-ffff-ffff-fff4-fffffffffff1',
			properties: [
				'write'
			],
			descriptors: [
				new BlenoDescriptor({
					uuid: 'ffffffff-ffff-ffff-fff4-fffffffffff1',
					value: 'Saves an scheduled action to the hard disk.'
				})
			]
		}
	);
	
	this._value = new Buffer(0);
	
};

ScheduleCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	
	console.log('Schedule Characteristic - Write Request.');
    
	if (offset) {
		
		callback(this.RESULT_ATTR_NOT_LONG);
		
	} else if (data.length > 250) {
		
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
		
	} else {
		
		var data = data.toString('utf8');
		var json = JSON.parse(data);
		
		var action = 'a'; //json.action;
		
		console.log(json)
		
		if (action == 'blink-led') {
			
			var led = new Gpio(27, 'out');
			
			var blink = setInterval(function(){
				led.writeSync(led.readSync() == 0 ? 1 : 0);	
			}, 250);
			
			setTimeout(function(){
				clearInterval(blink);
				led.writeSync(0);
				led.unexport();
			}, 10000);
			
			console.log('Now blinking...');
			
		}
		
		if (fs.existsSync(scheduleFilePath)) {
			
			console.log('The file exists.');
			
			var jsonObj = JSONFile.readFileSync(scheduleFilePath);
		
			jsonObj.push(json);
			
			JSONFile.writeFile(scheduleFilePath, jsonObj, function (err) {
				console.error(err);	
			});
			
		}else{
			
			console.log('The schedules file does not exist.');
			
			var jsonArr = '[]';
			var jsonObj = JSON.parse(jsonArr);
			
			jsonObj.push(json);
			
			JSONFile.writeFile(scheduleFilePath, jsonObj, function (err) {
				console.error(err);	
			});
			
		}
		
		callback(this.RESULT_SUCCESS);
		
	}
	
};

util.inherits(ScheduleCharacteristic, BlenoCharacteristic);
module.exports = ScheduleCharacteristic;
