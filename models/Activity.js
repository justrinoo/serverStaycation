const mongoose = require("mongoose");
const ActivitySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	isPopular: {
		type: Boolean,
	},
});
module.exports = mongoose.model("Activity", ActivitySchema);
