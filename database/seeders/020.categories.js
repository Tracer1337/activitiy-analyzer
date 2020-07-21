const { getCategories } = require("./spreadsheet")

module.exports = {
    table: "categories",

    rows: async ({ query, uuid }) => {
        // Get id of the first user
        const userId = (await query("SELECT id FROM users WHERE id = id LIMIT 1"))[0].id

        return getCategories().map(category => [uuid(), category, userId])
    }
} 