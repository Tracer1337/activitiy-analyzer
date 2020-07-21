const { v4: uuid } = require("uuid")

const { getPerformedActivities } = require("./spreadsheet")

module.exports = {
    table: "performed_activities",

    rows: async (db) => {
        // Get id of the first user
        const userId = await new Promise(resolve => {
            db.query("SELECT id FROM users WHERE id = id LIMIT 1", (error, results) => {
                if(error) throw error
                resolve(results[0].id)
            })
        })

        const result = []

        for(let [activity, timestamp] of getPerformedActivities()) {
            // Get activity id
            const activityId = await new Promise(resolve => {
                db.query(`SELECT id FROM activities WHERE name = '${activity}'`, (error, results) => {
                    if(error) throw error
                    resolve(results[0].id)
                })
            })

            result.push([uuid(), timestamp, activityId, userId])
        }

        return result
    }
}