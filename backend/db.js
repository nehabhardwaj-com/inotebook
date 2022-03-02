const mongoose = require('mongoose');
const mongooUri = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';

const connectToMongo = ()=>{
    mongoose.connect(mongooUri, ()=>{
        console.log("Mongo DB connected successfully!!")
    })
}

module.exports = connectToMongo;