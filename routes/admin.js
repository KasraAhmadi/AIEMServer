var express = require('express');
var app = require("../app");

var router = express.Router();
var allSockets = app.allSockets;



router.post('/', function(req, res, next) {




	if(req.body.moduleId != ""  && req.body.Password == "kasraahmadi"){
		var socket = null;
		console.log(allSockets.length);
		for (let i = 0; i < allSockets.length; i++) {
		  if (allSockets[i].moduleId == req.body.moduleId) {
			socket = allSockets[i].value;
			break;
		  }
		}

		if (socket == null){
		  return res.send("Device not connected")
		}

		socket.emit('ssh');
		res.send("send command succefully")
	}else{
		res.send("Error")
	}



});


router.get('/', function (req, res) {
	res.render('admin');
});


module.exports = router;
