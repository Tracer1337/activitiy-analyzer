const { v4: uuid } = require("uuid")

const Model = require("../../lib/Model.js")
const Tag = require("./Tag.js")
const PerformedActivity = require("./PerformedActivity.js")
const Shortcut = require("./Shortcut.js")
const { queryAsync, quotedList } = require("../utils")

let Category

class Activity extends Model {
    static findBy = Model.findBy.bind({ model: Activity, table: "activities" })
    static findAllBy = Model.findAllBy.bind({ model: Activity, table: "activities" })

    constructor(values) {
        super({
            table: "activities",
            columns: ["id", "name", "category_id", "user_id"],
            ...values
        })

        // Loading Category in the head, causes it to be an empty object
        if(!Category) {
            Category = require("./Category")
        }
    }

    async init() {
        // Get all tags for this activity
        const results = await queryAsync(`SELECT tags.* FROM model_tags INNER JOIN tags ON model_tags.tag_id = tags.id WHERE model_tags.model_id = '${this.id}'`)
        this.tags = results.map(row => new Tag(row))

        // Get category of this activity
        this.category = this.category_id && await Category.findBy("id", this.category_id)
    }

    async storeTags(tagIds) {
        await this.deleteTags()

        if(tagIds.length) {
            // Store the new references in the database
            await queryAsync(`INSERT INTO model_tags VALUES ${tagIds.map(id => quotedList([uuid(), this.table, this.id, id])).join(",")}`)
        }
    }

    async deleteTags() {
        await queryAsync(`DELETE FROM model_tags WHERE model_id = '${this.id}'`)
    }

    async delete() {
        await this.deleteTags()

        // Remove activities from performed activities
        const performedActivities = await PerformedActivity.findAllBy("activity_id", this.id)

        await Promise.all(performedActivities.map(async performedActivity => {
            performedActivity.activity_id = null
            await performedActivity.update()
        }))

        // Delete shortcuts
        const shortcuts = await Shortcut.findAllBy("activity_id", this.id)

        await Promise.all(shortcuts.map(async shortcut => await shortcut.delete()))

        await super.delete()
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            tags: this.tags,
            category: this.category
        }
    }
}

module.exports = Activity