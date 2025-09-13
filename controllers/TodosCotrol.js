import connection from "../config/conectdb.js";


const getTodos = async (req, res) => {
    try {
        let [rows] = await connection.query("select * from todo");

        return res.status(200).json({ data: rows });
    } catch (error) {
        return res.status(error.status).json({ data: null, message: error.message })
    }
}

const getTodoById = async (req, res) => {
    try {
        let { id } = req.params;
        let [rows] = await connection.query("select * from todo where id = ?", [id]);

        if (rows.length == 0) {
            return res.status(404).json({ data: null, message: `todo not found for id :${id}` })
        }

        return res.status(200).json({ data: rows })

    } catch (error) {
        return res.status(error.status).json({data:null,message:error.message})
    }
}

export { getTodos, getTodoById }