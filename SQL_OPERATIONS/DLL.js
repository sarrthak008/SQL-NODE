import connection from "../config/conectdb.js";

const runDDL = async (req, res) => {
    try {

        // traying to create a new table of testing 
        let responce = await connection.query("CREATE DATABASE IF NOT EXISTS ddl");

        if (responce.length == 0) {
            return res.status(400).json({ data: null, message: "database creation faild" });
        } else {
            console.log('database created successfully')
        }



        // use create dabase ...
        let isDatabseUsed = await connection.query("USE ddl");

        if (isDatabseUsed.length == 0) {
            return res.status(400).json({ data: null, message: "faild to use database" });
        } else {
            console.log('database used successfully')
        }

        // insert table inot database.. insert basic user table into database 
        
        let isTableCreated = await connection.query(`
             CREATE TABLE IF NOT EXISTS user(id int auto_increment primary key,name varchar(90) not null,address varchar(255) not null);
        `)

        if(isTableCreated.length == 0){
            return res.status(400).json({data:null,message:"faild to create table"})
        }else{
            console.log('table created successfully')
        }

        






        return res.status(200).json({ data: responce })

    } catch (error) {
        console.log(error);
        return res.status(error.status).json({ data: null, message: error.message })
    }
}

export default runDDL;