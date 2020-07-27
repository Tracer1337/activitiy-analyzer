const {
    getAllActivities,
    validateCreate,
    validateUpdate,
    validateDelete,
    validateGetDetailed,
    createActivity,
    updateActivity,
    deleteActivity,
    getActivityDetailed
} = require("../services/ActivityServiceProvider.js")

async function getAll(req, res) {
    const activities = await getAllActivities(req.user)

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

    const data = await getActivityDetailed({ id: req.params.id })

    res.send(data)
}

module.exports = {
    getAll,
    getDetailed,
    create,
    update,
    deletion
}