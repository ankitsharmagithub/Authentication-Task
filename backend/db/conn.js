const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/db", {
    
}).then(() => {
    console.log("Database connected successfully");
}).catch((e)=> {
    console.log("err", e);
})