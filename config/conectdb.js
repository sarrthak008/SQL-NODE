import mysql from "mysql2"

const connectDB =  () => {
     const db = mysql.createConnection({
        host:"localhost",
        port:'3306',
        password:'root1234',
        database:'mydb',
        user:'root'
     })

     db.connect((err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("connected to db")
        }
     })
}

export default connectDB