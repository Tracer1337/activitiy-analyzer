const mysql = require("mysql")
const chalk = require("chalk")

let db

function createConnection() {
    return new Promise(resolve => {
        // Create database connection
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        })

        // Connect to database
        connection.connect(error => {
            if(error) throw error

            console.log(chalk.green("Connected to database"))
            db = connection
            resolve(connection)
        })
    })    
}

module.exports = {
    db,
    createConnection
}