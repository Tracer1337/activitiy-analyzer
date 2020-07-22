const Model = require("../../lib/Model.js")
const { queryAsync } = require("../utils")

let tableToModel

class Tag extends Model {
    static findBy = Model.findBy.bind({ model: Tag, table: "tags" })
    static findAllBy = Model.findAllBy.bind({ model: Tag, table: "tags" })

    constructor(values) {
        super({
            table: "tags",
            columns: ["id", "name", "user_id"],
            ...values
        })

        if(!tableToModel) {
            tableToModel = {
                "categories": require("./Category.js"),
                "activities": require("./Activity.js")
            }
        }
    }

    async init() {
        // Get models bound to this tag
        const results = await queryAsync(`
            SELECT model_tags.model_name, model_tags.model_id 
            FROM model_tags 
            INNER JOIN tags ON model_tags.tag_id = tags.id 
            WHERE tags.id = '${this.id}' AND tags.user_id = '${this.user_id}'
        `)

        this.models = []

        for(let { model_name, model_id } of results) {
            // Get model from database
            const data = await queryAsync(`SELECT * FROM ${model_name} WHERE id = '${model_id}'`)
            const model = new tableToModel[model_name](data[0])

            this.models.push({
                model_name,
                model
            })
        }

        // Init models
        await Promise.all(this.models.map(async ({model}) => await model.init()))
    }

    async delete() {
        // Delete model references
        await queryAsync(`DELETE FROM model_tags WHERE tag_id = '${this.id}'`)

        await super.delete()
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            models: this.models
        }
    }
}

module.exports = Tag