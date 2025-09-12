import express from "express"

import connectDB from "./config/conectdb.js";

const app = express();
const PORT = 3000;




app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
    connectDB()
})