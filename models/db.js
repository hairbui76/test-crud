const mongoose = require("mongoose");

const connect = async () => {
	try {
		await mongoose
			.connect(`mongodb://${process.env.DB_HOST}:27017`)
			.then(() => {
				console.log("MongoDB Connection Succeeded.");
			});
	} catch (err) {
		console.log(err);
	}
};

module.exports = { connect };
