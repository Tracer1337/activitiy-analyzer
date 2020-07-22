const { v4: uuid } = require("uuid")

const Model = require("../../lib/Model.js")
const Tag = require("./Tag.js")
const Activity = require("./Activity.js")
const { queryAsync, quotedList } = require("../utils")

class Category extends Model {
    static findBy = Model.findBy.bind({ model: Category, table: "categories" })
    static findAllBy = Model.findAllBy.bind({ model: Category, table: "categories" })

    constructor(values) {
        super({
            table: "categories",
            columns: ["id", "name", "user_id"],
            ...values
        })
    }

    async init() {
        // Get all tags for this category
        const results = await queryAsync(`SELECT tags.* FROM model_tags INNER JOIN tags ON model_tags.tag_id = tags.id WHERE model_tags.model_id = '${this.id}'`)
        this.tags = results.map(row => new Tag(row))
    }

    async storeTags(tagIds) {
        this.deleteReferences()

        // Store the new references in the database
        await queryAsync(`INSERT INTO model_tags VALUES ${tagIds.map(id => quotedList([uuid(), this.table, this.id, id])).join(",")}`)

        // Update model
        await this.init()
    }

    async delete() {
        // Delete all tag references from the database
        await queryAsync(`DELETE FROM model_tags WHERE model_id = '${this.id}'`)

        // Remove category from activities
        const activities = await Activity.findAllBy("category_id", this.id)
        
        await Promise.all(activities.map(async activity => {
            activity.category_id = null
            await activity.update()
        }))

        await super.delete()
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            tags: this.tags
        }
    }
}

module.exports = Category