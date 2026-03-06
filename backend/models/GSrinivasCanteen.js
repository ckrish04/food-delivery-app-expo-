const mongoose = require("mongoose");
const MenuSchema = require("./MenuSchema");

const GSrinivasCanteen = mongoose.model("GSrinivasCanteen", MenuSchema, "GSrinivasCanteen");


module.exports = GSrinivasCanteen;