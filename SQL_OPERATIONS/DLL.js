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
             CREATE TABLE IF NOT EXISTS users(id int auto_increment primary key,name varchar(90) not null,address varchar(255) not null);
        `)

        if(isTableCreated.length == 0){
            return res.status(400).json({data:null,message:"faild to create table"})
        }else{
            console.log('table created successfully')
        }

        // lets learn ALTER commnds of ddl with sql 

        // add a new column 
        let isColumnAdded= await connection.query(`
            ALTER TABLE users add column age int not null  
        `)
        if(isColumnAdded.length == 0){
            return res.status(400).json({data:null,message:"faild to add column"})
        }else{
            console.log('age column added successfully')
        }

        // maodify Column namae  
        let isColumnModify  =  await connection.query(`
            ALTER TABLE users RENAME column age TO user_age
        `);
 
        if(isColumnModify.length == 0){
            return res.status(400).json({data:null,message:"faild to modify column"})
        }else{
            console.log('age column modified successfully reanme as user_age')
        }

        //  drop colum 

        let isColumnDrop = await connection.query(`
    
            ALTER TABLE user DROP COLUMN user_age
        `)

        if(isColumnDrop.length == 0){
             return res.status(400).json({data:null,message:"faild to drop column"})
        }else{
            console.log('user_age column dropped successfully')
        }



        






        return res.status(200).json({ data: responce })

    } catch (error) {

         if(error?.sqlState== '42S21'){
           console.log(`-----${error.message}-----`)
         }
        return res.status(error.status || 500).json({ data: null, message: error.message })
    }
}

export default runDDL;