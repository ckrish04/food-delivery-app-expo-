const mongoose = require("mongoose");

const connectDB = async () => {
    const atlasUri = process.env.MONGODB_URI;
    const localUri = process.env.MONGODB_LOCAL_URI || "mongodb://127.0.0.1:27017/fooddeliveryapp";
    const connectionOptions = {
        serverSelectionTimeoutMS: 5000,
    };

    const targets = [];

    if (atlasUri) {
        targets.push({ name: "atlas", uri: atlasUri });
    }

    targets.push({ name: "local", uri: localUri });

    if (!atlasUri) {
        console.warn("MONGODB_URI is not set. Trying local MongoDB...");
    }

    for (const target of targets) {
        try {
            await mongoose.connect(target.uri, connectionOptions);
            console.log(`MongoDB connected successfully (${target.name})`);
            return {
                connected: true,
                mode: target.name,
                uri: target.uri,
            };
        } catch (error) {
            console.error(`MongoDB connection failed (${target.name}):`, error.message || error);
        }
    }

    console.warn(
        "Starting backend without database connection. If Atlas is unavailable, run local MongoDB or set MONGODB_LOCAL_URI."
    );

    return {
        connected: false,
        mode: "none",
        uri: null,
    };
};

module.exports = connectDB;
