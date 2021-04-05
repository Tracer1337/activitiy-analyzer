const moment = require("moment")

const { getDurationMapFromPerformedActivities } = require("../Services/PerformedActivityServiceProvider.js")
const PerformedActivity = require("../Models/PerformedActivity.js")

async function analyzeDate(req, res) {
    // Validate date parameter
    if (!moment(req.params.date, "YYYY-MM-DD", true).isValid()) {
        return void res.status(400).send("Invalid date")
    }

    // Get performed activities for the day
    const performedActivities = await PerformedActivity.where(`
        finished_at LIKE '${req.params.date}%' AND
        user_id = '${req.user.id}'
    `)

    // Get distinct activities from performedActivities
    const activities = performedActivities
                        .filter((entry, index, array) => array.findIndex(_entry => entry.activity.id === _entry.activity.id) === index)
                        .map(entry => entry.activity)

    // Convert finished_at to moment objects
    performedActivities.forEach(entry => entry.finished_at = moment(entry.finished_at))

    if(!performedActivities.length) {
        return void res.status(404).end()
    }

    // Sort by finished_at DESC
    performedActivities.sort((a, b) => a.finished_at - b.finished_at)

    // Calculate duration between first and last entry
    const timeAwake = performedActivities[performedActivities.length - 1].finished_at - performedActivities[0].finished_at

    // Get duration map for that date
    const activityDurationMap = getDurationMapFromPerformedActivities(performedActivities)

    // Insert durations into activities
    activities.forEach(activity => {
        if(activityDurationMap[activity.id]) {
            const totalDuration = activityDurationMap[activity.id].reduce((sum, current) => sum += current, 0)
            activity.setTotalDurationForDate(totalDuration)
        }
    })

    // Create category array with durations
    const categories = []
    activities.forEach(activity => {
        if (!activity.total_duration_for_date) {
            return
        }

        let category = categories.find(category => category.id === activity.category.id)

        if (!category) {
            category = activity.category.clone()
            categories.push(category)
        }

        category.setTotalDurationForDate((category.getTotalDurationForDate() || 0) + activity.total_duration_for_date)
    })

    res.send({
        time_awake: timeAwake,
        activities,
        categories
    })
}

module.exports = {
    analyzeDate
}
