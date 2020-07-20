const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const { performance } = require("perf_hooks")
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") })

const { createConnection } = require("../../database")

let db

// Run db.query promise-based
function asyncQuery(query) {
    return new Promise((resolve, reject) => {
        db.query(query, (error) => {
            if(error) throw error
            resolve()
        })
    })
}

;(async () => {
    // Create database connection
    db = await createConnection()

    run()
})()

// Run migrations
function run() {
    // Get all files in current directory
    fs.readdir(__dirname, async (error, files) => {
        if (error) throw error

        // Remove index.js from the files array
        files.splice(files.indexOf("index.js"), 1)

        // Create migrations array
        const migrations = files.map(filename => require("./" + filename))

        // Drop all tables
        console.log(chalk.bold("Remove tables"))

        const query = `DROP TABLE IF EXISTS ${migrations.map(migration => migration.table).filter(e => e).join(",")}`
        await asyncQuery(query)

        const startTime = performance.now()
        console.log(chalk.bold("Create tables"))

        // Create tables
        for (let migration of migrations) {
            if (!migration.run) {
                continue
            }

            console.log("Creating", migration.table)

            // Build query
            const query = typeof migration.run === "function" ? migration.run() : migration.run

            // Run SQL
            await asyncQuery(query)

            console.log(chalk.green("Created successfully"))
        }

        const elapsedTime = Math.floor(performance.now() - startTime)
        console.log(`Executed in ${elapsedTime}ms`)

        // Disconnect from database
        db.end()
    })
}
