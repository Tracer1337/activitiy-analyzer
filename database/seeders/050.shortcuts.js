module.exports = {
    table: "shortcuts",

    rows: async ({ query, uuid }) => {
        // Get id of the first user
        const userId = (await query("SELECT id FROM users WHERE id = id LIMIT 1"))[0].id

        // Get the id of "Aufstehen" activitiy
        const activityId = (await query("SELECT id FROM activities WHERE name = 'Aufstehen'"))[0].id

        return [
            [uuid(), "WbSunny", activityId, userId]
        ]
    }
}