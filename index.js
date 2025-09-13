import express from "express"
import db from "./config/conectdb.js"

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}))
// controllers...
import { getTodoById, getTodos } from "./controllers/TodosCotrol.js";


app.get('/gettodo',getTodos);
app.get('/gettodo/:id',getTodoById)


app.get("/health",(req,res)=>{
     return res.json({data:null,message:"server is running healthy"})
})






app.listen(PORT, async ()=>{
    console.log(`app is running on port ${PORT}`);
})