const Model = require("../../lib/Model.js")

class Tag extends Model {
    static findBy = Model.findBy.bind({ model: Tag, table: "tags" })
    static findAllBy = Model.findAllBy.bind({ model: Tag, table: "tags" })

    constructor(values) {
        super({
            table: "tags",
            columns: ["id", "name", "user_id"],
            ...values
        })
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }
}

module.exports = Tag