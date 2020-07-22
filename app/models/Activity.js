const Model = require("../../lib/Model.js")

class Activity extends Model {
    static findBy = Model.findBy.bind({ model: Activity, table: "activities" })
    static findAllBy = Model.findAllBy.bind({ model: Activity, table: "activities" })

    constructor(values) {
        super({
            table: "activities",
            columns: ["id", "name", "category_id", "user_id"],
            ...values
        })
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            category_id: this.category_id
        }
    }
}

module.exports = Activity