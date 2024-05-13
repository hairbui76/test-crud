const express = require("express");
var router = express.Router();
const Employee = require("../models/employee.model");

router.get("/", (req, res) => {
	res.render("employee/addOrEdit", {
		viewTitle: "Insert Employee",
	});
});

router.post("/", (req, res) => {
	if (req.body._id == "") insertRecord(req, res);
	else updateRecord(req, res);
});

async function insertRecord(req, res) {
	var employee = new Employee();
	employee.fullName = req.body.fullName;
	employee.email = req.body.email;
	employee.mobile = req.body.mobile;
	employee.city = req.body.city;
	try {
		await employee.save();
	} catch (err) {
		if (err.name == "ValidationError") {
			handleValidationError(err, req.body);
			res.render("employee/addOrEdit", {
				viewTitle: "Insert Employee",
				employee: req.body,
			});
		} else console.log("Error during record insertion : " + err);
	}
	res.redirect("employee/list");
}

async function updateRecord(req, res) {
	try {
		await Employee.findOneAndUpdate({ _id: req.body._id }, req.body, {
			new: true,
		});
	} catch (err) {
		if (err.name == "ValidationError") {
			handleValidationError(err, req.body);
			res.render("employee/addOrEdit", {
				viewTitle: "Update Employee",
				employee: req.body,
			});
		} else console.log("Error during record update : " + err);
	}
	res.redirect("employee/list");
}

router.get("/list", async (req, res) => {
	try {
		const docs = await Employee.find();
		res.render("employee/list", {
			list: docs,
		});
	} catch (err) {
		console.log("Error in retrieving employee list :" + err);
	}
});

function handleValidationError(err, body) {
	for (field in err.errors) {
		switch (err.errors[field].path) {
			case "fullName":
				body["fullNameError"] = err.errors[field].message;
				break;
			case "email":
				body["emailError"] = err.errors[field].message;
				break;
			default:
				break;
		}
	}
}

router.get("/:id", async (req, res) => {
	const doc = await Employee.findById(req.params.id);
	res.render("employee/addOrEdit", {
		viewTitle: "Update Employee",
		employee: doc,
	});
});

router.get("/delete/:id", async (req, res) => {
	try {
		await Employee.findByIdAndDelete(req.params.id);
	} catch (err) {
		console.log("Error in employee delete :" + err);
	}
	res.redirect("/employee/list");
});

module.exports = router;
