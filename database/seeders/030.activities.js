const { v4: uuid } = require("uuid")

const { getActivities } = require("./spreadsheet")

module.exports = {
    table: "activities",

    rows: async (db) => {
        // Get id of the first user
        const userId = await new Promise(resolve => {
            db.query("SELECT id FROM users WHERE id = id LIMIT 1", (error, results) => {
                if(error) throw error
                resolve(results[0].id)
            })
        })

        const activities = []

        for(let [activity, category] of getActivities()) {
            // Get category id from given category name
            const categoryId = await new Promise(resolve => {
                db.query(`SELECT id FROM categories WHERE name = '${category}'`, (error, results) => {
                    if (error) throw error
                    resolve(results[0].id)
                })
            })

            activities.push([uuid(), activity, userId, categoryId])
        }

        return activities
    }
}