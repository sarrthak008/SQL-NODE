import mysql from "mysql2/promise"

const connection = mysql.createPool({
    host:'localhost',
    user:"root",
    password:'root1234',
    database:'mydb'
})

if(connection){
    console.log("database connected successfully")
}


export default connection;