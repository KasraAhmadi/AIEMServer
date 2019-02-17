var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var device = require('./models/device');


var connection = mongoose.connect('mongodb://localhost/iotController', {
	useNewUrlParser: true
});

var allSockets = []
module.exports.allSockets = allSockets;


var ssh = require('./routes/ssh');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Set Port
app.set('port', (process.env.PORT || 80));

app.use('/ssh', ssh);

server.listen(app.get('port'), function() {
	console.log('Server started on port ' + app.get('port'));
});

function Register(socket, data) {
	console.log("socketIO established with module: " + " id: " + socket.id);
	allSockets.push({
		moduleId: data.moduleId,
		SocketId: socket.id,
		value: socket
	});
}

// let sampleData = {
//   direction: 1,
//   time: "2019-02-10 21:55:03",
//   in_call: [0,1,2],
//   out_call_up: [],
//   out_call_down: [5,6],
//   numerator: "P2",
//   lift_status:10
// }
io.on('connection', function(socket) {
			socket.on('Register', function(data) {
				Register(socket, data);
			});

			socket.on('data', function(data) {
					var Jdata = JSON.parse(data)
					device.addData(Jdata.module_id, Jdata.data, function(err, model, id) {
							if (err) {
								if (err == "no_device") {
									var newDevice = new device({
										module_id: Jdata.module_id
									});
									device.addDevice(newDevice, function(err, model) {
										if (err) {
											console.log(newDevice);
											console.log("Error in adding device");
										}
									});
								} else {
									console.log("AddDone");
								}
						}
					});

				//   this.id = data.id;
				//   console.log("socketIO established with module: " + data.id + " id: " + this.socket.id);
				//   clients.push({ ModuleId: data.id, SocketId: this.socket.id, value: this.socket });  });
			});
		// var io = require('./socket').listen(http)
