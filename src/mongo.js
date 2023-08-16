require("dotenv").config()
const mongoose = require('mongoose');
const mongoDBURI = process.env.MONGODB_URI
mongoose.connect(mongoDBURI)
.then(() => {
    console.log("mongodb connected");
})
.catch(() => {
    console.log("failed")
})

const newSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    },
})

const collection = mongoose.model("user", newSchema)

module.exports = collection