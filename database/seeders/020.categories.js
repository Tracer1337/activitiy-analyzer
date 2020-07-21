const { v4: uuid } = require("uuid")

const { getCategories } = require("./spreadsheet")

module.exports = {
    table: "categories",

    rows: async (db) => {
        // Get id of the first user
        const userId = await new Promise(resolve => {
            db.query("SELECT id FROM users WHERE id = id LIMIT 1", (error, results) => {
                if(error) throw error
                resolve(results[0].id)
            })
        })

        return getCategories().map(category => [uuid(), category, userId])
    }
} 