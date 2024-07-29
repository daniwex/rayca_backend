const mongoose = require('mongoose')
require('dotenv').config();

let isConnected = false;
async function connectMongoose (){
  mongoose.set("strictQuery", true);
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Rayca",
      useNewUrlParser: true,
    });
    console.log("MongoDB connected");
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectMongoose