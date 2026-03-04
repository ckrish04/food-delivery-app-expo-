const mongoose = require("mongoose");
const MenuSchema = require("./MenuSchema");

const GSrinivasCanteen = mongoose.model("CanteenMenu",MenuSchema,"GSrinivasCanteen");


module.exports = GSrinivasCanteen;