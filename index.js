//
// index.js
//
//
// The root file, setups the bleno communication stack.
//

var bleno = require('bleno');

var ConnectionService = require('./connection/connection');
var DemoService = require('./demo/demo');

var connectionService = new ConnectionService();
var demoService = new DemoService();

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
		bleno.setServices([connectionService, demoService]);
	}
	
});
