const mongoose = require("mongoose");
const MenuSchema = require("./MenuSchema");

const Juices = mongoose.model("JuiceCenter", MenuSchema, "JuiceCenter");

module.exports = Juices;