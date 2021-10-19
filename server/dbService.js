const mysql = require('mysql')
const dotenv = require('dotenv')
let instance = null
dotenv.config()

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    // socketPath  : '/var/run/mysqld/mysqld.sock'
})


console.log({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
})

connection.connect((err) => {
    if (err) {
        console.log(err.message)
    }
    // console.log('db ' + connection.state)

})
// console.log(connection,123)

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService()
    }

    async getAllData() {
        console.log('\u001b[44m getAllData: vvv \u001b[0m')
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            console.log(response)
            console.log('\u001b[44m getAllData: ^^^ \u001b[0m')
            return response
        } catch (err) {
            console.log(err)
        }
        console.log('\u001b[44m getAllData: ^^^ \u001b[0m')
    }

    async insertNewName(name) {
        console.log('\u001b[41m insertNewName: vvv \u001b[0m')
        // console.log("%c insertNewName: vvv", 'background: #222; color: #bada55')
        try {
            const dateAdded = new Date()
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name,date_added) VALUES (?,?)";

                connection.query(query, [name, dateAdded], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            })


            console.log(insertId)
            console.log('\u001b[41m insertNewName: ^^^ \u001b[0m')
            return {
                id: insertId,
                name,
                dateAdded
            }
        } catch (err) {
            console.log(err)
        }
        console.log('\u001b[41m insertNewName: ^^^ \u001b[0m')
    }

    async deleteRowById(id) {
        try {
            console.log('\u001b[41m deleteRowById: vvv \u001b[0m')
            id = Number(id)
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?";
                
                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            })
            
            console.log(response)
            return response == 1 ? true : false
        } catch (err) {
            console.log(err)
            console.log('\u001b[41m deleteRowById: ^^^ \u001b[0m')
            return false
        }
    }

    async updateNameById(id,name){
        try {
            console.log('\u001b[41m updateNameById: vvv \u001b[0m')
            id = Number(id)
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ? WHERE id = ?";
                
                connection.query(query, [name,id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    // resolve(result.affectedRows);
                    resolve(result);
                })
            })
            
            console.log(response)
            return response == 1 ? true : false
        } catch (err) {
            console.log(err)
            console.log('\u001b[41m updateNameById: ^^^ \u001b[0m')
            return false
        }
    }

    async searchByName(name){
        console.log('\u001b[47m searchByName: vvv \u001b[0m')
        try {
            // console.log(name)
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names WHERE name = ?;";
                connection.query(query,[name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })

            console.log(response)
            console.log('\u001b[47m searchByName: ^^^ \u001b[0m')
            return response
        } catch (err) {
            console.log(err)
        }
        console.log('\u001b[44m getAllData: ^^^ \u001b[0m')
    }
}

module.exports = DbService;