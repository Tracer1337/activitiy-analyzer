const {
    getAllActivities,
    validateCreate,
    validateUpdate,
    validateDelete,
    createActivity,
    updateActivity,
    deleteActivity
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

module.exports = {
    getAll,
    create,
    update,
    deletion
}