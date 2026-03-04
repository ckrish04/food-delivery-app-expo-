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
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const connectDB = require("./connectDB.js");
const GSrinivasCanteen = require("./models/GSrinivasCanteen.js");
const OmkaarChaatCenter = require("./models/OmkaarChaatCenter.js");
const Juices = require("./models/Juices.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get("/Juices", async (req, res) => {
    try {
        const details = await Juices.find({}, { _id: 0 });
        console.log(details);
        res.send(details);
    } catch (err) {
        console.error("Error retrieving Juices data:", err);
        res.status(500).json({ message: "Error retrieving data!", error: err });
    }
});

app.get("/Canteen", async (req, res) => {
    try {
        const details = await GSrinivasCanteen.find({}, { _id: 0 });
        console.log(details)
        res.send(details);
    } catch (err) {
        console.error("Error retrieving Canteen data:", err);
        res.status(500).json({ message: "Error retrieving data!", error: err });
    }
});

app.get("/OmkarChaat", async (req, res) => {
    try {
        const details = await OmkaarChaatCenter.find({}, { _id: 0 });
        res.send(details);
    } catch (err) {
        console.error("Error retrieving GaneshFoods data:", err);
        res.status(500).json({ message: "Error retrieving data!", error: err });
    }
});

// Start Server
app.listen(5000, () => {
    console.log("App running at port 5000");
});
