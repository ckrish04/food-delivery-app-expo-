const mongoose = require("mongoose");


const MenuSchema= new mongoose.Schema({
    item: String,
    price: Number,
    Price: Number,
    availability: {
        type: Boolean,
        default: true,
    },
    prepTime: {
        type: String,
        default: "5 min",
    },
    image: mongoose.Schema.Types.Mixed
});

module.exports = MenuSchema;