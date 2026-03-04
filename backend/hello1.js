/*
const fs= require("fs");
const mongoose= require("mongoose");

mongoose.connect("mongodb+srv://chandankrish001:chandankrish001@cluster0.go5jp.mongodb.net/CanteenMenu?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(()=>{console.log("connected to mongoDB")}).catch((err)=>{console.log(" error connecteing to db :",err)});


const MenuSchema= new mongoose.Schema({
    item:String,
    price:String,
    availability:Boolean
});

const Juices = mongoose.model("CanteenMenu",MenuSchema,"JuiceCenter");
const GSrinivasCanteen = mongoose.model("CanteenMenu",MenuSchema,"GSrinivasCanteen");
const OmkarChaatCenter = mongoose.model("CanteenMenu",MenuSchema,"OmkarChaatCenter");
*/

const { MongoClient } = require("mongodb");
const fs = require("fs");

const uri = "mongodb+srv://chandankrish001:chandankrish001@cluster0.go5jp.mongodb.net/CanteenMenu?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function insertImageToCollection() {
  try {
    await client.connect();
    const database = client.db("CanteenMenu");
    const collection = database.collection("OmkarChaatCenter");

    const imageBuffer = fs.readFileSync("C:/Users/KRISH CHANDAN/Downloads/vada.png");

    const result = await collection.updateMany(
      {},
      { $set: { image: imageBuffer } } // `image` field contains binary data of the image
    );

    console.log(`${result.modifiedCount} documents updated with the image`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

insertImageToCollection();
