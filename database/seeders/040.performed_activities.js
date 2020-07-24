const { getPerformedActivities } = require("./spreadsheet")

module.exports = {
    table: "performed_activities",

    rows: async ({ query, uuid }) => {
        // Get id of the first user
        const userId = (await query("SELECT id FROM users WHERE id = id LIMIT 1"))[0].id

        const result = []

        for(let [activity, timestamp] of getPerformedActivities()) {
            // Get activity
            const queryResult = (await query(`SELECT id FROM activities WHERE name = '${activity}'`))[0]

            if(!queryResult) {
                throw new Error("Activity " + activity + " not found")
            }
            
            result.push([uuid(), timestamp, queryResult.id, userId])
        }

        return result
    }
}