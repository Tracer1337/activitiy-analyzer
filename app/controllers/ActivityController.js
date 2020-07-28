const {
    validateCreate,
    validateUpdate,
    validateDelete,
    validateGetDetailed,
    createActivity,
    updateActivity,
    deleteActivity
} = require("../services/ActivityServiceProvider.js")
const { getDurations } = require("../services/PerformedActivityServiceProvider.js")
const Activity = require("../models/Activity.js")
const PerfomedActivity = require("../models/PerformedActivity.js")

async function getAll(req, res) {
    const activities = await Activity.findAllBy("user_id", req.user.id)

    if(req.query.details) {
        const performedActivities = await PerfomedActivity.findAllBy("user_id", req.user.id)
    
        // Insert total durations
        activities.forEach(activity => {
            const totalDuration = getDurations(activity, performedActivities).reduce((sum, current) => sum += current, 0)
            activity.setTotalDuration(totalDuration)
        })
    }


    res.send(activities)
}

async function create(req, res) {
    if(!(await validateCreate(req, res))) {
        return
    }

    const activity = await createActivity({
        user: req.user,
        values: req.body
    }, res)

    if (activity) {
        res.send(activity)
    }
}

async function update(req, res) {
    if(!(await validateUpdate(req, res))) {
        return
    }

    const activity = await updateActivity({
        user: req.user,
        values: req.body
    }, res)

    if (activity) {
        res.send(activity)
    }
}

async function deletion(req, res) {
    if(!(await validateDelete(req, res))) {
        return
    }

    const hasDeleted = await deleteActivity({
        id: req.body.id
    })

    if (hasDeleted) {
        res.send("Success")
    }
}

async function getDetailed(req, res) {
    if(!(await validateGetDetailed(req, res))) {
        return
    }

    const activity = await Activity.findBy("id", req.params.id)

    const performedActivities = await PerfomedActivity.findAllBy("user_id", req.user.id)

    // Get durations
    const durations = getDurations(activity, performedActivities)

    // Calculate total duration
    const totalDuration = durations.reduce((sum, current) => sum += current, 0)

    activity.setDurations(durations)
    activity.setTotalDuration(totalDuration)

    res.send(activity)
}

module.exports = {
    getAll,
    getDetailed,
    create,
    update,
    deletion
}