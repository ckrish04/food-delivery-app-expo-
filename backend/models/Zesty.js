const mongoose = require("mongoose");
const MenuSchema = require("./MenuSchema");

const Zesty = mongoose.model("Zesty", MenuSchema, "Zesty");

module.exports = Zesty;
