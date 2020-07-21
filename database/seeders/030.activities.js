const { getActivities } = require("./spreadsheet")

module.exports = {
    table: "activities",

    rows: async ({ query, uuid }) => {
        // Get id of the first user
        const userId = (await query("SELECT id FROM users WHERE id = id LIMIT 1"))[0].id

        const activities = []

        for(let [activity, category] of getActivities()) {
            // Get category id from given category name
            const categoryId = (await query(`SELECT id FROM categories WHERE name = '${category}'`))[0].id

            activities.push([uuid(), activity, userId, categoryId])
        }

        return activities
    }
}