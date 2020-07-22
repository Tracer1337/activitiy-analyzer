const Model = require("../../lib/Model.js")
const Tag = require("./Tag.js")
const { queryAsync } = require("../utils")

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

    async setTags(tagIds) {
        // Store the new references in the database
        console.log(tagIds)
        return
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