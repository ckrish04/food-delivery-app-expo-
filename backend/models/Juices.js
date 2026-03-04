const mongoose = require("mongoose");
const MenuSchema = require("./MenuSchema");

const Juices = mongoose.model("CanteenMenu",MenuSchema,"JuiceCenter");

module.exports = Juices;