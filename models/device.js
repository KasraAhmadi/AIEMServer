var mongoose = require('mongoose');

var DeviceSchema = mongoose.Schema({
	module_id: {
		type: String,
		unique: true,
		required: true
	},
	data: [{
		direction: Number,
		time: String,
		in_call: Array,
		out_call_up: Array,
		out_call_down: Array,
		numerator: String,
		lift_status: Number,
		elv_id: Number
	}]
})
var device = module.exports = mongoose.model('devices', DeviceSchema);


module.exports.addDevice = function(device, callback) {
	device.save(callback);
}

module.exports.addData = function(id, newData, callback) {
	device.findOneAndUpdate({
		id: id
	}, {
		$push: {
			data: newData
		}
	}, function(err, model) {
		if (err) {
			return callback("err");
		} else if (model == null) {
			console.log("Inner id is:");
			console.log(id);
			return callback("no_device",null,id)
		}
		return callback(null);
	});
}
