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


// var newDevice = new device({
// 	module_id: '10'
// });
//
// device.addDevice(newDevice, function(err, model) {
// 	if (err) {
// 		console.log("Error in adding device");
// 	}else{
// 		console.log("Device added Ok");
// 	}
// });



io.on('connection', function(socket) {
			socket.on('Register', function(data) {
				Register(socket, data);
			});

			socket.on('data', function(data) {
					var Jdata = JSON.parse(data)
					device.addData(Jdata.module_id, Jdata.data, function(err, model, id) {
							if (err) {
								if (err == "no_device") {
									console.log("no_device");
								} else {
									console.log("AddDone");
								}
						}
					});

				//   this.id = data.id;
				//   console.log("socketIO established with module: " + data.id + " id: " + this.socket.id);
				//   clients.push({ ModuleId: data.id, SocketId: this.socket.id, value: this.socket });  });
			});
		});

		// var io = require('./socket').listen(http)
