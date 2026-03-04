const mongoose = require("mongoose");


const MenuSchema= new mongoose.Schema({
    item:String,
    price:String,
    image:Buffer
});

module.exports = MenuSchema;