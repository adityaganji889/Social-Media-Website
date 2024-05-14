import mongoose from 'mongoose'
import React from 'react'

async function ConnectToMongoDB() {
    try{
       const connectToDB = await mongoose.connect(process.env.DATABASE_URI!);
       console.log("Connected to Database Successfully.");
    }
    catch(error:any){
      console.log(error.message);
    }
}

export default ConnectToMongoDB;