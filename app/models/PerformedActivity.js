const Model = require("../../lib/Model.js")

let Activity

class PerfomedActivity extends Model {
    static findBy = Model.findBy.bind({ model: PerfomedActivity, table: "performed_activities" })
    static findAllBy = Model.findAllBy.bind({ model: PerfomedActivity, table: "performed_activities" })

    constructor(values) {
        super({
            table: "performed_activities",
            columns: ["id", "finished_at", "activity_id", "user_id"],
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
            finished_at: this.finished_at,
            activity: this.activity
        }
    }
}

module.exports = PerfomedActivity