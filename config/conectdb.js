import mysql from "mysql2/promise"

const db = await mysql.createConnection({
    host: "localhost",
    port: '3306',
    password: 'root1234',
    database: 'mydb',
    user: 'root'
}).then(() => {
    console.log("database connected successfully")
}).catch((err) => console.log(err))


export default db
