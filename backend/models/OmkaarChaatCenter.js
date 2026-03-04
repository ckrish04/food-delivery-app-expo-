const mongoose = require("mongoose");
const MenuSchema = require("./MenuSchema");

const OmkarChaatCenter = mongoose.model("CanteenMenu",MenuSchema,"OmkarChaatCenter");

module.exports = OmkarChaatCenter;
