const Model = require("../../lib/Model.js")

let Activity

class Shortcut extends Model {
    static findBy = Model.findBy.bind({ model: Shortcut, table: "shortcuts" })
    static findAllBy = Model.findAllBy.bind({ model: Shortcut, table: "shortcuts" })
    static where = Model.where.bind({ model: Shortcut, table: "shortcuts" })

    constructor(values) {
        super({
            table: "shortcuts",
            columns: ["id", "icon", "activity_id", "user_id"],
            ...values
        })

        if(!Activity) {
            Activity = require("./Activity.js")
        }
    }

    async init() {
        this.activity = await Activity.findBy("id", this.activity_id)
    }

    toJSON() {
        return {
            id: this.id,
            icon: this.icon,
            activity: this.activity
        }
    }
}

module.exports = Shortcut