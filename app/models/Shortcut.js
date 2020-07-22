const Model = require("../../lib/Model.js")

class Shortcut extends Model {
    static findBy = Model.findBy.bind({ model: Shortcut, table: "shortcuts" })
    static findAllBy = Model.findAllBy.bind({ model: Shortcut, table: "shortcuts" })

    constructor(values) {
        super({
            table: "shortcuts",
            columns: ["id", "icon", "activity_id", "user_id"],
            ...values
        })
    }

    toJSON() {
        return {
            id: this.id,
            icon: this.icon,
            activity_id: this.activity_id
        }
    }
}

module.exports = Shortcut