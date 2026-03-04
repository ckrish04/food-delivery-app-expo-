/*const mongoose = require("mongoose");

const connection=mongoose.connect("mongodb+srv://chandankrish001:chandankrish001@cluster0.go5jp.mongodb.net/CanteenMenu?retryWrites=true&w=majority&appName=Cluster0")
                                .then(()=>{console.log("connected to MongoDB")})
                                .catch((err)=>{console.error("Error connecting to mongo db : ",err)});

module.exports = connection;*/
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://chandankrish001:chandankrish001@cluster0.go5jp.mongodb.net/CanteenMenu?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
