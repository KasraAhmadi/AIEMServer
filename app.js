var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var device = require('./models/device');
var exphbs = require('express-handlebars');




var connection = mongoose.connect('mongodb://kasra:HammerOn070@localhost/iotController', {
	useNewUrlParser: true
});

var allSockets = []
module.exports.allSockets = allSockets;


var admin = require('./routes/admin');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//View Engine
app.set('views', path.join(__dirname, 'views'));


var hbs = exphbs.create({
	helpers: {
		json: function(value, options) {
			return JSON.stringify(value);
		}
	},
	defaultLayout: 'layout'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');




// Set Port
app.set('port', (process.env.PORT || 80));

app.use('/admin', admin);

server.listen(app.get('port'), function() {
	console.log('Server started on port ' + app.get('port'));
});

function Register(socket, data) {
	for (let i = 0; i < allSockets.length; i++) {
		if (allSockets[i].moduleId == data.moduleId) {
			allSockets.splice(i, 1);
		}
	}

	console.log("socketIO established with module: " + " id: " + socket.id);
	allSockets.push({
		moduleId: data.moduleId,
		SocketId: socket.id,
		value: socket
	});
}

function BroadcastData() {

	for (let i = 0; i < allSockets.length; i++) {
		allSockets[i].value.emit('Alive', {
			data: 'A'
		});
	}
	setTimeout(BroadcastData, 5000);
}

BroadcastData()



io.on('connection', function(socket) {
	socket.on('Register', function(data) {
		Register(socket, data);
	});

	socket.on('disconnect', function(reason) {
		console.log(reason);
		for (i = 0; i < allSockets.length; i++) {
			if (allSockets[i].SocketId == socket.id) {
				console.log("SPLICE THE SOCKET");
				allSockets.splice(i, 1);
			}
		}
	});


	socket.on('data', function(data) {
		var Jdata = JSON.parse(data)
		device.addData(Jdata.module_id, Jdata.data, function(err, model, id) {
			if (err) {
				if (err == "no_device") {
					console.log("no_device");
					var newDevice = new device({
						module_id: Jdata.module_id
					});

					device.addDevice(newDevice, function(err, model) {
						if (err) {
							console.log("Error in adding device");
						} else {
							console.log("Device added Ok");
						}
					});
				}
			}
		});

	});
});
