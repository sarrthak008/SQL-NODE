import mysql from "mysql2/promise"

const connection = mysql.createPool({
    host:'localhost',
    user:"root",
    password:'root1234',
    database:'mydb'
})


export default connection;