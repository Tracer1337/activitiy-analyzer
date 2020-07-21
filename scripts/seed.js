const fs = require("fs")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })

const { createConnection } = require("../database")

const SEEDS_DIR = path.join(__dirname, "..", "database", "seeds")

let db

;(async () => {
    // Connect to database
    db = await createConnection()

    try {
        await run()
    } catch(error) {
        console.error(error)
        db.end()
    }
})()

// Run seeds
async function run() {
    // Get all files from seeds directory
    const files = fs.readdirSync(SEEDS_DIR)

    console.log(files)

    db.end()
}