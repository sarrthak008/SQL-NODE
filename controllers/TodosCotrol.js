import db from "../config/conectdb.js";


const getTodos = async (req,res)=>{

     try {
            let [rows] = await  db.query("select * from todo");
            return res.status(200).json({data:rows});
     } catch (error) {
           return res.status(error.status).json({data:null,message:error.message})
     }

}


export {getTodos}