const mongoose = require("mongoose");
const MenuSchema = require("./MenuSchema");

const OmkarChaatCenter = mongoose.model("OmkarChaatCenter", MenuSchema, "OmkarChaatCenter");

module.exports = OmkarChaatCenter;
