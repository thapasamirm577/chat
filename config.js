import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);


mongoose.connection.on('connected', ()=>{
    console.log("Database connected...");
})

mongoose.connection.on('error', (error)=>{
    console.log("Database not connected", error);
})