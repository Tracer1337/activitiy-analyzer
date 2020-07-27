function random(max) {
    return Math.floor(Math.random() * max)
}

module.exports = {
    table: "model_tags",

    rows: async ({ query, uuid }) => {
        // Get all tags
        const tags = await query("SELECT id, name FROM tags")

        // Get all activities
        const activities = await query("SELECT id from activities")

        // Get all categories
        const categories = await query("SELECT id from categories")

        // Map tag names to ids
        const map = {}
        tags.forEach(({ id, name }) => map[name] = id)

        const result = []

        // Assign active or passive to each activity
        activities.forEach(({ id }) => {
            const tagId = map[["Active", "Passive"][random(2)]]
            result.push([uuid(), "activities", id, tagId])
        })

        // Assign good or bad to each category
        categories.forEach(({ id }) => {
            const tagId = map[["Good", "Bad"][random(2)]]
            result.push([uuid(), "categories", id, tagId])
        })

        return result
    }
}