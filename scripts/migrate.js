const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const { performance } = require("perf_hooks")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })

const { createConnection } = require("../database")

const MIGRATIONS_DIR = path.join(__dirname, "..", "database", "migrations")

let db

// Terminal stylings
const headline = chalk.bold
const success = chalk.green
const indent = str => "    " + str
const timestamp = chalk.cyan

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

    try {
        run()
    } catch(error) {
        console.error(error)
        db.end()
    }
})()

// Run migrations
function run() {
    // Get all migration files
    fs.readdir(MIGRATIONS_DIR, async (error, files) => {
        if (error) throw error

        // Create migrations array
        const migrations = files.map(filename => require(path.join(MIGRATIONS_DIR, filename)))

        // Drop all tables
        console.log(headline("Remove tables"))

        const reversedMigrations = [...migrations].reverse()
        const query = `DROP TABLE IF EXISTS ${reversedMigrations.map(migration => migration.table).filter(e => e).join(",")}`
        await asyncQuery(query)

        const startTime = performance.now()
        console.log(headline("Create tables"))

        // Create tables
        for (let migration of migrations) {
            if (!migration.run) {
                continue
            }

            console.log(indent("Creating " + migration.table))

            // Build query
            const query = typeof migration.run === "function" ? migration.run() : migration.run

            // Run SQL
            await asyncQuery(query)

            console.log(success(indent("Created successfully")))
        }

        const elapsedTime = Math.floor(performance.now() - startTime)
        console.log("Executed in " + timestamp(elapsedTime + "ms"))

        // Disconnect from database
        db.end()
    })
}
