const { connect } = require("./models/db");
const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");

const employeeController = require("./controllers/employeeController");

const app = express();
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());

app.use("/employee", employeeController);
app.set("views", path.join(__dirname, "/views/"));
app.engine(
	"hbs",
	engine({
		extname: "hbs",
		defaultLayout: "mainLayout",
		layoutsDir: __dirname + "/views/layouts/",
		runtimeOptions: {
			allowedProtoMethods: true,
			allowedProtoProperties: true,
			allowProtoPropertiesByDefault: true,
			allowCallsToHelperMissing: true,
			allowProtoMethodsByDefault: true,
		},
	})
);
app.set("view engine", "hbs");

connect().then(() => {
	app.listen(3000, () => {
		console.log("Express server started at port : 3000");
	});
});
