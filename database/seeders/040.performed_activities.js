const { getPerformedActivities } = require("./spreadsheet")

module.exports = {
    table: "performed_activities",

    rows: async ({ query, uuid }) => {
        // Get id of the first user
        const userId = (await query("SELECT id FROM users WHERE id = id LIMIT 1"))[0].id

        const result = []

        for(let [activity, timestamp] of getPerformedActivities()) {
            // Get activity id
            const activityId = (await query(`SELECT id FROM activities WHERE name = '${activity}'`))[0].id
            
            result.push([uuid(), timestamp, activityId, userId])
        }

        return result
    }
}