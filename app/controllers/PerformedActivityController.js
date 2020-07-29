const {
    getAllActivities,
    getActivitesByDate,
    validateCreate,
    validateUpdate,
    validateDelete,
    validateGetByDate,
    createActivity,
    updateActivity,
    deleteActivity,
    getDurationMapFromPerformedActivities
} = require("../services/PerformedActivityServiceProvider.js")

async function getAll(req, res) {
    const performedActivities = await getAllActivities(req.user)

    res.send(performedActivities)
}

async function getByDate(req, res) {
    if (!validateGetByDate(req, res)) {
        return
    }

    const performedActivities = await getActivitesByDate(req.user, req.query.date)

    if(req.query.date) {
        const durations = getDurationMapFromPerformedActivities(performedActivities)
    
        performedActivities.forEach(({ activity }) => {
            if (durations[activity.id]) {
                const totalDuration = durations[activity.id].reduce((sum, current) => sum += current, 0)
                activity.setTotalDurationForDate(totalDuration)
            }
        })
    }

    res.send(performedActivities)
}

async function create(req, res) {
    if (!(await validateCreate(req, res))) {
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
    if (!(await validateUpdate(req, res))) {
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
    if (!(await validateDelete(req, res))) {
        return
    }

    const hasDeleted = await deleteActivity({
        id: req.body.id
    })

    if (hasDeleted) {
        res.send("Success")
    }
}

module.exports = {
    getAll,
    getByDate,
    create,
    update,
    deletion
}