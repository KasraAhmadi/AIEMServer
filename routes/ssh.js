var express = require('express');
var app = require("../app");

var router = express.Router();
var allSockets = app.allSockets;



router.post('/', function(req, res, next) {


  var socket = null;
  for (let i = 0; i < allSockets.length; i++) {
    if (allSockets[i].moduleId == req.body.moduleId) {
      socket = allSockets[i].value;
      break;
    }
  }

  if (socket == null){
    return res.status(204).json({
      msg: "ssh_error"
    });
  }

  socket.emit('ssh');
  return res.status(200).json({
    msg: "ssh_called_succefully"
  });
});
module.exports = router;
