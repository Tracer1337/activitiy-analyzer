module.exports = {
    table: "tags",

    rows: async ({ query, uuid }) => {
        // Get id of the first user
        const userId = (await query("SELECT id FROM users WHERE id = id LIMIT 1"))[0].id

        return [
            [uuid(), "Good", userId],
            [uuid(), "Bad", userId],
            [uuid(), "Active", userId],
            [uuid(), "Passive", userId],
        ]
    }
}