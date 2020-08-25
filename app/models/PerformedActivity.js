const moment = require("moment")

const Model = require("../../lib/Model.js")

let Activity

const cache = new Map()

class PerfomedActivity extends Model {
    static findBy = Model.findBy.bind({ model: PerfomedActivity, table: "performed_activities" })
    static where = Model.where.bind({ model: PerfomedActivity, table: "performed_activities" })

    static findAllBy = async (column, value) => {
        const models = await Model.findAllBy.call({
            model: PerfomedActivity,
            table: "performed_activities"
        }, column, value, { shouldInit: false })

        // Use cached instance to improve performance
        return await Promise.all(models.map(async (model) => {
            if (cache.has(model.id)) {
                return cache.get(model.id)
            }
            
            await model.init()
            
            // Store model to cache if it isn't from today
            if (!moment().isSame(model.finished_at, "day")) {
                cache.set(model.id, model)
            }

            return model
        }))
    }

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
        // Convert moment object to correct format
        if (this.finished_at.constructor.name === "Moment") {
            this.finished_at = this.finished_at.format("YYYY-MM-DD HH:mm:ss")
        }

        return {
            id: this.id,
            finished_at: this.finished_at,
            activity: this.activity
        }
    }
}

module.exports = PerfomedActivity