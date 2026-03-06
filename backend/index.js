/*const fs=require("fs");
const express=require("express");
const cors= require("cors");
const mongoose=require("mongoose");


const connection = require("./connectDB.js");
const GSrinivasCanteen = require("./models/GSrinivasCanteen.js");
const SriSaiGaneshFoods = require("./models/SriSaiGaneshFoods.js");
const Juices = require("./models/Juices.js");

const app=express();
app.use(cors());

app.use(express.json());

app.get("/Juices",async (res,res)=>
{
    try
    {
        const details= await Juices.find({},{_id:0});
        res.send(details);
    }
    catch(err)
    {
        console.error("error retreiving data");
        res.status(500).json({message:"error retreiving !",error:err});
    }
});


app.get("/Canteen",async (req,res)=>
    {
        try
        {
            const details = await GSrinivasCanteen.find({},{_id:0});
            res.send(details);
        }
        catch(err)
        {
            console.error("error retreiving data");
            res.status(500).json({message:"error retreiving !",error:err});
        }
    })

    
app.get("/GaneshFoods",async (req,res)=>
    {
        try
        {
            const details= await SriSaiGaneshFoods.find({},{_id:0});
            res.send(details);
        }
        catch(err)
        {
            console.error("error retreiving data");
            res.status(500).json({message:"error retreiving !",error:err});
        }
    })


app.listen(5000,()=>
{
    console.log("App running at port 5000");
});*/
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./connectDB.js");
const GSrinivasCanteen = require("./models/GSrinivasCanteen.js");
const OmkaarChaatCenter = require("./models/OmkaarChaatCenter.js");
const Juices = require("./models/Juices.js");
const Zesty = require("./models/Zesty.js");
const fallbackMenu = require("./data/fallbackMenu.js");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

let isDbConnected = false;
let dbMode = "none";

const initializeServer = async () => {
    const dbState = await connectDB();
    isDbConnected = dbState.connected;
    dbMode = dbState.mode;
};

initializeServer();

const normalizeMenuItem = (item, index, fallbackName, fallbackImage, prefix) => {
    const name = item.name || item.item || `${fallbackName} ${index + 1}`;
    const priceValue = Number(item.price ?? item.Price ?? 0);
    const imageValue =
        typeof item.image === "string"
            ? item.image
            : Buffer.isBuffer(item.image)
            ? `data:image/jpeg;base64,${item.image.toString("base64")}`
            : fallbackImage;

    return {
        id: item.id || `${prefix}-${index + 1}`,
        name,
        item: name,
        price: Number.isNaN(priceValue) ? 0 : priceValue,
        availability: typeof item.availability === "boolean" ? item.availability : true,
        prepTime: item.prepTime || "5 min",
        image: imageValue,
        description: item.description || "Freshly prepared at Zaika college canteen.",
    };
};

const getSafeDetails = async (model, fallbackItems, fallbackName, fallbackImage, prefix) => {
    const normalizedFallback = fallbackItems.map((item, index) =>
        normalizeMenuItem(item, index, fallbackName, fallbackImage, prefix)
    );

    if (!isDbConnected) {
        return normalizedFallback;
    }

    const details = await model.find({}, { _id: 0 }).lean();

    if (!Array.isArray(details) || details.length === 0) {
        return normalizedFallback;
    }

    const normalizedDetails = details.map((item, index) =>
        normalizeMenuItem(item, index, fallbackName, fallbackImage, prefix)
    );

    const existingNames = new Set(normalizedDetails.map((item) => String(item.name).toLowerCase()));

    const merged = [...normalizedDetails];
    normalizedFallback.forEach((item) => {
        const key = String(item.name).toLowerCase();
        if (!existingNames.has(key)) {
            merged.push(item);
        }
    });

    return merged;
};

// Routes
app.get("/Juices", async (req, res) => {
    try {
        const details = await getSafeDetails(
            Juices,
            fallbackMenu.juices,
            "Fresh Juice",
            fallbackMenu.juices[0].image,
            "juice"
        );
        res.send(details);
    } catch (err) {
        console.error("Error retrieving Juices data:", err);
        res.status(500).json({ message: "Error retrieving data!", error: err });
    }
});

app.get("/Canteen", async (req, res) => {
    try {
        const details = await getSafeDetails(
            GSrinivasCanteen,
            fallbackMenu.canteen,
            "Canteen Item",
            fallbackMenu.canteen[0].image,
            "canteen"
        );
        res.send(details);
    } catch (err) {
        console.error("Error retrieving Canteen data:", err);
        res.status(500).json({ message: "Error retrieving data!", error: err });
    }
});

app.get("/OmkarChaat", async (req, res) => {
    try {
        const details = await getSafeDetails(
            OmkaarChaatCenter,
            fallbackMenu.omkarChaat,
            "Chaat",
            fallbackMenu.omkarChaat[0].image,
            "chaat"
        );
        res.send(details);
    } catch (err) {
        console.error("Error retrieving GaneshFoods data:", err);
        res.status(500).json({ message: "Error retrieving data!", error: err });
    }
});

app.get("/GaneshFoods", async (req, res) => {
    try {
        const details = await getSafeDetails(
            OmkaarChaatCenter,
            fallbackMenu.omkarChaat,
            "Chaat",
            fallbackMenu.omkarChaat[0].image,
            "chaat"
        );
        res.send(details);
    } catch (err) {
        console.error("Error retrieving GaneshFoods data:", err);
        res.status(500).json({ message: "Error retrieving data!", error: err });
    }
});

app.get("/Zesty", async (req, res) => {
    try {
        const details = await getSafeDetails(
            Zesty,
            fallbackMenu.zesty,
            "Zesty Item",
            fallbackMenu.zesty[0].image,
            "zesty"
        );
        res.send(details);
    } catch (err) {
        console.error("Error retrieving Zesty data:", err);
        res.status(500).json({ message: "Error retrieving data!", error: err });
    }
});

app.get("/health", (req, res) => {
    res.status(200).json({
        server: "up",
        database: isDbConnected ? "connected" : "disconnected",
        databaseMode: dbMode,
    });
});

// Start Server
const server = app.listen(port, () => {
    console.log(`App running at port ${port}`);
});

server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use. Stop the existing process on this port and run again.`);
        process.exit(1);
    }

    console.error("Server startup error:", error);
    process.exit(1);
});
