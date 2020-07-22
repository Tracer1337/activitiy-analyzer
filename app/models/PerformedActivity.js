const Model = require("../../lib/Model.js")

class PerfomedActivity extends Model {
    static findBy = Model.findBy.bind({ model: PerfomedActivity, table: "performed_activities" })
    static findAllBy = Model.findAllBy.bind({ model: PerfomedActivity, table: "performed_activities" })

    constructor(values) {
        super({
            table: "performed_activities",
            columns: ["id", "finished_at", "activity_id", "user_id"],
            ...values
        })
    }

    toJSON() {
        return {
            id: this.id,
            finished_at: this.finished_at,
            activity_id: this.activity_id
        }
    }
}

module.exports = PerfomedActivity