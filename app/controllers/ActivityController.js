const {
    validateCreate,
    validateUpdate,
    validateDelete,
    validateGetDetailed,
    createActivity,
    updateActivity,
    deleteActivity
} = require("../services/ActivityServiceProvider.js")

const {
    getDurationMap,
    fillMissingDates
} = require("../services/PerformedActivityServiceProvider.js")

const Activity = require("../models/Activity.js")

async function getAll(req, res) {
    const activities = await Activity.findAllBy("user_id", req.user.id)

    if(req.query.details) {
        const durationMap = await getDurationMap(req.user)
    
        // Insert total durations
        for(let activity of activities) {
            if(!(activity.id in durationMap)) {
                activity.setTotalDuration(0)
                continue
            }

            const totalDuration = durationMap[activity.id].reduce((sum, current) => sum += current, 0)
            activity.setTotalDuration(totalDuration)
        }

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

    // Get durations for activity
    const dateDurationsMap = (await getDurationMap(req.user, { useDates: true }))[activity.id]

    let totalDuration = 0
    
    if(!dateDurationsMap) {
        // Handle empty duration map
        activity.setTotalDuration(totalDuration)
        activity.setDurations([])
    } else {
        // Calculate total duration
        for (let durations of Object.values(dateDurationsMap)) {
            totalDuration += durations.reduce((sum, current) => sum += current, 0)
        }

        fillMissingDates(dateDurationsMap)
    
        activity.setTotalDuration(totalDuration)
        activity.setDurations(dateDurationsMap)
    }

    res.send(activity)
}

module.exports = {
    getAll,
    getDetailed,
    create,
    update,
    deletion
}